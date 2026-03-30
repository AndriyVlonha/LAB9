import { useRouteError, Link } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()

    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="card bg-base-200/20 backdrop-blur-xl border border-white/25 shadow-2xl w-full max-w-md">
                <div className="card-body items-center text-center gap-4">

                    <div className="text-6xl animate-bounce">🚧</div>

                    <h1 className="card-title text-2xl text-white">
                        Упс! Щось пішло не так
                    </h1>

                    {(error?.status || error?.message) && (
                        <div className="alert alert-error bg-error/20 border-error/30 w-full">
                            <div>
                                {error?.status && (
                                    <p className="font-bold">Помилка {error.status}</p>
                                )}
                                <p className="text-sm">
                                    {error?.statusText || error?.message || 'Сторінку не знайдено'}
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="text-white/70 text-sm">
                        Схоже, ви потрапили на сторінку, якої не існує.
                    </p>

                    <Link to="/" className="btn btn-primary w-full">
                        Повернутися на головну
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default ErrorPage