import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { api } from '../lib/api'
import Icon from '../components/shared/Icon'

const LEAGUE_EMOJI = {
  Bronze: '🥉', Silver: '🥈', Gold: '🥇',
  Sapphire: '💙', Ruby: '❤️', Emerald: '💚',
  Amethyst: '💜', Pearl: '🤍', Obsidian: '🖤', Diamond: '💎',
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const { user } = useOutletContext() ?? {}
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.league.get()
      .then(setData)
      .catch((e) => {
        if (e.status === 401) navigate('/login')
        else setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-12 mx-auto max-w-md md:max-w-5xl text-center">
        <p className="text-on-surface-variant">Liga yuklanmoqda…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-12 mx-auto max-w-md">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center">{error}</div>
      </div>
    )
  }

  if (!data) return null

  const { league, weeklyXP, rank, leaderboard } = data
  const emoji = LEAGUE_EMOJI[league.name] ?? league.icon ?? '🏆'

  // Hisoblar
  const totalUsers = leaderboard.length
  const topThird = totalUsers > 0 ? Math.max(1, Math.round(totalUsers / 3)) : 0
  const inPromotionZone = rank && rank <= 10
  const dailyGoalXP = 50  // hozircha hardcoded, kelajakda /api/streak dan
  const dailyXP = Math.min(dailyGoalXP, weeklyXP) // proxy: haftalik XP'ning bir qismi

  return (
    <div className="px-4 sm:px-6 py-6 md:py-10 mx-auto max-w-md md:max-w-5xl lg:max-w-6xl">
      {/* League hero */}
      <section className="md:grid md:grid-cols-[1fr_280px] md:gap-8 mb-6">
        <div className="text-center md:text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6 md:mb-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 bg-primary-container rounded-3xl flex items-center justify-center loft-shadow shrink-0">
            <span className="text-6xl md:text-7xl">{emoji}</span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
              {league.name}
            </span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mt-3 md:mt-0">{league.name} League</h1>
            <p className="text-on-surface-variant mt-1">
              {rank
                ? `Siz #${rank} o'rinda${totalUsers > 1 ? `, ${totalUsers} kishi orasida` : ''}`
                : 'Siz hali liga jadvalida emassiz'}
            </p>
            {leaderboard.length === 1 && (
              <p className="text-sm text-on-surface-variant mt-1">
                Hozircha bu guruhda yolg'iz siz — boshqalar qo'shilgach jadval to'ladi.
              </p>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-3">
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 loft-shadow">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Joriy o'rin</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-4xl font-extrabold text-on-surface tabular-nums">
                {rank ? `#${rank}` : '—'}
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 loft-shadow">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Haftalik XP</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-extrabold text-on-surface tabular-nums">{weeklyXP}</span>
              <span className="text-sm text-on-surface-variant mb-0.5">XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only stat row */}
      <div className="md:hidden grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 loft-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Joriy o'rin</p>
          <p className="text-3xl font-extrabold text-on-surface mt-1">{rank ? `#${rank}` : '—'}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 loft-shadow">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kunlik XP</p>
          <p className="text-3xl font-extrabold text-on-surface mt-1">
            {dailyXP}<span className="text-lg text-on-surface-variant">/{dailyGoalXP}</span>
          </p>
          <div className="bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-secondary rounded-full" style={{ width: `${(dailyXP / dailyGoalXP) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[1fr_280px] md:gap-8">
        {/* Leaderboard */}
        <div className="space-y-2 mb-6 md:mb-0">
          <h2 className="hidden md:block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">Reyting</h2>

          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              Hozircha hech kim XP yig'magan
            </div>
          )}

          {leaderboard.map((row) => (
            <div
              key={row.userId}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                row.isYou
                  ? 'bg-secondary-container border-2 border-secondary'
                  : 'bg-surface-container-lowest border border-outline-variant'
              }`}
            >
              <span className={`text-sm font-bold w-6 ${row.isYou ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>
                {row.rank}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden ${
                row.isYou ? 'bg-secondary text-white' : 'bg-primary-fixed text-on-primary-fixed-variant'
              }`}>
                {row.avatar
                  ? <img src={row.avatar} alt="" className="w-full h-full object-cover" />
                  : (row.displayName || row.username).slice(0, 1).toUpperCase()}
              </div>
              <div className="grow min-w-0">
                <p className={`font-bold truncate ${row.isYou ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                  {row.displayName}
                </p>
                <p className={`text-xs truncate ${row.isYou ? 'text-on-secondary-container/70' : 'text-on-surface-variant'}`}>
                  @{row.username}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold tabular-nums ${row.isYou ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                  {row.weeklyXP.toLocaleString()}
                </p>
                <p className={`text-[10px] uppercase tracking-widest ${row.isYou ? 'text-on-secondary-container/70' : 'text-on-surface-variant'}`}>
                  XP
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right column (desktop) */}
        <div className="hidden md:block space-y-4 self-start sticky top-6">
          <section className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
              Liga qoidalari
            </h3>
            <ul className="space-y-2 text-sm text-on-surface">
              <li className="flex gap-2">
                <span className="text-secondary font-extrabold">↑</span>
                <span>Top 10 ➜ yuqori liga</span>
              </li>
              <li className="flex gap-2">
                <span className="text-error font-extrabold">↓</span>
                <span>Oxirgi 5 ➜ pastki liga</span>
              </li>
              <li className="flex gap-2">
                <span className="text-on-surface-variant font-extrabold">·</span>
                <span>Hafta dushanba 00:00 da yangilanadi</span>
              </li>
            </ul>
          </section>

          <section className={`border-2 rounded-2xl p-5 ${
            inPromotionZone
              ? 'bg-secondary-container border-secondary text-on-secondary-container'
              : 'bg-primary-fixed border-primary-fixed-dim/60 text-on-primary-fixed'
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
              inPromotionZone ? 'text-on-secondary-container' : 'text-on-primary-fixed-variant'
            }`}>
              {inPromotionZone ? '🎉 Promotion Zone' : 'Promotion Zone'}
            </p>
            <p className="text-sm">
              {inPromotionZone
                ? "Ajoyib! Top 10'dasiz — hafta oxirigacha shu joyni saqlang."
                : 'Top 10\'ga chiqing va yuqori ligaga ko\'tariling.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
