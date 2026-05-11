import Icon from '../shared/Icon'
import Mascot from '../shared/Mascot'

export default function TopAppBar({ user }) {
  const xp = user?.totalXP ?? 0
  const gems = user?.gems ?? 0
  const hearts = user?.lives?.current ?? 5

  return (
    <header className="bg-surface-container-low sticky top-0 z-40 shadow-sm flex justify-between items-center w-full px-6 py-3">
      <div className="flex items-center gap-3">
        <Mascot size={40} />
        <h1 className="text-xl font-bold text-secondary tracking-tight">LingvaUZ</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 bg-white/50 px-3 sm:px-4 py-2 rounded-full loft-shadow">
        <div className="flex items-center gap-1.5">
          <Icon name="workspace_premium" filled className="text-secondary text-base" style={{ fontSize: 18 }} />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon name="diamond" filled className="text-secondary text-base" style={{ fontSize: 18 }} />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{gems} Gems</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon name="favorite" filled className="text-error" style={{ fontSize: 18 }} />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{hearts}</span>
        </div>
      </div>
    </header>
  )
}
