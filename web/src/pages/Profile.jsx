import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout as logoutAction, setCredentials } from '../store/slices/authSlice'
import {
  useMeQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useSearchFriendsQuery,
} from '../store/apiSlice'
import Icon from '../components/shared/Icon'
import Modal, { ModalActions } from '../components/admin/Modal'

const ACHIEVEMENTS = [
  { key: 'EARLY_BIRD',     title: 'Early Bird',      desc: 'Complete 10 lessons before 8 AM.', icon: 'wb_sunny',    progress: 7,   total: 10 },
  { key: 'WORD_SMITH',     title: 'Word Smith',      desc: 'Learn 500 new words in Uzbek.',     icon: 'menu_book',   progress: 225, total: 500 },
  { key: 'LEAGUE_LEGEND',  title: 'League Legend',   desc: 'Finish #1 in the Gold League.',     icon: 'emoji_events', progress: 0, total: 1, locked: true },
  { key: 'SOCIAL',         title: 'Social Butterfly', desc: 'Follow 5 friends on LingvaUZ.',    icon: 'group',       progress: 5,   total: 5,   completed: true },
]

export default function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const storedUser = useAppSelector((state) => state.auth.user)

  // Tezroq render uchun Redux'dagi user'ni ko'rsatamiz, server'dan yangilangan ma'lumotni sinxron qilamiz
  const { data: meData } = useMeQuery(undefined, { skip: !localStorage.getItem('token') })
  const user = meData?.user ?? storedUser

  useEffect(() => {
    if (meData?.user) {
      dispatch(setCredentials({ user: meData.user, token: localStorage.getItem('token') }))
    }
  }, [meData?.user, dispatch])

  const { data: friendsData, isLoading: friendsLoading, error: friendsError } = useGetFollowingQuery()
  const [unfollowUser] = useUnfollowUserMutation()

  const [addModal, setAddModal] = useState(false)
  const [activeAccountModal, setActiveAccountModal] = useState(null)

  function handleLogout() {
    dispatch(logoutAction())
    navigate('/')
  }

  if (!user) return <div className="p-8 text-center text-on-surface-variant">Yuklanmoqda…</div>

  const initial = (user.displayName || user.username || '?').slice(0, 1).toUpperCase()
  const friends = friendsData?.items ?? []

  return (
    <div className="px-4 sm:px-6 py-6 md:py-10 mx-auto max-w-md md:max-w-5xl lg:max-w-6xl">
      {/* Header */}
      <section className="md:flex md:items-start md:gap-8 mb-8 md:mb-10">
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-fixed border-4 border-surface-container-highest flex items-center justify-center text-4xl md:text-5xl font-extrabold text-on-primary-fixed-variant relative overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : initial}
          </div>
        </div>

        <div className="text-center md:text-left grow mt-4 md:mt-0 min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface break-words">{user.displayName}</h1>
          <p className="text-on-surface-variant text-sm break-all">@{user.username} · {user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
              Level {Math.max(1, Math.floor((user.totalXP ?? 0) / 100))}
            </span>
            {user.role && user.role !== 'STUDENT' && (
              <span className="text-xs font-bold uppercase tracking-widest bg-secondary text-on-secondary px-3 py-1 rounded-full">
                {user.role}
              </span>
            )}
            {user.isPremium && (
              <span className="text-xs font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
                Premium Tarvuz+
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
            <button
              onClick={() => setActiveAccountModal('settings')}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Sozlamalar
            </button>
            <button
              onClick={() => navigator.share?.({ title: 'LingvaUZ', text: `Men ${user.username} sifatida o'rganyapman`, url: location.origin }) || alert('Profilingiz havolasi: ' + location.origin)}
              className="bg-white border-2 border-outline-variant text-tertiary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest paper-lift"
            >
              Ulashish
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
        <StatCard icon="local_fire_department" label="Day Streak"     value={user.streak ?? 0} accent />
        <StatCard icon="military_tech"          label="Longest streak" value={user.longestStreak ?? 0} />
        <StatCard icon="bolt"                   label="Total XP"       value={(user.totalXP ?? 0).toLocaleString()} />
      </section>

      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 space-y-8 md:space-y-0">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xl font-bold text-on-surface">Yutuqlar</h2>
            </div>
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {ACHIEVEMENTS.map((a) => <AchievementRow key={a.key} a={a} />)}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xl font-bold text-on-surface">Do'stlar</h2>
              <button
                onClick={() => setAddModal(true)}
                className="text-xs font-bold uppercase tracking-widest text-secondary"
              >
                + Qo'shish
              </button>
            </div>

            {friendsError && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-3">
                {friendsError?.data?.error || friendsError?.message || 'Xatolik yuz berdi'}
              </div>
            )}

            {friendsLoading ? (
              <div className="text-on-surface-variant text-sm py-2">Yuklanmoqda…</div>
            ) : friends.length === 0 ? (
              <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🍉</div>
                <p className="text-on-surface-variant text-sm">Hali do'stlar yo'q.</p>
                <button
                  onClick={() => setAddModal(true)}
                  className="mt-3 bg-secondary text-on-secondary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Birinchini qo'shish
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((f) => (
                  <FriendRow
                    key={f.id}
                    friend={f}
                    onUnfollow={async () => {
                      try { await unfollowUser(f.id).unwrap() }
                      catch (e) { console.error(e) }
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <h2 className="text-xl font-bold text-on-surface mb-3 px-1">Hisob</h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl divide-y divide-outline-variant/40 overflow-hidden">
            <AccountRow icon="settings"      label="Sozlamalar"       onClick={() => setActiveAccountModal('settings')} />
            <AccountRow icon="notifications" label="Bildirishnomalar" onClick={() => setActiveAccountModal('notifications')} />
            <AccountRow icon="shield"        label="Maxfiylik"        onClick={() => setActiveAccountModal('privacy')} />
            <AccountRow icon="help"          label="Yordam"           onClick={() => setActiveAccountModal('help')} />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 text-error hover:bg-error-container/40 transition-colors"
            >
              <Icon name="logout" className="text-error" />
              <span className="font-bold">Chiqish</span>
            </button>
          </div>

          <div className="hidden md:flex mt-6 bg-primary-fixed border-2 border-primary-fixed-dim/60 rounded-2xl p-5 items-center gap-4">
            <div className="text-5xl select-none">🍉</div>
            <p className="text-xs text-on-primary-fixed italic">
              "Har kuni 5 daqiqa — bir yilda boshqa odam bo'lasiz!"
            </p>
          </div>
        </aside>
      </div>

      <AddFriendModal isOpen={addModal} onClose={() => setAddModal(false)} />

      <SettingsModal
        isOpen={activeAccountModal === 'settings'}
        onClose={() => setActiveAccountModal(null)}
        user={user}
        onUpdated={(u) => dispatch(setCredentials({ user: u, token: localStorage.getItem('token') }))}
      />
      <SimpleModal isOpen={activeAccountModal === 'notifications'} onClose={() => setActiveAccountModal(null)} title="Bildirishnomalar">
        <NotificationsContent />
      </SimpleModal>
      <SimpleModal isOpen={activeAccountModal === 'privacy'} onClose={() => setActiveAccountModal(null)} title="Maxfiylik">
        <PrivacyContent email={user.email} />
      </SimpleModal>
      <SimpleModal isOpen={activeAccountModal === 'help'} onClose={() => setActiveAccountModal(null)} title="Yordam">
        <HelpContent />
      </SimpleModal>
    </div>
  )
}

/* ─── Komponentlar ─────────────────────────── */

function StatCard({ icon, label, value, accent }) {
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

function AchievementRow({ a }) {
  const pct = Math.min(100, Math.round((a.progress / a.total) * 100))
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4 ${a.locked ? 'opacity-60' : ''}`}>
      <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
        <Icon name={a.icon} filled className="text-secondary" />
      </div>
      <div className="grow min-w-0">
        <p className="font-bold text-on-surface">{a.title}</p>
        <p className="text-xs text-on-surface-variant truncate">{a.desc}</p>
        {!a.locked && !a.completed && (
          <div className="mt-2 flex items-center gap-2">
            <div className="grow bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">{a.progress}/{a.total}</span>
          </div>
        )}
      </div>
      {a.locked && <span className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-2 py-1 rounded shrink-0">Locked</span>}
      {a.completed && <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary text-white px-2 py-1 rounded shrink-0">Done</span>}
    </div>
  )
}

function FriendRow({ friend, onUnfollow }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold flex items-center justify-center overflow-hidden">
        {friend.avatar
          ? <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
          : (friend.displayName || friend.username).slice(0, 1).toUpperCase()}
      </div>
      <div className="grow min-w-0">
        <p className="font-bold text-on-surface truncate">{friend.displayName}</p>
        <p className="text-xs text-on-surface-variant">@{friend.username} · {friend.totalXP.toLocaleString()} XP</p>
      </div>
      <button
        onClick={onUnfollow}
        className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors px-3 py-1.5"
        title="Obunani bekor qilish"
      >
        Olib tashlash
      </button>
    </div>
  )
}

function AccountRow({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-surface-container/50 transition-colors"
    >
      <Icon name={icon} className="text-on-surface-variant" />
      <span className="font-bold text-on-surface grow text-left">{label}</span>
      <Icon name="chevron_right" className="text-on-surface-variant" />
    </button>
  )
}

/* ─── Add friend modal ─── */

function AddFriendModal({ isOpen, onClose }) {
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    if (!isOpen) { setQ(''); setDebounced(''); return }
    const t = setTimeout(() => setDebounced(q), 250)
    return () => clearTimeout(t)
  }, [q, isOpen])

  const { data, isFetching, error } = useSearchFriendsQuery(debounced, {
    skip: !isOpen || debounced.length < 2,
  })
  const [followUser, { isLoading: followBusy }] = useFollowUserMutation()
  const [followError, setFollowError] = useState('')

  const results = data?.items ?? []

  async function follow(username) {
    setFollowError('')
    try { await followUser(username).unwrap() }
    catch (e) { setFollowError(e?.data?.error || e?.message || 'Xatolik') }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Do'st qo'shish" size="md">
      <div className="space-y-3">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Username yoki ism bo'yicha qidiring..."
            className="w-full bg-surface-container-low border-2 border-outline-variant rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:border-secondary"
            autoFocus
          />
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        </div>

        {(error || followError) && (
          <div className="text-error text-sm bg-error-container/40 px-3 py-2 rounded-lg">
            {followError || error?.data?.error || error?.message || 'Xatolik'}
          </div>
        )}

        {debounced.length < 2 && <p className="text-xs text-on-surface-variant text-center py-4">Kamida 2 ta belgi yozing</p>}
        {isFetching && debounced.length >= 2 && <p className="text-xs text-on-surface-variant text-center py-2">Qidirilmoqda…</p>}
        {!isFetching && debounced.length >= 2 && results.length === 0 && (
          <p className="text-xs text-on-surface-variant text-center py-4">Hech kim topilmadi</p>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {results.map((u) => (
            <div key={u.id} className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold flex items-center justify-center overflow-hidden">
                {u.avatar
                  ? <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                  : (u.displayName || u.username).slice(0, 1).toUpperCase()}
              </div>
              <div className="grow min-w-0">
                <p className="font-bold text-on-surface truncate">{u.displayName}</p>
                <p className="text-xs text-on-surface-variant">@{u.username} · {u.totalXP.toLocaleString()} XP</p>
              </div>
              {u.isFollowing ? (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">Obuna</span>
              ) : (
                <button
                  onClick={() => follow(u.username)}
                  disabled={followBusy}
                  className="bg-secondary text-on-secondary px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-60"
                >
                  Qo'shish
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ─── Settings ─── */

function SettingsModal({ isOpen, onClose, user, onUpdated }) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (isOpen) setDisplayName(user.displayName) }, [isOpen, user])

  async function save() {
    setBusy(true)
    try {
      const updated = { ...user, displayName }
      localStorage.setItem('user', JSON.stringify(updated))
      onUpdated(updated)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sozlamalar" size="md">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Ism</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-surface-container-low border-2 border-outline-variant rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary"
          />
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface-variant">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> @{user.username}</p>
          <p className="mt-1.5 italic">Email/username o'zgartirish uchun qo'llab-quvvatlash bilan bog'laning.</p>
        </div>

        <ModalActions>
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
          <button
            onClick={save}
            disabled={busy || !displayName.trim() || displayName === user.displayName}
            className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {busy ? '…' : 'Saqlash'}
          </button>
        </ModalActions>
      </div>
    </Modal>
  )
}

function SimpleModal({ isOpen, onClose, title, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-3">{children}</div>
    </Modal>
  )
}

function NotificationsContent() {
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notif-prefs')) ?? { streak: true, push: true, email: false, league: true } }
    catch { return { streak: true, push: true, email: false, league: true } }
  })

  function toggle(key) {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    localStorage.setItem('notif-prefs', JSON.stringify(next))
  }

  const items = [
    { key: 'streak', label: 'Streak eslatmasi', desc: 'Har kuni 20:00 da eslatib turamiz' },
    { key: 'push',   label: 'Push bildirishnomalari', desc: 'Brauzer push (kelajakka)' },
    { key: 'email',  label: 'Email bildirishnomalari', desc: 'Haftalik xulosa' },
    { key: 'league', label: 'Liga yangiliklari', desc: "Promotion / demotion sodir bo'lganda" },
  ]

  return (
    <>
      <p className="text-sm text-on-surface-variant">Sozlamalar mahalliy saqlanadi.</p>
      <div className="space-y-2">
        {items.map((it) => (
          <label key={it.key} className="flex items-start gap-3 bg-surface-container-low border border-outline-variant rounded-xl p-3 cursor-pointer hover:border-secondary/60 transition-colors">
            <input type="checkbox" checked={prefs[it.key]} onChange={() => toggle(it.key)} className="mt-1 accent-secondary" />
            <div>
              <p className="font-bold text-on-surface text-sm">{it.label}</p>
              <p className="text-xs text-on-surface-variant">{it.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </>
  )
}

function PrivacyContent({ email }) {
  return (
    <>
      <p className="text-sm text-on-surface">Sizning ma'lumotlaringiz xavfsiz.</p>
      <ul className="text-sm space-y-1.5 list-disc list-inside text-on-surface-variant">
        <li>Faqat darslarni shaxsiylashtirish uchun ishlatamiz</li>
        <li>Hech qanday uchinchi tomonga sotmaymiz</li>
        <li>HTTPS orqali shifrlangan</li>
        <li>Parollar bcrypt bilan hash qilinadi</li>
      </ul>
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface-variant mt-3">
        <p><strong>Akkauntingiz:</strong> {email}</p>
        <p className="mt-1.5">
          Ma'lumotlarni eksport yoki hisobni o'chirish uchun{' '}
          <a href={`mailto:privacy@lingvauz.uz?subject=Ma'lumotlar so'rovi&body=Akkaunt: ${email}`} className="text-secondary font-bold underline">
            privacy@lingvauz.uz
          </a>
        </p>
      </div>
    </>
  )
}

function HelpContent() {
  const faqs = [
    { q: "Streak'im uzilib qoldi, qaytarib bo'ladimi?", a: 'Streak Freeze yoki Premium imkoniyati bilan saqlash mumkin.' },
    { q: "Hayotim tugadi, nima qilaman?",                a: "Har 30 daqiqada 1 ta hayot avtomatik qaytariladi yoki gem bilan tiklang." },
    { q: "Mashq xato deb topdim, qanday xabar berish mumkin?", a: 'support@lingvauz.uz ga screenshot bilan jo\'nating.' },
    { q: "Premium nima beradi?",                         a: 'Cheksiz hayot, reklamasiz, AI suhbat, offline darslar.' },
  ]
  const [open, setOpen] = useState(null)

  return (
    <>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-2 px-3 py-3 text-left text-sm font-bold text-on-surface hover:bg-surface-container/40 transition-colors"
            >
              <span className="grow">{f.q}</span>
              <Icon name={open === i ? 'expand_less' : 'expand_more'} className="text-on-surface-variant" />
            </button>
            {open === i && <p className="px-3 pb-3 text-xs text-on-surface-variant leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="bg-primary-fixed border-2 border-primary-fixed-dim/60 rounded-xl p-3 text-sm mt-3">
        <p className="font-bold text-on-primary-fixed mb-1">Bizga yozing 🍉</p>
        <p className="text-xs text-on-primary-fixed">
          <a href="mailto:hello@lingvauz.uz" className="text-secondary font-bold">hello@lingvauz.uz</a>
        </p>
      </div>
    </>
  )
}
