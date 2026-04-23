import { createContext, useContext, useState, useCallback } from 'react'

const GAS = 'https://script.google.com/macros/s/AKfycbxrGp_JuQytpRRAxov1IxQ8MNLiPrzz1uhSXnvYT1gzXmhnVA6VArBCQPO87AIbt8zFag/exec'

const AuthContext = createContext(null)

// Авторизація через Google Sheets
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('auth_user')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(false)

    // Вхід
    const login = useCallback(async (username, password) => {
        setLoading(true)
        try {
            const url = `${GAS}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            const res = await fetch(url).then(r => r.json())

            if (res.status === 'ok') {
                const u = { username: res.user.username, loggedAt: Date.now() }
                setUser(u)
                localStorage.setItem('auth_user', JSON.stringify(u))
                return { ok: true }
            }
            return { ok: false, message: res.message }
        } catch {
            return { ok: false, message: 'Помилка з\'єднання з сервером' }
        } finally {
            setLoading(false)
        }
    }, [])

    // Реєстрація
    const register = useCallback(async (username, password) => {
        setLoading(true)
        try {
            const url = `${GAS}?action=register&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            const res = await fetch(url).then(r => r.json())

            if (res.status === 'ok') {
                const u = { username: res.user.username, loggedAt: Date.now() }
                setUser(u)
                localStorage.setItem('auth_user', JSON.stringify(u))
                return { ok: true }
            }
            return { ok: false, message: res.message }
        } catch {
            return { ok: false, message: 'Помилка з\'єднання з сервером' }
        } finally {
            setLoading(false)
        }
    }, [])

    // Вихід
    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem('auth_user')
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuth: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}
