export default function Controls({ settings, onUpdate, onAdd }) {
    return (
        <div className="controls">
            <div className="controls-inner">

                <label className="ctrl-group">
                    <span className="ctrl-label">Кількість морганнь</span>
                    <div className="ctrl-row">
                        <input type="range" min="1" max="10" step="1"
                            value={settings.blinkCount}
                            onChange={e => onUpdate({ ...settings, blinkCount: Number(e.target.value) })}
                            className="ctrl-slider" />
                        <span className="ctrl-val">{settings.blinkCount}x</span>
                    </div>
                </label>

                <label className="ctrl-group">
                    <span className="ctrl-label">Яскравість</span>
                    <div className="ctrl-row">
                        <input type="range" min="0.15" max="1" step="0.05"
                            value={settings.brightness}
                            onChange={e => onUpdate({ ...settings, brightness: parseFloat(e.target.value) })}
                            className="ctrl-slider" />
                        <span className="ctrl-val">{Math.round(settings.brightness * 100)}%</span>
                    </div>
                    {/* visual brightness strip */}
                    <div className="brightness-preview"
                        style={{ opacity: settings.brightness }} />
                </label>

                <hr className="ctrl-divider" />

                <button className="ctrl-add" onClick={onAdd}>
                    + Додати світлофор
                </button>

            </div>
        </div>
    )
}