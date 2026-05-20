import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/shared/Icon'
import Mascot from '../components/shared/Mascot'
import { useAppSelector } from '../store/hooks'
import { useSubscribePlanMutation } from '../store/apiSlice'
import Modal, { ModalActions } from '../components/admin/Modal'

const LANGUAGES = [
  { flag: '🇬🇧', name: 'Ingliz tili',  desc: "O'zbek → Ingliz, A1 dan C1 gacha" },
  { flag: '🇷🇺', name: 'Rus tili',      desc: 'Kirill alifbosi va kundalik muloqot' },
  { flag: '🇺🇿', name: "O'zbek tili",   desc: 'Chet elliklar uchun' },
]

const FEATURES = [
  { icon: 'local_fire_department', title: 'Streak',  text: "Har kuni o'qing, zanjir uzilmasin" },
  { icon: 'workspace_premium',     title: 'XP',      text: 'Mashq bajaring, daraja oshiring' },
  { icon: 'leaderboard',           title: 'Liga',    text: 'Bronzedan Diamondgacha' },
  { icon: 'favorite',              title: 'Hayot',   text: '5 ta yurak, ehtiyot bo\'ling' },
  { icon: 'diamond',               title: 'Gem',     text: "Mukofotlar bilan xarid" },
  { icon: 'auto_awesome',          title: 'Tarvuz',  text: "O'zbek maskoti yoningizda" },
]

export default function Home() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [planModal, setPlanModal] = useState(null) // 'PLUS' | 'MAX' | null
  return (
    <div className="bg-background text-on-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mascot size={40} />
          <span className="text-xl font-bold text-secondary tracking-tight">LingvaUZ</span>
        </div>
        <nav className="hidden md:flex gap-6 text-on-surface-variant font-semibold">
          <a href="#tillar" className="hover:text-secondary transition-colors">Tillar</a>
          <a href="#imkoniyatlar" className="hover:text-secondary transition-colors">Imkoniyatlar</a>
          <a href="#narxlar" className="hover:text-secondary transition-colors">Narxlar</a>
        </nav>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="bg-white border-2 border-outline-variant text-tertiary px-4 sm:px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest paper-lift"
          >
            Kirish
          </Link>
          <Link
            to="/register"
            className="bg-secondary text-white px-4 sm:px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest terracotta-lift"
          >
            Boshlash
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            🇺🇿 O'zbekistonliklar uchun
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.05] mb-5">
            Til o'rganish — <span className="text-secondary">qiziqarli</span> bo'lishi mumkin
          </h1>
          <p className="text-lg text-on-surface-variant mb-7 max-w-xl">
            LingvaUZ — Duolingo uslubidagi bepul platforma. Ingliz, Rus va O'zbek tillarini
            kuniga 5 daqiqada o'rganing.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              to="/register"
              className="bg-secondary text-white px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest terracotta-lift"
            >
              Bepul Boshlash
            </Link>
            <Link
              to="/login"
              className="bg-white border-2 border-outline-variant text-tertiary px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest paper-lift"
            >
              Hisobim bor
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-on-surface-variant">
            <span>✅ Bepul</span>
            <span>✅ 3 ta til</span>
            <span>✅ Mahalliy mazmun</span>
          </div>
        </div>

        <div className="relative h-[360px] grid place-items-center">
          <div className="text-[200px] leading-none drop-shadow-[0_18px_26px_rgba(160,63,46,0.25)] select-none">🍉</div>
          <div className="absolute top-8 left-2 bg-white border-2 border-outline-variant rounded-2xl px-4 py-2 font-bold text-secondary loft-shadow flex items-center gap-1.5">
            <Icon name="local_fire_department" filled className="text-orange-500" /> 7
          </div>
          <div className="absolute top-24 right-4 bg-white border-2 border-outline-variant rounded-2xl px-4 py-2 font-bold text-secondary loft-shadow flex items-center gap-1.5">
            <Icon name="workspace_premium" filled className="text-secondary" /> +15 XP
          </div>
          <div className="absolute bottom-8 left-12 bg-white border-2 border-outline-variant rounded-2xl px-4 py-2 font-bold text-error loft-shadow tracking-widest">
            ❤❤❤❤❤
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="tillar" className="bg-surface-container-low py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-on-surface tracking-tight mb-2">3 ta til, bitta platformada</h2>
          <p className="text-center text-on-surface-variant mb-12 text-lg">O'zbek tilidagi to'liq interfeys bilan</p>
          <div className="grid md:grid-cols-3 gap-5">
            {LANGUAGES.map((l) => (
              <article
                key={l.name}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center loft-shadow transition-transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{l.flag}</div>
                <h3 className="text-xl font-bold text-on-surface mb-1">{l.name}</h3>
                <p className="text-on-surface-variant text-sm">{l.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="imkoniyatlar" className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-on-surface tracking-tight mb-2">Sevimli mexanikalar</h2>
          <p className="text-center text-on-surface-variant mb-12 text-lg">Duolingo'ning eng yaxshi g'oyalari + mahalliy yondashuv</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 loft-shadow"
              >
                <div className="bg-primary-fixed inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3">
                  <Icon name={f.icon} filled className="text-secondary" style={{ fontSize: 28 }} />
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-1">{f.title}</h3>
                <p className="text-on-surface-variant text-sm">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="narxlar" className="bg-surface-container-low py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-on-surface tracking-tight mb-2">Oddiy narx</h2>
          <p className="text-center text-on-surface-variant mb-12 text-lg">Bepul boshlang, kerak bo'lsa kengaytiring</p>
          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard
              title="Bepul" price="0" sub="so'm"
              features={['✅ Barcha darslar', '✅ 5 ta hayot', '⚠️ Reklama bor']}
              cta={isAuthenticated ? 'Joriy reja' : 'Boshlash'}
              onClick={() => !isAuthenticated && (window.location.href = '/register')}
              disabled={isAuthenticated}
              highlight={false}
            />
            <PriceCard
              title="Plus" price="19 900" sub="so'm/oy"
              features={['✅ Cheksiz hayot', '✅ Reklamasiz', '✅ Offline rejim']}
              cta={isAuthenticated ? 'Plusni olish' : 'Plusni tanlash'}
              onClick={() => isAuthenticated ? setPlanModal('PLUS') : (window.location.href = '/register')}
              highlight
            />
            <PriceCard
              title="Max" price="39 900" sub="so'm/oy"
              features={['✅ Plus imkoniyatlari', '✅ AI suhbat', '✅ Amaliy testlar']}
              cta={isAuthenticated ? 'Maxni olish' : 'Maxni tanlash'}
              onClick={() => isAuthenticated ? setPlanModal('MAX') : (window.location.href = '/register')}
              highlight={false}
            />
          </div>
        </div>
      </section>

      {/* Upgrade Modal */}
      {planModal && <UpgradeModal plan={planModal} onClose={() => setPlanModal(null)} />}

      {/* CTA */}
      <section className="bg-primary-fixed py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-on-primary-fixed tracking-tight mb-6">
          Bugun boshlang. <span className="text-secondary">5 daqiqa kifoya.</span>
        </h2>
        <Link
          to="/register"
          className="inline-block bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest terracotta-lift"
        >
          Bepul Hisob Ochish
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant/30 px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Mascot size={28} />
          <strong className="text-secondary">LingvaUZ</strong> — © {new Date().getFullYear()}
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-secondary">Maxfiylik</a>
          <a href="#" className="hover:text-secondary">Shartlar</a>
          <a href="mailto:hello@lingvauz.uz" className="hover:text-secondary">Aloqa</a>
        </div>
      </footer>
    </div>
  )
}

function PriceCard({ title, price, sub, features, cta, highlight, onClick, disabled }) {
  return (
    <article
      className={`relative bg-surface-container-lowest border-2 rounded-2xl p-8 flex flex-col items-center text-center gap-4 loft-shadow ${
        highlight ? 'border-secondary -translate-y-2' : 'border-outline-variant'
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Mashhur
        </span>
      )}
      <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      <p className="text-3xl font-extrabold text-on-surface">
        {price} <span className="text-sm font-semibold text-on-surface-variant">{sub}</span>
      </p>
      <ul className="text-sm space-y-2">
        {features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-default ${
          highlight
            ? 'bg-secondary text-white terracotta-lift'
            : 'bg-white border-2 border-outline-variant text-tertiary paper-lift'
        }`}
      >
        {cta}
      </button>
    </article>
  )
}

function UpgradeModal({ plan, onClose }) {
  const navigate = useNavigate()
  const [subscribe, { isLoading }] = useSubscribePlanMutation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const info = plan === 'PLUS'
    ? { label: 'Plus', price: '19 900', desc: 'Cheksiz hayot, reklamasiz, offline rejim' }
    : { label: 'Max',  price: '39 900', desc: 'Plus + AI suhbat + Amaliy testlar' }

  async function confirm() {
    setError('')
    try {
      const res = await subscribe(plan).unwrap()
      setSuccess(res)
    } catch (e) {
      setError(e.data?.error || 'Xatolik yuz berdi')
    }
  }

  if (success) {
    return (
      <Modal isOpen={!!plan} onClose={onClose} title="🎉 Premium aktivlashdi!">
        <div className="space-y-3 text-center">
          <div className="text-5xl">🍉</div>
          <p className="text-on-surface">
            <b>{info.label}</b> rejasi aktiv. Amal qilish muddati:{' '}
            <b>{new Date(success.premiumUntil).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</b>
          </p>
          <p className="text-xs text-on-surface-variant italic">
            Bu test rejimi — to'lov tizimi keyinroq qo'shiladi.
          </p>
          <ModalActions>
            <button onClick={() => { onClose(); navigate('/profile') }} className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold cursor-pointer">
              Profilga o'tish
            </button>
          </ModalActions>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={!!plan} onClose={onClose} title={`${info.label} rejasi`}>
      <div className="space-y-4">
        <div className="bg-primary-fixed/30 border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-3xl font-extrabold text-on-surface">{info.price} <span className="text-sm font-semibold text-on-surface-variant">so'm/oy</span></p>
          <p className="text-sm text-on-surface-variant mt-2">{info.desc}</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface-variant italic">
          ⚠️ Hozir test rejimi: tugmani bossangiz 30 kunlik premium bepul aktivlashadi. Real to'lov tizimi keyinroq qo'shiladi.
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container px-3 py-2 rounded-lg text-sm">{error}</div>
        )}

        <ModalActions>
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface-variant cursor-pointer">Bekor</button>
          <button
            onClick={confirm}
            disabled={isLoading}
            className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Aktivlashtirilmoqda..." : `${info.label}'ni aktivlashtirish`}
          </button>
        </ModalActions>
      </div>
    </Modal>
  )
}
