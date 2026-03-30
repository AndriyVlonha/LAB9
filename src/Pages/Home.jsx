const Home = () => (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8">
        <div className="card bg-base-200 border border-base-300 shadow-lg w-full max-w-2xl">
            <div className="card-body gap-5">

                <h1 className="card-title text-3xl font-bold justify-center">
                    Лабораторна робота №9
                </h1>

                <div className="card bg-base-300 rounded-xl p-5">
                    <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-2">
                        Мета роботи
                    </h2>
                    <p className="text-sm text-base-content/80 leading-relaxed">
                        Стилізувати проєкт за допомогою бібліотеки{' '}
                        <kbd className="kbd kbd-sm">daisyUI</kbd> та{' '}
                        <kbd className="kbd kbd-sm">Tailwind CSS</kbd>.
                        Опублікувати додаток на{' '}
                        <kbd className="kbd kbd-sm">Netlify</kbd>.
                        Дана робота є продовженням лабораторної роботи №8.
                    </p>
                </div>

                <div className="card bg-base-300 rounded-xl p-5">
                    <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-3">
                        Завдання
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-base-content/80 space-y-2 leading-relaxed">
                        <li>Перенести попередню лабораторну роботу</li>
                        <li>Встановити <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">daisyUI</code></li>
                        <li>Стилізувати проєкт за допомогою daisyUI</li>
                        <li>Опублікувати додаток на <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">netlify.com</code></li>
                    </ol>
                </div>

                <div className="card bg-base-300 rounded-xl p-5">
                    <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-3">
                        Функціонал
                    </h2>
                    <ul className="list-disc list-inside text-sm text-base-content/80 space-y-2 leading-relaxed">
                        <li>Анімація моргання через <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">framer-motion</code></li>
                        <li>Слайдери яскравості та морганнь — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">daisyUI range</code></li>
                        <li>Картки світлофорів — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">daisyUI card</code></li>
                        <li>Навігація — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">daisyUI navbar</code></li>
                        <li>Глобальний стан — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">React Context API</code></li>
                        <li>API — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">Google Apps Script</code> + Google Sheets</li>
                    </ul>
                </div>

                <div className="alert alert-info">
                    <span className="text-sm">
                        Використовуйте меню вгорі для переходу між сторінками
                    </span>
                </div>

            </div>
        </div>
    </div>
)

export default Home