import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import { apiSlice } from '../../store/apiSlice'
import Icon from '../shared/Icon'

const NAV = [
  { to: '/admin',              label: 'Dashboard',    icon: 'dashboard',     end: true,  admin: false },
  { to: '/admin/users',        label: 'Users',        icon: 'group',                     admin: true  },
  { to: '/admin/languages',    label: 'Languages',    icon: 'language',                  admin: false },
  { to: '/admin/courses',      label: 'Courses',      icon: 'menu_book',                 admin: false },
  { to: '/admin/words',        label: 'Words',        icon: 'translate',                 admin: false },
  { to: '/admin/achievements', label: 'Achievements', icon: 'emoji_events',              admin: false },
  { to: '/admin/stats',        label: 'Stats',        icon: 'analytics',                 admin: true  },
]

export default function AdminShell() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user) ?? {}
  const isAdmin = user.role === 'ADMIN'

  function handleLogout() {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <aside className="fixed top-0 left-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant flex flex-col z-30">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2">
          <Icon name="shield_person" filled className="text-secondary" />
          <span className="font-extrabold text-lg text-on-surface">Admin</span>
        </div>

        <nav className="flex-1 py-3">
          {NAV.map((item) => {
            if (item.admin && !isAdmin) return null
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                <Icon name={item.icon} className="text-current" style={{ fontSize: 20 }} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-outline-variant px-5 py-3">
          <button
            onClick={() => navigate('/learn')}
            className="w-full flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-secondary py-1.5"
          >
            <Icon name="logout" style={{ fontSize: 18 }} />
            Exit Admin
          </button>
        </div>
      </aside>

      <header className="fixed top-0 left-60 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 z-20">
        <span className="font-bold text-on-surface">LingvaUZ Admin</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-extrabold text-sm flex items-center justify-center overflow-hidden shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : (user.displayName || user.username || '?').slice(0, 1).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-on-surface">{user.displayName}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-on-surface-variant">@{user.username}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-secondary text-on-secondary px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-error hover:bg-error-container/40 px-3 py-1.5 rounded-lg transition-colors"
            aria-label="Chiqish"
          >
            <Icon name="logout" style={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
