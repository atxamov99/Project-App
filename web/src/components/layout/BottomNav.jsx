import { NavLink } from 'react-router-dom'
import Icon from '../shared/Icon'

const ITEMS = [
  { to: '/learn',       label: 'Home',     icon: 'home' },
  { to: '/practice',    label: 'Practice', icon: 'fitness_center' },
  { to: '/leaderboard', label: 'Leagues',  icon: 'leaderboard' },
  { to: '/profile',     label: 'Profile',  icon: 'person' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-surface border-t border-surface-container-highest shadow-lg rounded-t-xl">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/learn'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container scale-90'
                : 'text-on-surface-variant hover:text-secondary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} filled={isActive} />
              <span className="text-xs font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
