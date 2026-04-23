import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrafficLights } from '../context/TrafficLightsContext'
import TrafficLights from './TrafficLights'

const COLORS_META = [
    { key: 'red', hex: '#ff3b3b', label: 'Червоний' },
    { key: 'yellow', hex: '#ffc107', label: 'Жовтий' },
    { key: 'green', hex: '#00e676', label: 'Зелений' },
]

const COLOR_ORDER = ['green', 'yellow', 'red', 'yellow']
const DEFAULT_SPEED = 3 // секунди на колір

// Окрема картка світлофора з авто-режимом
const TrafficLightCard = ({ light, orientation, settings, clickColor, removeLight, playBeep }) => {
    const [autoMode, setAutoMode] = useState(false)
    const [activeColor, setActiveColor] = useState(null)
    const [showSettings, setShowSettings] = useState(false)

    // Швидкість для кожного кольору окремо
    const [speeds, setSpeeds] = useState({ red: 3, yellow: 2, green: 3 })
    const updateSpeed = (color, val) => setSpeeds(prev => ({ ...prev, [color]: val }))

    const cycleIndexRef = useRef(0)
    const timerRef = useRef(null)
    const clickColorRef = useRef(clickColor)
    clickColorRef.current = clickColor

    // Автоцикл
    useEffect(() => {
        if (!autoMode) {
            setActiveColor(null)
            clearTimeout(timerRef.current)
            return
        }

        cycleIndexRef.current = 0
        setActiveColor(COLOR_ORDER[0])

        const tick = () => {
            const currentColor = COLOR_ORDER[cycleIndexRef.current]
            const dur = speeds[currentColor] * 1000

            timerRef.current = setTimeout(() => {
                cycleIndexRef.current = (cycleIndexRef.current + 1) % COLOR_ORDER.length
                const nextColor = COLOR_ORDER[cycleIndexRef.current]
                setActiveColor(nextColor)
                playBeep('transition')
                clickColorRef.current(light.id, nextColor)
                tick()
            }, dur)
        }

        tick()

        return () => clearTimeout(timerRef.current)
    }, [autoMode, speeds, light.id])

    const toggleAuto = useCallback(() => {
        setAutoMode(prev => !prev)
    }, [])

    return (
        <motion.div
            className={`card bg-base-200 border border-base-300 shadow overflow-hidden ${orientation === 'horizontal' ? 'w-[340px]' : 'w-[190px]'}`}
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, y: -16 }}
            layout
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
            {/* Заголовок */}
            <div className="flex items-center justify-between px-3 py-2 bg-base-300 border-b border-base-300">
                <span className="font-mono text-[9px] tracking-[2px] uppercase text-base-content/60">
                    {light.name}
                </span>
                <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary"
                        onClick={() => setShowSettings(s => !s)}
                        title="Налаштування">
                        ⚙
                    </button>
                    <button className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        onClick={() => removeLight(light.id)}>✕</button>
                </div>
            </div>

            {/* Лампи */}
            <div className="p-5 flex justify-center bg-gradient-to-b from-base-300 to-base-200">
                <TrafficLights
                    colors={light.colors}
                    orientation={orientation}
                    onLightClick={colorId => clickColor(light.id, colorId)}
                    blinkCount={settings.blinkCount}
                    brightness={settings.brightness}
                    activeColor={activeColor}
                />
            </div>

            {/* Панель налаштувань */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        className="px-3 py-3 bg-base-300/60 border-t border-base-300 flex flex-col gap-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-[9px] font-mono tracking-[2px] uppercase text-primary">
                            ⚙ Швидкість (с)
                        </span>
                        {COLORS_META.map(({ key, hex, label }) => (
                            <label key={key} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: hex }} />
                                    <span className="text-[9px] text-base-content/50 flex-1">{label}</span>
                                    <span className="font-mono text-[9px] w-5 text-right">{speeds[key]}</span>
                                </div>
                                <input type="range" min="1" max="10" step="1" value={speeds[key]}
                                    onChange={e => updateSpeed(key, Number(e.target.value))}
                                    className="range range-xs flex-1"
                                    style={{ '--range-shdw': hex }} />
                            </label>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Авто-режим */}
            <div className="flex items-center justify-between px-3 py-2 bg-base-300/50 border-t border-base-300">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="toggle toggle-xs toggle-primary"
                        checked={autoMode} onChange={toggleAuto} />
                    <span className="text-[10px] text-base-content/60">Авто</span>
                </label>
                {autoMode && activeColor && (
                    <div className="flex items-center gap-1">
                        <span className="w-[6px] h-[6px] rounded-full animate-pulse"
                            style={{ background: COLORS_META.find(c => c.key === activeColor)?.hex }} />
                        <span className="font-mono text-[9px] text-base-content/50">
                            {COLORS_META.find(c => c.key === activeColor)?.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Лічильники */}
            <div className="flex justify-center gap-3 px-3 py-2 bg-base-300 border-t border-base-300">
                {COLORS_META.map(({ key, hex }) => {
                    const c = light.colors.find(c => c.id === key)
                    return (
                        <div key={key} className="flex items-center gap-1">
                            <span className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                                style={{ background: hex }} />
                            <span className="font-mono text-[10px] text-base-content/60">
                                {c?.clicks ?? 0}
                            </span>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

// Сторінка з фільтрацією за орієнтацією
const TrafficLightPage = ({ orientation }) => {
    const { lights, settings, addLight, removeLight, clickColor, updateSettings } = useTrafficLights()
    const [soundEnabled, setSoundEnabled] = useState(true)

    const playBeep = useCallback((type) => {
        if (!soundEnabled) return
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)

            if (type === 'tick') {
                osc.frequency.value = 800
                osc.type = 'square'
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
                osc.start(ctx.currentTime)
                osc.stop(ctx.currentTime + 0.15)
            } else if (type === 'transition') {
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
    }, [soundEnabled])

    const filtered = lights.filter(l => l.orientation === orientation)

    const total = filtered.reduce((s, l) =>
        s + l.colors.reduce((a, c) => a + c.clicks, 0), 0)

    const label = orientation === 'vertical' ? 'Вертикальний' : 'Горизонтальний'

    return (
        <div className="flex gap-6 p-8 max-w-[1200px] mx-auto min-h-[calc(100vh-64px)] items-start">

            <aside className="w-56 flex-shrink-0 sticky top-[80px] flex flex-col gap-4">

                <div className="pb-3 border-b border-base-300">
                    <p className="text-[9px] font-mono tracking-[3px] uppercase text-base-content/50 mb-1">
                        {label}
                    </p>
                    <h2 className="text-xl font-bold">Світлофор</h2>
                </div>

                <div className="card bg-base-200 border border-base-300 shadow">
                    <div className="card-body p-4 gap-4">

                        <label className="flex flex-col gap-2">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Кількість морганнь
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="1" max="10" step="1"
                                    value={settings.blinkCount}
                                    onChange={e => updateSettings({ blinkCount: Number(e.target.value) })}
                                    className="range range-xs range-primary flex-1" />
                                <span className="font-mono text-xs w-7 text-right">{settings.blinkCount}x</span>
                            </div>
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Яскравість
                            </span>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0.15" max="1" step="0.05"
                                    value={settings.brightness}
                                    onChange={e => updateSettings({ brightness: parseFloat(e.target.value) })}
                                    className="range range-xs range-primary flex-1" />
                                <span className="font-mono text-xs w-9 text-right">
                                    {Math.round(settings.brightness * 100)}%
                                </span>
                            </div>
                            <div className="h-[3px] rounded-full"
                                style={{
                                    background: 'linear-gradient(to right, #ff3b3b, #ffc107, #00e676)',
                                    opacity: settings.brightness,
                                }} />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer pt-2">
                            <span className="text-[9px] font-mono tracking-[2px] uppercase text-base-content/50">Звук перемикання</span>
                            <input type="checkbox" className="toggle toggle-sm toggle-primary"
                                checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
                        </label>

                        <div className="divider my-0" />

                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="badge badge-ghost font-mono text-[10px]">
                                🚦 {filtered.length}
                            </div>
                            <div className="badge badge-primary font-mono text-[10px]">
                                кліків {total}
                            </div>
                        </div>

                        <button className="btn btn-outline btn-sm w-full" onClick={() => addLight(orientation)}>
                            + Додати світлофор
                        </button>

                    </div>
                </div>
            </aside>

            <section className="flex-1 flex flex-wrap gap-5 items-start">
                {filtered.length === 0 && (
                    <div className="w-full text-center py-16 text-base-content/40">
                        <p className="text-4xl mb-3">🚦</p>
                        <p className="text-sm">Немає світлофорів</p>
                        <button className="btn btn-primary btn-sm mt-4" onClick={() => addLight(orientation)}>
                            + Додати перший
                        </button>
                    </div>
                )}
                <AnimatePresence mode="popLayout">
                    {filtered.map(light => (
                        <TrafficLightCard
                            key={light.id}
                            light={light}
                            orientation={orientation}
                            settings={settings}
                            clickColor={clickColor}
                            removeLight={removeLight}
                            playBeep={playBeep}
                        />
                    ))}
                </AnimatePresence>
            </section>

        </div>
    )
}

export default TrafficLightPage