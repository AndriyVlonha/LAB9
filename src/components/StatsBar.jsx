import './StatsBar.css'

const COLORS = [
    { key: 'red', label: 'Червоний', hex: '#ff3b3b' },
    { key: 'yellow', label: 'Жовтий', hex: '#ffc107' },
    { key: 'green', label: 'Зелений', hex: '#00e676' },
]

const StatsBar = ({ clicks, blinkCount, brightness, onBlinkChange, onBrightnessChange }) => {
    const total = Object.values(clicks).reduce((a, b) => a + b, 0)

    return (
        <div className="stats-bar">

            {/* ── Лічильники кліків ── */}
            <div className="stats-counts">
                {COLORS.map(({ key, label, hex }) => (
                    <div key={key} className="stats-item">
                        <span className="stats-dot" style={{ background: hex }} />
                        <span className="stats-label">{label}</span>
                        <span className="stats-val">{clicks[key]}</span>
                    </div>
                ))}
                <div className="stats-divider" />
                <div className="stats-item">
                    <span className="stats-label">Всього</span>
                    <span className="stats-val stats-val--total">{total}</span>
                </div>
            </div>

            {/* ── Слайдери — Lab6 ── */}
            <div className="stats-controls">

                <label className="ctrl-group">
                    <span className="ctrl-label">Кількість морганнь</span>
                    <div className="ctrl-row">
                        <input
                            type="range" min="1" max="10" step="1"
                            value={blinkCount}
                            onChange={e => onBlinkChange(Number(e.target.value))}
                            className="ctrl-slider"
                        />
                        <span className="ctrl-val">{blinkCount}x</span>
                    </div>
                </label>

                <label className="ctrl-group">
                    <span className="ctrl-label">Яскравість</span>
                    <div className="ctrl-row">
                        <input
                            type="range" min="0.15" max="1" step="0.05"
                            value={brightness}
                            onChange={e => onBrightnessChange(parseFloat(e.target.value))}
                            className="ctrl-slider"
                        />
                        <span className="ctrl-val">{Math.round(brightness * 100)}%</span>
                    </div>
                    <div className="brightness-strip" style={{ opacity: brightness }} />
                </label>

            </div>
        </div>
    )
}

export default StatsBar