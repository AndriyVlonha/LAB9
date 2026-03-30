import { useCallback, useState } from 'react'
import { motion, animate } from 'framer-motion'

export default function TrafficLightColor({ lightId, color, settings, onClick }) {
    const [blinking, setBlinking] = useState(false)

    const handleClick = useCallback(async () => {
        if (blinking) return
        if (onClick) onClick(lightId, color.id)
        setBlinking(true)

        const el = document.getElementById(`lamp-${lightId}-${color.id}`)
        if (!el) { setBlinking(false); return }

        // animate brightness: full → dim → full, N times
        const bright = settings.brightness
        const frames = [bright]
        for (let i = 0; i < settings.blinkCount; i++) frames.push(0.07, bright)

        await animate(el, { opacity: frames }, {
            duration: settings.blinkCount * 0.4,
            ease: 'easeInOut',
        })
        setBlinking(false)
    }, [blinking, lightId, color.id, settings, onClick])

    // brightness: dim the lamp visually via opacity + filter
    const bright = settings.brightness
    const lampStyle = {
        '--color': color.hex,
        opacity: bright,
        // scale glow based on brightness
        filter: bright < 0.85
            ? `brightness(${0.6 + bright * 0.45})`
            : 'none',
    }

    return (
        <motion.div
            className="lamp-wrap"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClick}
            style={{ cursor: blinking ? 'not-allowed' : 'pointer' }}
            title={`${color.label} — кліків: ${color.clicks}`}
        >
            <div className="lamp-socket" />
            <div
                id={`lamp-${lightId}-${color.id}`}
                className="lamp"
                style={lampStyle}
            />
            {color.clicks > 0 && (
                <motion.div
                    className="lamp-badge"
                    key={color.clicks}
                    initial={{ scale: 0, y: 4 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                >
                    {color.clicks}
                </motion.div>
            )}
        </motion.div>
    )
}