import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const { isAuth, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-50 shadow-sm">
            <div className="navbar-start">
                <div className="flex items-center gap-3 px-2">
                    {/* Іконка світлофора */}
                    <div className="flex flex-col gap-[3px] bg-base-300 border border-base-content/10 rounded-lg px-[5px] py-[6px]">
                        <span className="block w-[9px] h-[9px] rounded-full bg-error shadow-[0_0_5px_theme(colors.error)]" />
                        <span className="block w-[9px] h-[9px] rounded-full bg-warning shadow-[0_0_5px_theme(colors.warning)]" />
                        <span className="block w-[9px] h-[9px] rounded-full bg-success shadow-[0_0_5px_theme(colors.success)]" />
                    </div>
                    <div>
                        <p className="text-[9px] font-mono tracking-[3px] uppercase text-base-content/50 mb-[1px]">
                            Залік
                        </p>
                        <span className="text-base font-bold text-base-content">Світлофор</span>
                    </div>
                </div>
            </div>

            <div className="navbar-end gap-1 pr-2">
                <NavLink to="/" end className={({ isActive }) =>
                    `btn btn-sm btn-ghost font-medium ${isActive ? 'btn-active' : ''}`}>
                    Головна
                </NavLink>
                <NavLink to="/vertical" className={({ isActive }) =>
                    `btn btn-sm btn-ghost font-medium ${isActive ? 'btn-active' : ''}`}>
                    Вертикальний
                </NavLink>
                <NavLink to="/horizontal" className={({ isActive }) =>
                    `btn btn-sm btn-ghost font-medium ${isActive ? 'btn-active' : ''}`}>
                    Горизонтальний
                </NavLink>

                {isAuth && (
                    <NavLink to="/f1-traffic-light" className={({ isActive }) =>
                        `btn btn-sm btn-ghost font-medium ${isActive ? 'btn-active' : ''}`}>
                        🏎️ F1
                    </NavLink>
                )}

                {isAuth ? (
                    <button className="btn btn-sm btn-ghost text-error font-medium" onClick={handleLogout}>
                        Вийти
                    </button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) =>
                        `btn btn-sm btn-primary font-medium ${isActive ? 'btn-active' : ''}`}>
                        Увійти
                    </NavLink>
                )}
            </div>
        </div>
    )
}

export default Header