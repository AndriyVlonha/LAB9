import { useAuth } from '../context/AuthContext'
import { NavLink } from 'react-router-dom'

const Home = () => {
    const { isAuth } = useAuth()

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8">
            <div className="card bg-base-200 border border-base-300 shadow-lg w-full max-w-2xl">
                <div className="card-body gap-5">

                    <h1 className="card-title text-3xl font-bold justify-center">
                        Залікова робота
                    </h1>

                    <div className="card bg-base-300 rounded-xl p-5">
                        <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-2">
                            Мета роботи
                        </h2>
                        <p className="text-sm text-base-content/80 leading-relaxed">
                            Розширити проєкт «Світлофор» — додати захищену сторінку
                            <kbd className="kbd kbd-sm mx-1">Світлофор F1</kbd>
                            з окремим компонентом світлофора Формули-1
                            та синхронізацією з автомобільним світлофором.
                        </p>
                    </div>

                    <div className="card bg-base-300 rounded-xl p-5">
                        <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-3">
                            Завдання
                        </h2>
                        <ol className="list-decimal list-inside text-sm text-base-content/80 space-y-2 leading-relaxed">
                            <li>Створити сторінку F1 з окремим маршрутом</li>
                            <li>Обмежити доступ авторизацією (Google Sheets)</li>
                            <li>Реалізувати світлофор F1 (стоп / старт)</li>
                            <li>Синхронізувати F1 з автомобільним світлофором</li>
                            <li>Авто = зелений → F1 = стоп, кнопка заблокована</li>
                            <li>Автоперемикання F1 кожні N секунд</li>
                            <li>Опублікувати на <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">Netlify</code></li>
                        </ol>
                    </div>

                    <div className="card bg-base-300 rounded-xl p-5">
                        <h2 className="text-[10px] font-mono tracking-[2px] uppercase text-primary mb-3">
                            Функціонал
                        </h2>
                        <ul className="list-disc list-inside text-sm text-base-content/80 space-y-2 leading-relaxed">
                            <li>Авторизація / реєстрація через <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">Google Sheets</code></li>
                            <li>Світлофор F1 з синхронізацією</li>
                            <li>Налаштування швидкості циклу та інтервалу F1</li>
                            <li>Вертикальний та горизонтальний режими</li>
                            <li>Анімація через <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">framer-motion</code></li>
                            <li>Стилізація <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">daisyUI</code> + <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">Tailwind</code></li>
                            <li>API — <code className="text-success font-mono text-xs bg-base-100 px-1 rounded">Google Apps Script</code></li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        {isAuth ? (
                            <NavLink to="/f1-traffic-light" className="btn btn-primary flex-1">
                                🏎️ Перейти до F1
                            </NavLink>
                        ) : (
                            <NavLink to="/login" className="btn btn-primary flex-1">
                                🔐 Увійти для доступу до F1
                            </NavLink>
                        )}
                        <NavLink to="/vertical" className="btn btn-outline flex-1">
                            🚦 Світлофори
                        </NavLink>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home