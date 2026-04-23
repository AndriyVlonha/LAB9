import { useCallback, useRef, useState } from 'react'
import { motion, animate } from 'framer-motion'

const Lamp = ({ color, blinkCount, brightness, onClick, active }) => {
    const [blinking, setBlinking] = useState(false)
    const lampRef = useRef(null)

    // Яскравість: активна лампа = повна, неактивна = тьмяна
    const lampBrightness = active ? brightness : brightness * 0.12

    const handleClick = useCallback(async () => {
        if (blinking) return
        onClick(color.id)
        setBlinking(true)

        const el = lampRef.current
        if (!el) { setBlinking(false); return }

        const frames = [brightness]
        for (let i = 0; i < blinkCount; i++) frames.push(0.06, brightness)

        await animate(el, { opacity: frames }, {
            duration: blinkCount * 0.4,
            ease: 'easeInOut',
        })
        setBlinking(false)
    }, [blinking, blinkCount, brightness, color.id, onClick])

    return (
        <motion.div
            className="relative cursor-pointer"
            style={{ width: 76, height: 76 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClick}
            title={`${color.label} — кліків: ${color.clicks}`}
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
                ref={lampRef}
                className="absolute inset-0 rounded-full z-10 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 34% 27%,
            color-mix(in srgb, ${color.hex} 28%, white) 0%,
            ${color.hex} 38%,
            color-mix(in srgb, ${color.hex} 52%, black) 72%,
            color-mix(in srgb, ${color.hex} 28%, black) 100%)`,
                    boxShadow: active
                        ? `0 0 16px color-mix(in srgb, ${color.hex} 52%, transparent),
                      0 0 48px color-mix(in srgb, ${color.hex} 22%, transparent),
                      inset 0 -3px 6px rgba(0,0,0,.45),
                      inset 0 2px 4px rgba(255,255,255,.1)`
                        : 'inset 0 -3px 6px rgba(0,0,0,.45)',
                    opacity: lampBrightness,
                    filter: lampBrightness < 0.85 ? `brightness(${0.55 + lampBrightness * 0.5})` : 'none',
                }}
            />

            {/* Блік */}
            <div className="absolute z-20 rounded-full pointer-events-none"
                style={{
                    top: '13%', left: '17%', width: '30%', height: '18%',
                    background: 'rgba(255,255,255,.2)', filter: 'blur(3px)',
                    opacity: active ? 1 : 0.3,
                }} />
        </motion.div>
    )
}

const TrafficLights = ({ colors = [], orientation = 'vertical', onLightClick, blinkCount = 3, brightness = 1, activeColor = null }) => {
    const isH = orientation === 'horizontal'

    return (
        <div className="flex justify-center">
            <motion.div
                className={`flex items-center gap-3 rounded-[44px] p-5 relative ${isH ? 'flex-row' : 'flex-col'}`}
                style={{
                    background: '#0a0c14',
                    border: '1.5px solid #181d30',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,.6), 0 6px 24px rgba(0,0,0,.45)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
                {/* Болти */}
                {isH ? (
                    <>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#131520] border border-[#1e2238]" />
                    </>
                )}

                {colors.map(color => (
                    <Lamp key={color.id} color={color} blinkCount={blinkCount}
                        brightness={brightness} onClick={onLightClick}
                        active={activeColor === null || activeColor === color.id} />
                ))}
            </motion.div>
        </div>
    )
}

export default TrafficLights