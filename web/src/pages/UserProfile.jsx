import { useNavigate, useParams, Navigate } from 'react-router-dom'
import {
  useGetUserProfileQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '../store/apiSlice'
import Icon from '../components/shared/Icon'

const LEAGUE_EMOJI = {
  Bronze: '🥉', Silver: '🥈', Gold: '🥇',
  Sapphire: '💙', Ruby: '❤️', Emerald: '💚',
  Amethyst: '💜', Pearl: '🤍', Obsidian: '🖤', Diamond: '💎',
}

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useGetUserProfileQuery(username)
  const [followUser, { isLoading: following }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation()

  if (isLoading) return <div className="p-12 text-center text-on-surface-variant">Yuklanmoqda…</div>

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-12 max-w-md mx-auto">
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-center">
          {error.data?.error || 'Foydalanuvchi topilmadi'}
        </div>
        <button
          onClick={() => navigate('/leaderboard')}
          className="mx-auto block mt-4 bg-secondary text-on-secondary px-5 py-2 rounded-xl font-bold text-sm"
        >
          Liga jadvaliga qaytish
        </button>
      </div>
    )
  }

  if (!user) return null

  // O'zining profilini ko'rmoqchi bo'lsa — /profile ga yo'naltirish
  if (user.isSelf) return <Navigate to="/profile" replace />

  const initial = (user.displayName || user.username || '?').slice(0, 1).toUpperCase()
  const level = Math.max(1, Math.floor((user.totalXP ?? 0) / 100))
  const leagueEmoji = user.league ? (LEAGUE_EMOJI[user.league.name] ?? user.league.icon ?? '🏆') : null
  const joinedDate = new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })

  async function handleFollow() {
    try { await followUser(user.username).unwrap() } catch (e) { console.error(e) }
  }

  async function handleUnfollow() {
    try { await unfollowUser(user.id).unwrap() } catch (e) { console.error(e) }
  }

  return (
    <div className="px-4 sm:px-6 py-6 md:py-10 mx-auto max-w-md md:max-w-5xl lg:max-w-6xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-on-surface-variant hover:text-secondary mb-4 flex items-center gap-1"
      >
        <Icon name="arrow_back" style={{ fontSize: 18 }} />
        <span>Orqaga</span>
      </button>

      <section className="md:flex md:items-start md:gap-8 mb-8">
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-fixed border-4 border-surface-container-highest flex items-center justify-center text-4xl md:text-5xl font-extrabold text-on-primary-fixed-variant overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              : initial}
          </div>
        </div>

        <div className="text-center md:text-left grow mt-4 md:mt-0 min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface break-words">{user.displayName}</h1>
          <p className="text-on-surface-variant text-sm break-all">@{user.username}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
              Level {level}
            </span>
            {user.league && (
              <span className="text-xs font-bold uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full">
                {leagueEmoji} {user.league.name}
              </span>
            )}
            {user.isPremium && (
              <span className="text-xs font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
                Premium Tarvuz+
              </span>
            )}
            {user.followsYou && (
              <span className="text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
                Sizga obuna
              </span>
            )}
          </div>

          <p className="text-xs text-on-surface-variant mt-3">
            <Icon name="event" style={{ fontSize: 14 }} className="align-middle mr-1" />
            {joinedDate} dan beri
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
            {user.isFollowing ? (
              <button
                onClick={handleUnfollow}
                disabled={unfollowing}
                className="bg-white border-2 border-outline-variant text-tertiary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest paper-lift disabled:opacity-60"
              >
                {unfollowing ? '...' : 'Obunadan chiqish'}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={following}
                className="bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest terracotta-lift disabled:opacity-60"
              >
                {following ? '...' : "Obuna bo'lish"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat icon="local_fire_department" label="Streak" value={user.streak ?? 0} accent />
        <Stat icon="military_tech" label="Longest" value={user.longestStreak ?? 0} />
        <Stat icon="bolt" label="Total XP" value={(user.totalXP ?? 0).toLocaleString()} />
        <Stat icon="task_alt" label="Lessons" value={user.stats?.lessonsCompleted ?? 0} />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Yutuqlar" value={user.stats?.achievements ?? 0} icon="emoji_events" />
        <MiniStat label="Obunalar" value={user.stats?.following ?? 0} icon="person_add" />
        <MiniStat label="Obunachilar" value={user.stats?.followers ?? 0} icon="group" />
        <MiniStat label="Haftalik XP" value={user.weeklyXP ?? 0} icon="trending_up" />
      </section>
    </div>
  )
}

function Stat({ icon, label, value, accent }) {
  return (
    <div className={`bg-surface-container-lowest border-2 rounded-2xl p-4 md:p-5 flex flex-col items-center gap-1 loft-shadow ${
      accent ? 'border-secondary/60' : 'border-outline-variant'
    }`}>
      <Icon name={icon} filled className={accent ? 'text-orange-500' : 'text-secondary'} style={{ fontSize: 28 }} />
      <p className="text-2xl md:text-3xl font-extrabold text-primary tabular-nums">{value}</p>
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">{label}</p>
    </div>
  )
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 flex items-center gap-3">
      <Icon name={icon} className="text-secondary" style={{ fontSize: 20 }} />
      <div className="min-w-0">
        <p className="text-lg font-extrabold text-on-surface tabular-nums leading-none">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
      </div>
    </div>
  )
}
