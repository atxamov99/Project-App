import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiSlice, useLoginMutation } from '../store/apiSlice'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'
import Mascot from '../components/shared/Mascot'
import GoogleButton from '../components/shared/GoogleButton'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading: loading }] = useLoginMutation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  // Cache'ni tozalash — boshqa hisobga kirish uchun
  useEffect(() => {
    dispatch(apiSlice.util.resetApiState())
  }, [dispatch])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErrors({})
    setGlobalError('')
    try {
      const res = await login(form).unwrap()
      dispatch(setCredentials({ user: res.user, token: res.token }))
      navigate('/learn')
    } catch (err) {
      console.error('Login error:', err)
      
      // RTK Query unwrap() error structure handling
      if (err.data?.details) {
        const fieldErrors = {}
        for (const [k, v] of Object.entries(err.data.details)) {
          fieldErrors[k] = Array.isArray(v) ? v[0] : v
        }
        setErrors(fieldErrors)
      } else if (err.status === 429) {
        setGlobalError('Juda ko\'p urinishlar. Iltimos, biroz kutib qaytaring.')
      } else if (err.status === 'FETCH_ERROR') {
        setGlobalError('Serverga ulanib bo\'lmadi. Backend ishga tushganini tekshiring.')
      } else {
        setGlobalError(err.data?.error || err.message || 'Kirishda xatolik yuz berdi')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-10">
      <Link to="/" className="absolute top-6 left-6 text-on-surface-variant hover:text-secondary text-sm font-semibold">
        ← Bosh sahifa
      </Link>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 loft-shadow">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Mascot size={64} />
          <h1 className="text-3xl font-extrabold text-on-surface">Kirish</h1>
          <p className="text-on-surface-variant">Yana xush kelibsiz</p>
        </div>

        {globalError && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-4">
            {globalError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            placeholder="siz@example.uz"
            autoComplete="email"
            error={errors.email}
          />
          <Field
            label="Parol"
            type="password"
            value={form.password}
            onChange={(v) => update('password', v)}
            placeholder="Parolingiz"
            autoComplete="current-password"
            error={errors.password}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest terracotta-lift disabled:opacity-60"
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-on-surface-variant">
          <div className="grow h-px bg-outline-variant" />
          yoki
          <div className="grow h-px bg-outline-variant" />
        </div>

        <GoogleButton
          onSuccess={() => navigate('/learn')}
          onError={setGlobalError}
        />

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Hisobingiz yo'qmi?{' '}
          <Link to="/register" className="text-secondary font-bold hover:underline">
            Yaratish
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete, error }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant mb-1.5">{label}</span>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors focus:border-secondary ${
            isPassword ? 'pr-12' : ''
          } ${error ? 'border-error' : 'border-outline-variant'}`}
          required
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
          >
            {show ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <small className="text-error text-xs mt-1 block">{error}</small>}
    </label>
  )
}
