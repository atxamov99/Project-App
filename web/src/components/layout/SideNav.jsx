import { NavLink, Link, useNavigate } from 'react-router-dom'
import Icon from '../shared/Icon'
import Mascot from '../shared/Mascot'
import { clearSession } from '../../lib/auth'

const ITEMS = [
  { to: '/learn',       label: "O'rgan",   icon: 'home',           end: true },
  { to: '/practice',    label: 'Mashq',    icon: 'fitness_center' },
  { to: '/leaderboard', label: 'Liga',     icon: 'leaderboard' },
  { to: '/profile',     label: 'Profil',   icon: 'person' },
]

export default function SideNav({ user }) {
  const navigate = useNavigate()
  const xp = user?.totalXP ?? 0
  const gems = user?.gems ?? 0
  const hearts = user?.lives?.current ?? 5
  const streak = user?.streak ?? 0
  const isElevated = user?.role === 'ADMIN' || user?.role === 'CONTENT_EDITOR'

  function logout() {
    clearSession()
    navigate('/')
  }

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 lg:w-72 flex-col bg-surface-container-low border-r-2 border-outline-variant/60 z-30">
      {/* Brand */}
      <Link to="/learn" className="flex items-center gap-3 px-6 py-5 border-b-2 border-outline-variant/40">
        <Mascot size={44} />
        <div>
          <span className="block font-extrabold text-secondary text-lg leading-none">LingvaUZ</span>
          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Tarvuz Loft</span>
        </div>
      </Link>

      {/* User stat card */}
      <div className="mx-4 mt-5 mb-3 bg-surface-container-lowest border-2 border-outline-variant/60 rounded-2xl p-4 loft-shadow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-sm font-extrabold flex items-center justify-center">
            {(user?.displayName || user?.username || '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="grow min-w-0">
            <p className="font-bold text-on-surface text-sm truncate">{user?.displayName ?? '...'}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">@{user?.username ?? '...'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat icon="local_fire_department" value={streak} label="kun" color="text-orange-500" />
          <Stat icon="favorite"               value={hearts} label="hayot" color="text-error" />
          <Stat icon="workspace_premium"      value={xp}     label="XP"    color="text-secondary" />
          <Stat icon="diamond"                value={gems}   label="gem"   color="text-secondary" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} filled={isActive} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {isElevated && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-on-primary-container bg-primary-container hover:opacity-90 mt-3"
          >
            <Icon name="shield_person" filled />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* Decorative tarvuz at bottom */}
      <div className="px-4 py-3 border-t-2 border-outline-variant/40 flex items-center gap-3">
        <div className="text-3xl select-none drop-shadow-[0_4px_6px_rgba(160,63,46,0.2)]">🍉</div>
        <button
          onClick={logout}
          className="grow text-left text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-error transition-colors"
        >
          Chiqish
        </button>
      </div>
    </aside>
  )
}

function Stat({ icon, value, label, color }) {
  return (
    <div className="bg-surface-container border border-outline-variant/40 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
      <Icon name={icon} filled className={color} style={{ fontSize: 16 }} />
      <span className="font-extrabold text-on-surface tabular-nums text-sm">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant ml-auto">{label}</span>
    </div>
  )
}
