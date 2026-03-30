import { motion } from 'framer-motion'
import './Loader.css'

const colors = ['#ff3b3b', '#ffc107', '#00e676']

export default function Loader({ text = 'Завантаження…' }) {
    return (
        <div className="loader-container">
            <div className="loader-lights">
                {colors.map((color, i) => (
                    <motion.div
                        key={color}
                        className="loader-dot"
                        style={{ background: color }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.25,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
            <motion.p
                className="loader-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {text}
            </motion.p>
        </div>
    )
}
