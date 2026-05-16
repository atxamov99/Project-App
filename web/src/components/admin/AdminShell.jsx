import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
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

      <header className="fixed top-0 left-60 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 z-20">
        <span className="font-bold text-on-surface">LingvaUZ Admin</span>
        <div className="flex items-center gap-3">
          <div className="text-sm text-on-surface-variant">
            {user.displayName} <span className="font-bold text-secondary uppercase tracking-widest text-[10px] ml-1">{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-on-surface-variant hover:text-error font-semibold"
            aria-label="Logout"
          >
            <Icon name="exit_to_app" style={{ fontSize: 18 }} />
          </button>
        </div>
      </header>

      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
