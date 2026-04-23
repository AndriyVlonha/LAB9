import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { GAS } from '../context/TrafficLightsContext'
import F1TrafficLight from '../components/F1TrafficLight'

// Порядок кольорів авто-світлофора
const CAR_COLORS = [
    { color: 'green', label: 'Зелений', hex: '#00e676' },
    { color: 'yellow', label: 'Жовтий', hex: '#ffc107' },
    { color: 'red', label: 'Червоний', hex: '#ff3b3b' },
]

// green(0) -> yellow(1) -> red(2) -> yellow(1)
const CYCLE = [0, 1, 2, 1]

const F1TrafficLightPage = () => {
    const { user } = useAuth()

    const [carAuto, setCarAuto] = useState(false)
    const [greenDur, setGreenDur] = useState(10)
    const [yellowDur, setYellowDur] = useState(3)
    const [redDur, setRedDur] = useState(10)
    const [carSound, setCarSound] = useState(false)

    const [f1Interval, setF1Interval] = useState(10) // this is Red Dur
    const [f1GreenDur, setF1GreenDur] = useState(5)
    const [f1Auto, setF1Auto] = useState(false)
    const [f1Size, setF1Size] = useState(90)
    const [f1Sound, setF1Sound] = useState(false)

    // Звуки
    const playBeep = useCallback((type) => {
        if (type === 'car_transition' && !carSound) return
        if (type !== 'car_transition' && !f1Sound) return

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)

            if (type === 'f1_tick') {
                osc.frequency.value = 800
                osc.type = 'square'
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
                osc.start(ctx.currentTime)
                osc.stop(ctx.currentTime + 0.15)
            } else if (type === 'f1_start') {
                osc.frequency.value = 1000
                osc.type = 'square'
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
                osc.start(ctx.currentTime)
                osc.stop(ctx.currentTime + 1.5)
            } else if (type === 'f1_stop') {
                osc.frequency.value = 300
                osc.type = 'sawtooth'
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
                osc.start(ctx.currentTime)
                osc.stop(ctx.currentTime + 0.8)
            } else if (type === 'car_transition') {
                osc.frequency.value = 150
                osc.type = 'square'
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
                osc.start(ctx.currentTime)
                osc.stop(ctx.currentTime + 0.06)
            }
        } catch (e) {
            console.error(e)
        }
    }, [f1Sound, carSound])

    const [f1Toggles, setF1Toggles] = useState(0)
    const [carCycles, setCarCycles] = useState(0)

    // Завантаження початкової статистики
    useEffect(() => {
        fetch(`${GAS}?action=getF1Stats`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'ok' && res.data) {
                    setF1Toggles(res.data.f1Toggles || 0)
                    setCarCycles(res.data.carCycles || 0)
                }
            })
            .catch(e => console.error("Stats fetching error", e))
    }, [])

    const addF1ToggleServer = () => fetch(`${GAS}?action=addF1Toggle`).catch(() => {})
    const addCarCycleServer = () => fetch(`${GAS}?action=addCarCycle`).catch(() => {})
    const resetStatsServer = () => fetch(`${GAS}?action=resetF1Stats`).catch(() => {})

    const [cycleIndex, setCycleIndex] = useState(0)
    const activeColorIndex = CYCLE[cycleIndex]
    const carColor = CAR_COLORS[activeColorIndex]
    const isCarGreen = carColor.color === 'green'

    const durations = useMemo(() => ({
        green: greenDur * 1000,
        yellow: yellowDur * 1000,
        red: redDur * 1000,
    }), [greenDur, yellowDur, redDur])

    // Стан F1
    const [f1State, setF1State] = useState('stop')
    const f1StateRef = useRef(f1State)
    f1StateRef.current = f1State
    const f1Timer = useRef(null)
    const f1TickRef = useRef(null)
    const [f1TimeLeft, setF1TimeLeft] = useState(0)
    const [f1Progress, setF1Progress] = useState(0)

    // Таймер зворотного відліку
    const [timeLeft, setTimeLeft] = useState(0)
    const [progress, setProgress] = useState(0)
    const carTimerRef = useRef(null)
    const tickRef = useRef(null)

    useEffect(() => {
        if (!carAuto) {
            setTimeLeft(0)
            setProgress(0)
            clearTimeout(carTimerRef.current)
            clearInterval(tickRef.current)
            return
        }

        const schedule = () => {
            const currentCIndex = CYCLE[cycleIndex]
            const dur = durations[CAR_COLORS[currentCIndex].color] || 10000
            const startTime = Date.now()
            setTimeLeft(Math.ceil(dur / 1000))
            setProgress(0)

            clearInterval(tickRef.current)
            tickRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime
                const remaining = Math.max(0, dur - elapsed)
                setTimeLeft(Math.ceil(remaining / 1000))
                setProgress(Math.min((elapsed / dur) * 100, 100))
            }, 50)

            carTimerRef.current = setTimeout(() => {
                const next = (cycleIndex + 1) % CYCLE.length
                setCycleIndex(next)
                playBeep('car_transition')
                if (next === 0) {
                    setCarCycles(c => c + 1)
                    addCarCycleServer()
                }
            }, dur)
        }

        schedule()

        return () => {
            clearTimeout(carTimerRef.current)
            clearInterval(tickRef.current)
        }
    }, [cycleIndex, carAuto, durations, playBeep])

    // Ручне перемикання авто
    const nextCarColor = useCallback(() => {
        setCycleIndex(prev => (prev + 1) % CYCLE.length)
        playBeep('car_transition')
    }, [playBeep])

    const setCarTo = useCallback((idx) => {
        // Find which cycle index has this color first
        const found = CYCLE.indexOf(idx)
        setCycleIndex(found !== -1 ? found : 0)
    }, [])

    // Синхронізація: зелений авто → F1 = стоп
    useEffect(() => {
        if (isCarGreen) setF1State('stop')
    }, [isCarGreen])

    // F1 interval using schedule approach for exact syncing and sounds
    useEffect(() => {
        if (!f1Auto || isCarGreen) {
            clearTimeout(f1Timer.current)
            clearInterval(f1TickRef.current)
            setF1Progress(0)
            setF1TimeLeft(0)
            return
        }

        const scheduleF1 = () => {
            const currentSt = f1StateRef.current
            const dur = (currentSt === 'stop' ? f1Interval : f1GreenDur) * 1000
            const startTime = Date.now()
            
            setF1TimeLeft(Math.ceil(dur / 1000))
            setF1Progress(0)

            clearInterval(f1TickRef.current)
            let lastBeepSec = -1

            f1TickRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime
                const remaining = Math.max(0, dur - elapsed)
                const secsRemaining = Math.ceil(remaining / 1000)
                
                setF1TimeLeft(secsRemaining)
                setF1Progress(Math.min((elapsed / dur) * 100, 100))
                
                if (currentSt === 'stop' && secsRemaining <= 5 && secsRemaining !== lastBeepSec && remaining > 0) {
                    lastBeepSec = secsRemaining
                    if (secsRemaining > 0) playBeep('f1_tick')
                }
            }, 50)

            f1Timer.current = setTimeout(() => {
                const nextSt = currentSt === 'stop' ? 'start' : 'stop'
                setF1State(nextSt)
                
                if (nextSt === 'start') playBeep('f1_start')
                else playBeep('f1_stop')
                
                setF1Toggles(t => t + 1)
                addF1ToggleServer()
            }, dur)
        }

        scheduleF1()

        return () => {
            clearTimeout(f1Timer.current)
            clearInterval(f1TickRef.current)
        }
    }, [isCarGreen, f1Interval, f1GreenDur, f1Auto, f1State, playBeep])

    const toggleF1 = useCallback(() => {
        if (isCarGreen) return
        const nextSt = f1StateRef.current === 'stop' ? 'start' : 'stop'
        setF1State(nextSt)
        
        if (nextSt === 'start') playBeep('f1_start')
        else playBeep('f1_stop')
        
        setF1Toggles(t => t + 1)
        addF1ToggleServer()
    }, [isCarGreen, playBeep])

    // Скинути лічильники
    const resetCounters = useCallback(() => {
        setF1Toggles(0)
        setCarCycles(0)
        resetStatsServer()
    }, [])

    return (
        <div className="flex gap-6 p-8 max-w-[1200px] mx-auto min-h-[calc(100vh-64px)] items-start">

            {/* Сайдбар */}
            <aside className="w-60 flex-shrink-0 sticky top-[80px] flex flex-col gap-4">

                <div className="pb-3 border-b border-base-300">
                    <p className="text-[9px] font-mono tracking-[3px] uppercase text-base-content/50 mb-1">
                        Синхронізація
                    </p>
                    <h2 className="text-xl font-bold">Світлофор F1</h2>
                </div>

                {/* Авто-світлофор */}
                <div className="card bg-base-200 border border-base-300 shadow">
                    <div className="card-body p-4 gap-3">
                        <span className="text-[9px] font-mono tracking-[2px] uppercase text-primary">
                            🚗 Авто-світлофор
                        </span>

                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs text-base-content/70">Автоцикл</span>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary"
                                checked={carAuto} onChange={e => setCarAuto(e.target.checked)} />
                        </label>

                        <div className="flex gap-1">
                            {CAR_COLORS.map((c, i) => (
                                <button key={c.color}
                                    className={`btn btn-xs flex-1 ${activeColorIndex === i ? 'btn-active' : 'btn-ghost'}`}
                                    onClick={() => setCarTo(i)}
                                    style={{ borderColor: c.hex, color: activeColorIndex === i ? '#fff' : c.hex, background: activeColorIndex === i ? c.hex : 'transparent' }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        <div className="divider my-0" />

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Зелений (с)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="3" max="30" step="1" value={greenDur}
                                    onChange={e => setGreenDur(Number(e.target.value))}
                                    className="range range-xs range-success flex-1" />
                                <span className="font-mono text-xs w-7 text-right">{greenDur}</span>
                            </div>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Жовтий (с)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="1" max="10" step="1" value={yellowDur}
                                    onChange={e => setYellowDur(Number(e.target.value))}
                                    className="range range-xs range-warning flex-1" />
                                <span className="font-mono text-xs w-7 text-right">{yellowDur}</span>
                            </div>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Червоний (с)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="3" max="30" step="1" value={redDur}
                                    onChange={e => setRedDur(Number(e.target.value))}
                                    className="range range-xs range-error flex-1" />
                                <span className="font-mono text-xs w-7 text-right">{redDur}</span>
                            </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs text-base-content/70">Звук перемикання</span>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary"
                                checked={carSound} onChange={e => setCarSound(e.target.checked)} />
                        </label>
                    </div>
                </div>

                {/* Світлофор F1 */}
                <div className="card bg-base-200 border border-base-300 shadow">
                    <div className="card-body p-4 gap-3">
                        <span className="text-[9px] font-mono tracking-[2px] uppercase text-primary">
                            🏎️ Світлофор F1
                        </span>

                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs text-base-content/70">Авто-перемикання</span>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary"
                                checked={f1Auto} onChange={e => setF1Auto(e.target.checked)} />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Червоний (с)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="3" max="30" step="1" value={f1Interval}
                                    onChange={e => setF1Interval(Number(e.target.value))}
                                    className="range range-xs range-error flex-1"
                                    disabled={!f1Auto} />
                                <span className="font-mono text-xs w-7 text-right">{f1Interval}</span>
                            </div>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Зелений (с)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="1" max="30" step="1" value={f1GreenDur}
                                    onChange={e => setF1GreenDur(Number(e.target.value))}
                                    className="range range-xs range-success flex-1"
                                    disabled={!f1Auto} />
                                <span className="font-mono text-xs w-7 text-right">{f1GreenDur}</span>
                            </div>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Розмір ламп (px)
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="50" max="130" step="5" value={f1Size}
                                    onChange={e => setF1Size(Number(e.target.value))}
                                    className="range range-xs range-primary flex-1" />
                                <span className="font-mono text-xs w-7 text-right">{f1Size}</span>
                            </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer pt-2">
                            <span className="text-xs text-base-content/70">Звук перемикання</span>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary"
                                checked={f1Sound} onChange={e => setF1Sound(e.target.checked)} />
                        </label>

                        <div className="divider my-0" />

                        <button
                            id="f1-toggle-btn"
                            className={`btn btn-sm w-full ${isCarGreen ? 'btn-disabled' : 'btn-primary'}`}
                            disabled={isCarGreen}
                            onClick={toggleF1}
                        >
                            {isCarGreen
                                ? '🔒 Заблоковано'
                                : f1State === 'stop'
                                    ? '🟢 Старт'
                                    : '🔴 Стоп'
                            }
                        </button>

                        {isCarGreen && (
                            <p className="text-[10px] text-warning">
                                Кнопка заблокована: авто = зелений
                            </p>
                        )}
                    </div>
                </div>

                {/* Статистика */}
                <div className="card bg-base-200 border border-base-300 shadow">
                    <div className="card-body p-4 gap-2">
                        <span className="text-[9px] font-mono tracking-[2px] uppercase text-primary">
                            📊 Статистика
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="badge badge-ghost font-mono text-[10px]">
                                F1 перемк.: {f1Toggles}
                            </div>
                            <div className="badge badge-ghost font-mono text-[10px]">
                                Авто циклів: {carCycles}
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-xs w-full" onClick={resetCounters}>
                            Скинути
                        </button>
                    </div>
                </div>

                <div className="badge badge-ghost font-mono text-[10px] self-start">
                    👤 {user?.username}
                </div>
            </aside>

            {/* Сцена — однакова висота */}
            <section className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">

                {/* Авто-світлофор */}
                <motion.div
                    className="card bg-base-200 border border-base-300 shadow overflow-hidden flex-1 flex flex-col"
                    initial={{ opacity: 0, y: 32, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                >
                    <div className="flex items-center justify-between px-3 py-2 bg-base-300 border-b border-base-300">
                        <span className="font-mono text-[9px] tracking-[2px] uppercase text-base-content/60">
                            Автомобільний
                        </span>
                        {!carAuto && (
                            <button className="btn btn-ghost btn-xs text-primary" onClick={nextCarColor}>
                                ⏭ Далі
                            </button>
                        )}
                    </div>

                    <div className="p-6 flex justify-center items-center flex-1 bg-gradient-to-b from-base-300 to-base-200">
                        <div className="flex justify-center">
                            <div
                                className="flex flex-col items-center gap-3 rounded-[44px] p-5 relative"
                                style={{
                                    background: '#0a0c14',
                                    border: '1.5px solid #181d30',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,.6), 0 6px 24px rgba(0,0,0,.45)',
                                }}
                            >
                                {CAR_COLORS.map(({ color, hex }) => {
                                    const active = carColor.color === color
                                    return (
                                        <div key={color} className="relative" style={{ width: 76, height: 76 }}>
                                            <div className="absolute inset-[-4px] rounded-full"
                                                style={{
                                                    background: 'radial-gradient(circle at 40% 35%, #0c0d18 0%, #070810 70%)',
                                                    border: '1.5px solid #111325',
                                                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,.9)',
                                                }} />
                                            <div
                                                className="absolute inset-0 rounded-full z-10 transition-opacity duration-500"
                                                style={{
                                                    background: `radial-gradient(circle at 34% 27%,
                                                        color-mix(in srgb, ${hex} 28%, white) 0%,
                                                        ${hex} 38%,
                                                        color-mix(in srgb, ${hex} 52%, black) 72%,
                                                        color-mix(in srgb, ${hex} 28%, black) 100%)`,
                                                    boxShadow: active
                                                        ? `0 0 16px color-mix(in srgb, ${hex} 52%, transparent),
                                                           0 0 48px color-mix(in srgb, ${hex} 22%, transparent),
                                                           inset 0 -3px 6px rgba(0,0,0,.45),
                                                           inset 0 2px 4px rgba(255,255,255,.1)`
                                                        : 'inset 0 -3px 6px rgba(0,0,0,.45)',
                                                    opacity: active ? 1 : 0.08,
                                                }}
                                            />
                                            <div className="absolute z-20 rounded-full pointer-events-none"
                                                style={{
                                                    top: '13%', left: '17%', width: '30%', height: '18%',
                                                    background: 'rgba(255,255,255,.2)', filter: 'blur(3px)',
                                                    opacity: active ? 1 : 0.3,
                                                }} />
                                        </div>
                                    )
                                })}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                            </div>
                        </div>
                    </div>

                    {/* Прогрес + таймер */}
                    <div className="flex flex-col bg-base-300 border-t border-base-300 mt-auto">
                        {carAuto && (
                            <div className="h-[3px] bg-base-100">
                                <div className="h-full transition-all duration-100 ease-linear rounded-r"
                                    style={{ width: `${progress}%`, background: carColor.hex }} />
                            </div>
                        )}
                        <div className="flex justify-center gap-3 px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className="w-[8px] h-[8px] rounded-full animate-pulse" style={{ background: carColor.hex }} />
                                <span className="font-mono text-[10px] text-base-content/60">{carColor.label}</span>
                            </div>
                            {carAuto && (
                                <div className="font-mono text-[10px] text-base-content/60 tabular-nums">
                                    ⏱ {timeLeft}с
                                </div>
                            )}
                            <div className="font-mono text-[10px] text-base-content/40">
                                {carAuto ? `⚡ ${durations[carColor.color] / 1000}с` : '✋ Ручний'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* F1 світлофор */}
                <motion.div
                    className="card bg-base-200 border border-base-300 shadow overflow-hidden flex-1 flex flex-col"
                    initial={{ opacity: 0, y: 32, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
                >
                    <div className="flex items-center justify-between px-3 py-2 bg-base-300 border-b border-base-300">
                        <span className="font-mono text-[9px] tracking-[2px] uppercase text-base-content/60">
                            Формула-1
                        </span>
                        <span className="font-mono text-[9px] text-base-content/40">
                            {f1Auto ? `кожні ${f1Interval}с` : 'ручний'}
                        </span>
                    </div>

                    <div className="p-6 flex justify-center items-center flex-1 bg-gradient-to-b from-base-300 to-base-200">
                        <F1TrafficLight state={f1State} size={f1Size} />
                    </div>

                    {/* Статус + кнопка */}
                    <div className="flex flex-col bg-base-300 border-t border-base-300 mt-auto">
                        {f1Auto && (
                            <div className="h-[3px] bg-base-100">
                                <div className="h-full transition-all duration-100 ease-linear rounded-r"
                                    style={{ width: `${f1Progress}%`, background: f1State === 'stop' ? '#ff3b3b' : '#00e676' }} />
                            </div>
                        )}
                        <div className="flex flex-col gap-2 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-[8px] h-[8px] rounded-full animate-pulse"
                                        style={{ background: f1State === 'stop' ? '#ff3b3b' : '#00e676' }} />
                                    <span className="font-mono text-[10px] text-base-content/60">
                                        {f1State === 'stop' ? 'Стоп' : 'Старт'}
                                    </span>
                                    {f1Auto && (
                                        <span className="font-mono text-[10px] text-base-content/60 tabular-nums ml-1">
                                            ⏱ {f1TimeLeft}с
                                        </span>
                                    )}
                                </div>
                                {isCarGreen && (
                                    <span className="text-[9px] text-warning font-mono">🔒 Зелений авто</span>
                                )}
                            </div>
                            <button
                                className={`btn btn-sm w-full ${isCarGreen ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={isCarGreen}
                                onClick={toggleF1}
                            >
                                {isCarGreen
                                    ? 'Заблоковано'
                                    : f1State === 'stop'
                                        ? '🟢 Перемкнути на Старт'
                                        : '🔴 Перемкнути на Стоп'
                                }
                            </button>
                        </div>
                    </div>
                </motion.div>

            </section>
        </div>
    )
}

export default F1TrafficLightPage
