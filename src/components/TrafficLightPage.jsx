import { motion, AnimatePresence } from 'framer-motion'
import { useTrafficLights } from '../context/TrafficLightsContext'
import TrafficLights from './TrafficLights'

const COLORS_META = [
    { key: 'red', hex: '#ff3b3b' },
    { key: 'yellow', hex: '#ffc107' },
    { key: 'green', hex: '#00e676' },
]

// ── Спільна сторінка для вертикального і горизонтального ──────────────────────
const TrafficLightPage = ({ orientation }) => {
    const { lights, settings, addLight, removeLight, clickColor, updateSettings } = useTrafficLights()

    const total = lights.reduce((s, l) =>
        s + l.colors.reduce((a, c) => a + c.clicks, 0), 0)

    const label = orientation === 'vertical' ? 'Вертикальний' : 'Горизонтальний'

    return (
        <div className="flex gap-6 p-8 max-w-[1200px] mx-auto min-h-[calc(100vh-64px)] items-start">

            {/* ── Sidebar ── */}
            <aside className="w-56 flex-shrink-0 sticky top-[80px] flex flex-col gap-4">

                <div className="pb-3 border-b border-base-300">
                    <p className="text-[9px] font-mono tracking-[3px] uppercase text-base-content/50 mb-1">
                        {label}
                    </p>
                    <h2 className="text-xl font-bold">Світлофор</h2>
                </div>

                {/* Controls card */}
                <div className="card bg-base-200 border border-base-300 shadow">
                    <div className="card-body p-4 gap-4">

                        {/* Blink count */}
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

                        {/* Brightness */}
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
                            {/* brightness strip */}
                            <div className="h-[3px] rounded-full"
                                style={{
                                    background: 'linear-gradient(to right, #ff3b3b, #ffc107, #00e676)',
                                    opacity: settings.brightness,
                                }} />
                        </label>

                        <div className="divider my-0" />

                        {/* Stats */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="badge badge-ghost font-mono text-[10px]">
                                🚦 {lights.length}
                            </div>
                            <div className="badge badge-primary font-mono text-[10px]">
                                кліків {total}
                            </div>
                        </div>

                        {/* Add button */}
                        <button className="btn btn-outline btn-sm w-full" onClick={addLight}>
                            + Додати світлофор
                        </button>

                    </div>
                </div>
            </aside>

            {/* ── Stage ── */}
            <section className="flex-1 flex flex-wrap gap-5 items-start">
                <AnimatePresence mode="popLayout">
                    {lights.map(light => (
                        <motion.div
                            key={light.id}
                            className={`card bg-base-200 border border-base-300 shadow overflow-hidden ${orientation === 'horizontal' ? 'w-[340px]' : 'w-[190px]'
                                }`}
                            initial={{ opacity: 0, y: 32, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85, y: -16 }}
                            layout
                            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        >
                            {/* Card header */}
                            <div className="flex items-center justify-between px-3 py-2 bg-base-300 border-b border-base-300">
                                <span className="font-mono text-[9px] tracking-[2px] uppercase text-base-content/60">
                                    {light.name}
                                </span>
                                {lights.length > 1 && (
                                    <button className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                        onClick={() => removeLight(light.id)}>✕</button>
                                )}
                            </div>

                            {/* Lamps */}
                            <div className="p-5 flex justify-center bg-gradient-to-b from-base-300 to-base-200">
                                <TrafficLights
                                    colors={light.colors}
                                    orientation={orientation}
                                    onLightClick={colorId => clickColor(light.id, colorId)}
                                    blinkCount={settings.blinkCount}
                                    brightness={settings.brightness}
                                />
                            </div>

                            {/* Stats */}
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
                    ))}
                </AnimatePresence>
            </section>

        </div>
    )
}

export default TrafficLightPage