import { NavLink, Link, useNavigate } from 'react-router-dom'
import Icon from '../shared/Icon'
import Mascot from '../shared/Mascot'
import { useAppDispatch } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import { apiSlice } from '../../store/apiSlice'

const ITEMS = [
  { to: '/learn',       label: "O'rgan",   icon: 'home',           end: true },
  { to: '/practice',    label: 'Mashq',    icon: 'fitness_center' },
  { to: '/leaderboard', label: 'Liga',     icon: 'leaderboard' },
  { to: '/profile',     label: 'Profil',   icon: 'person' },
]

export default function SideNav({ user }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const xp = user?.totalXP ?? 0
  const gems = user?.gems ?? 0
  const hearts = user?.lives?.current ?? 5
  const streak = user?.streak ?? 0
  const isElevated = user?.role === 'ADMIN' || user?.role === 'CONTENT_EDITOR'

  function handleLogout() {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
    navigate('/')
  }

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 lg:w-64 flex-col bg-surface-container-lowest border-r border-outline-variant/50 z-30">
      {/* Brand */}
      <Link to="/learn" className="flex items-center gap-2.5 px-5 py-4 border-b border-outline-variant/30">
        <span className="text-xl font-black text-secondary tracking-tight">LingvaUZ</span>
      </Link>

      {/* User row */}
      <div className="px-5 py-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary text-sm font-bold flex items-center justify-center shrink-0">
            {(user?.displayName || user?.username || '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface text-sm truncate leading-none">{user?.displayName ?? '...'}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">@{user?.username ?? '...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">🔥 <b className="text-on-surface">{streak}</b></span>
          <span className="flex items-center gap-1">❤️ <b className="text-on-surface">{hearts}</b></span>
          <span className="flex items-center gap-1">⭐ <b className="text-on-surface">{xp}</b> XP</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-secondary/10 text-secondary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} filled={isActive} style={{ fontSize: 20 }} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {isElevated && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-secondary/10 mt-2"
          >
            <Icon name="shield_person" filled style={{ fontSize: 20 }} />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="px-5 py-4 border-t border-outline-variant/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-error transition-colors font-medium w-full"
        >
          <Icon name="logout" style={{ fontSize: 16 }} />
          Chiqish
        </button>
      </div>
    </aside>
  )
}
