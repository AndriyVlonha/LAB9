import { motion } from 'framer-motion'

// Компонент світлофора Формули-1
const F1TrafficLight = ({ state, size = 90 }) => {
    const isStop = state === 'stop'

    return (
        <div className="flex justify-center">
            <motion.div
                className="flex flex-col items-center gap-6 rounded-3xl p-6 relative"
                style={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #0a0c14 100%)',
                    border: '2px solid #252850',
                    boxShadow: 'inset 0 2px 12px rgba(0,0,0,.7), 0 8px 32px rgba(0,0,0,.5)',
                    minWidth: 140,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
                {/* Заголовок */}
                <div className="text-[10px] font-mono tracking-[3px] uppercase text-base-content/40">
                    F1
                </div>

                {/* Червоне світло */}
                <motion.div
                    className="relative"
                    style={{ width: size, height: size }}
                    animate={{ scale: isStop ? 1.05 : 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    {/* Підкладка */}
                    <div className="absolute inset-[-4px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle at 40% 35%, #0c0d18 0%, #070810 70%)',
                            border: '1.5px solid #111325',
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,.9)',
                        }} />
                    {/* Лампа */}
                    <div
                        className="absolute inset-0 rounded-full z-10 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at 34% 27%,
                                color-mix(in srgb, #ff3b3b 28%, white) 0%,
                                #ff3b3b 38%,
                                color-mix(in srgb, #ff3b3b 52%, black) 72%,
                                color-mix(in srgb, #ff3b3b 28%, black) 100%)`,
                            boxShadow: isStop
                                ? `0 0 20px rgba(255,59,59,.6), 0 0 60px rgba(255,59,59,.25),
                                   inset 0 -3px 6px rgba(0,0,0,.45), inset 0 2px 4px rgba(255,255,255,.1)`
                                : 'inset 0 -3px 6px rgba(0,0,0,.45)',
                            opacity: isStop ? 1 : 0.08,
                        }}
                    />
                    {/* Блік */}
                    <div className="absolute z-20 rounded-full pointer-events-none"
                        style={{
                            top: '13%', left: '17%', width: '30%', height: '18%',
                            background: 'rgba(255,255,255,.18)', filter: 'blur(3px)',
                            opacity: isStop ? 1 : 0.3,
                        }} />
                </motion.div>

                {/* Зелене світло */}
                <motion.div
                    className="relative"
                    style={{ width: size, height: size }}
                    animate={{ scale: !isStop ? 1.05 : 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
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
                                color-mix(in srgb, #00e676 28%, white) 0%,
                                #00e676 38%,
                                color-mix(in srgb, #00e676 52%, black) 72%,
                                color-mix(in srgb, #00e676 28%, black) 100%)`,
                            boxShadow: !isStop
                                ? `0 0 20px rgba(0,230,118,.6), 0 0 60px rgba(0,230,118,.25),
                                   inset 0 -3px 6px rgba(0,0,0,.45), inset 0 2px 4px rgba(255,255,255,.1)`
                                : 'inset 0 -3px 6px rgba(0,0,0,.45)',
                            opacity: !isStop ? 1 : 0.08,
                        }}
                    />
                    <div className="absolute z-20 rounded-full pointer-events-none"
                        style={{
                            top: '13%', left: '17%', width: '30%', height: '18%',
                            background: 'rgba(255,255,255,.18)', filter: 'blur(3px)',
                            opacity: !isStop ? 1 : 0.3,
                        }} />
                </motion.div>

                {/* Болти */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
            </motion.div>
        </div>
    )
}

export default F1TrafficLight
