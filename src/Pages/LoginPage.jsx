import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Валідація пароля при реєстрації
function validatePassword(pw) {
    const errors = []
    if (pw.length < 8) errors.push('Мінімум 8 символів')
    if (!/[A-Z]/.test(pw)) errors.push('Хоча б одна велика літера')
    if (!/[a-z]/.test(pw)) errors.push('Хоча б одна мала літера')
    if (!/[0-9]/.test(pw)) errors.push('Хоча б одна цифра')
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) errors.push('Хоча б один спецсимвол (!@#$...)')
    return errors
}

function validateUsername(name) {
    if (name.length < 3) return 'Мінімум 3 символи'
    if (name.length > 20) return 'Максимум 20 символів'
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Лише латиниця, цифри та _'
    return ''
}

const LoginPage = () => {
    const { login, register, loading } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isRegister, setIsRegister] = useState(false)

    // Валідація в реальному часі
    const usernameError = useMemo(() =>
        isRegister && username.length > 0 ? validateUsername(username) : '', [username, isRegister])
    const passwordErrors = useMemo(() =>
        isRegister && password.length > 0 ? validatePassword(password) : [], [password, isRegister])
    const isFormValid = isRegister
        ? username.length >= 3 && !usernameError && passwordErrors.length === 0
        : username.trim().length > 0 && password.trim().length > 0

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!username.trim() || !password.trim()) {
            setError('Заповніть всі поля')
            return
        }

        if (isRegister) {
            const uErr = validateUsername(username.trim())
            if (uErr) { setError(uErr); return }
            const pErrs = validatePassword(password)
            if (pErrs.length > 0) { setError(pErrs[0]); return }
        }

        const result = isRegister
            ? await register(username.trim(), password)
            : await login(username.trim(), password)

        if (result.ok) {
            navigate('/f1-traffic-light', { replace: true })
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8">
            <motion.div
                className="card bg-base-200 border border-base-300 shadow-xl w-full max-w-sm"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
                <div className="card-body gap-5">
                    <h1 className="card-title text-2xl font-bold justify-center">
                        🔐 {isRegister ? 'Реєстрація' : 'Авторизація'}
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Логін */}
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Логін
                            </span>
                            <input
                                id="login-username"
                                type="text"
                                className={`input input-bordered w-full ${isRegister && usernameError ? 'input-error' : ''}`}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Ваш логін"
                                autoFocus
                                disabled={loading}
                            />
                            {isRegister && usernameError && (
                                <span className="text-[10px] text-error">{usernameError}</span>
                            )}
                            {isRegister && username.length >= 3 && !usernameError && (
                                <span className="text-[10px] text-success">✓ Логін доступний</span>
                            )}
                        </label>

                        {/* Пароль */}
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-mono tracking-[2px] uppercase text-base-content/50">
                                Пароль
                            </span>
                            <input
                                id="login-password"
                                type="password"
                                className={`input input-bordered w-full ${isRegister && password.length > 0 && passwordErrors.length > 0 ? 'input-error' : ''}`}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder={isRegister ? 'Мін. 8 символів' : '••••'}
                                disabled={loading}
                            />
                        </label>

                        {/* Вимоги до пароля при реєстрації */}
                        {isRegister && password.length > 0 && (
                            <div className="flex flex-col gap-1 px-1">
                                {[
                                    { check: password.length >= 8, label: 'Мін. 8 символів' },
                                    { check: /[A-Z]/.test(password), label: 'Велика літера' },
                                    { check: /[a-z]/.test(password), label: 'Мала літера' },
                                    { check: /[0-9]/.test(password), label: 'Цифра' },
                                    { check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), label: 'Спецсимвол' },
                                ].map(({ check, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <span className={`text-[10px] ${check ? 'text-success' : 'text-base-content/30'}`}>
                                            {check ? '✓' : '○'}
                                        </span>
                                        <span className={`text-[10px] ${check ? 'text-success' : 'text-base-content/40'}`}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Помилка */}
                        {error && (
                            <div className="alert alert-error text-sm py-2">
                                {error}
                            </div>
                        )}

                        {/* Успіх */}
                        {success && (
                            <div className="alert alert-success text-sm py-2">
                                {success}
                            </div>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                            disabled={loading || !isFormValid}
                        >
                            {loading
                                ? '⏳ Зачекайте...'
                                : isRegister ? 'Зареєструватися' : 'Увійти'
                            }
                        </button>
                    </form>

                    <div className="divider my-0 text-xs">або</div>

                    <button
                        className="btn btn-ghost btn-sm w-full"
                        onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}
                        disabled={loading}
                    >
                        {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Зареєструватися'}
                    </button>

                    <div className="text-center text-[10px] text-base-content/30">
                        Дані зберігаються в Google Sheets
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage
