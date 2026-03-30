import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

const GAS = 'https://script.google.com/macros/s/AKfycbyj3DgXUKfDEjzeWb1GpGULd1z7dwH7nhj-h_Dic0wcG0lmegQwYV8NKoF86Ae85-pBlQ/exec'
const api = {
    getLights: () => fetch(`${GAS}?action=getAllLights`).then(r => r.json()).then(r => r.data),
    addClick: (id, color) => fetch(`${GAS}?action=addClick&id=${id}&color=${color}`).then(r => r.json()),
    createLight: (name, ori) => fetch(`${GAS}?action=addLight&name=${encodeURIComponent(name)}&orientation=${ori}`).then(r => r.json()),
    deleteLight: (id) => fetch(`${GAS}?action=deleteLight&id=${id}`).then(r => r.json()),
    setOrientation: (id, ori) => fetch(`${GAS}?action=setOrientation&id=${id}&orientation=${ori}`).then(r => r.json()),
    setColor: (id, color) => fetch(`${GAS}?action=setColor&id=${id}&color=${color}`).then(r => r.json()),
}

// ─── GAS повертає плоский об'єкт → конвертуємо у формат додатку ──────────────
function gasToLight(g) {
    return {
        id: g.id,
        name: g.name,
        orientation: g.orientation || 'vertical',
        colors: [
            { id: 'red', label: 'Червоний', hex: '#ff3b3b', clicks: Number(g.redClicks) || 0 },
            { id: 'yellow', label: 'Жовтий', hex: '#ffc107', clicks: Number(g.yellowClicks) || 0 },
            { id: 'green', label: 'Зелений', hex: '#00e676', clicks: Number(g.greenClicks) || 0 },
        ],
    }
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_COLORS = [
    { id: 'red', label: 'Червоний', hex: '#ff3b3b', clicks: 0 },
    { id: 'yellow', label: 'Жовтий', hex: '#ffc107', clicks: 0 },
    { id: 'green', label: 'Зелений', hex: '#00e676', clicks: 0 },
]
const DEFAULT_LIGHTS = [{ id: 1, name: 'Світлофор #1', orientation: 'vertical', colors: DEFAULT_COLORS }]
const DEFAULT_SETTINGS = { blinkCount: 3, brightness: 1.0 }

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return { ...state, lights: action.lights, settings: action.settings, loading: false }

        case 'ADD_LIGHT':
            return { ...state, lights: [...state.lights, action.light] }

        // ДОДАНО: Оновлення тимчасового ID на справжній з бази даних
        case 'UPDATE_LIGHT_ID':
            return {
                ...state,
                lights: state.lights.map(l => l.id === action.oldId ? { ...l, id: action.newId } : l)
            }

        case 'REMOVE_LIGHT':
            return { ...state, lights: state.lights.filter(l => l.id !== action.id) }

        case 'CLICK_COLOR':
            return {
                ...state,
                lights: state.lights.map(l => l.id !== action.lightId ? l : {
                    ...l,
                    colors: l.colors.map(c => c.id === action.colorId ? { ...c, clicks: c.clicks + 1 } : c)
                })
            }

        case 'TOGGLE_ORIENTATION':
            return {
                ...state,
                lights: state.lights.map(l => l.id !== action.id ? l : {
                    ...l,
                    orientation: l.orientation === 'vertical' ? 'horizontal' : 'vertical'
                })
            }

        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.data } }

        default:
            return state
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TrafficLightsContext = createContext(null)

export function TrafficLightsProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        lights: [], settings: DEFAULT_SETTINGS, loading: true,
    })

    // Завантаження з Google Sheets при монтуванні
    useEffect(() => {
        api.getLights()
            .then(data => dispatch({ type: 'INIT', lights: data.map(gasToLight), settings: DEFAULT_SETTINGS }))
            .catch(() => dispatch({ type: 'INIT', lights: DEFAULT_LIGHTS, settings: DEFAULT_SETTINGS }))
    }, [])

    // Додати світлофор (ВИПРАВЛЕНО РОЗСИНХРОНІЗАЦІЮ ID)
    const addLight = useCallback(async () => {
        const tempId = Date.now()
        // Робимо ім'я коротшим, беручи останні 4 цифри timestamp
        const name = `Світлофор #${tempId.toString().slice(-4)}`
        const light = { id: tempId, name, orientation: 'vertical', colors: DEFAULT_COLORS.map(c => ({ ...c })) }

        // Оптимістично додаємо в UI
        dispatch({ type: 'ADD_LIGHT', light })

        try {
            const response = await api.createLight(name, 'vertical')
            // Оновлюємо ID на той, що повернув Google Apps Script
            if (response && response.id) {
                dispatch({ type: 'UPDATE_LIGHT_ID', oldId: tempId, newId: response.id })
            }
        } catch { /* offline */ }
    }, [])

    // Видалити світлофор
    const removeLight = useCallback(async (id) => {
        dispatch({ type: 'REMOVE_LIGHT', id })
        try { await api.deleteLight(id) } catch { /* offline */ }
    }, [])

    // Клік по кольору → +1 клік + зберігаємо в Google Sheets
    const clickColor = useCallback(async (lightId, colorId) => {
        dispatch({ type: 'CLICK_COLOR', lightId, colorId })
        try { await api.addClick(lightId, colorId) } catch { /* offline */ }
    }, [])

    // Перемкнути орієнтацію vertical ↔ horizontal
    const toggleOrientation = useCallback(async (id, currentOrientation) => {
        const newOri = currentOrientation === 'vertical' ? 'horizontal' : 'vertical'
        dispatch({ type: 'TOGGLE_ORIENTATION', id })
        try { await api.setOrientation(id, newOri) } catch { /* offline */ }
    }, [])

    // Оновити налаштування (яскравість, моргання)
    const updateSettings = useCallback(async (data) => {
        dispatch({ type: 'UPDATE_SETTINGS', data })
    }, [])

    return (
        <TrafficLightsContext.Provider value={{
            lights: state.lights,
            settings: state.settings,
            loading: state.loading,
            addLight,
            removeLight,
            clickColor,
            toggleOrientation,
            updateSettings,
        }}>
            {children}
        </TrafficLightsContext.Provider>
    )
}

export function useTrafficLights() {
    const ctx = useContext(TrafficLightsContext)
    if (!ctx) throw new Error('useTrafficLights must be inside TrafficLightsProvider')
    return ctx
}