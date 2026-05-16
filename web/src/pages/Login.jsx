import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiSlice, useLoginMutation } from '../store/apiSlice'
import { useAppDispatch } from '../store/hooks'
import { logout, setCredentials } from '../store/slices/authSlice'
import Mascot from '../components/shared/Mascot'
import GoogleButton from '../components/shared/GoogleButton'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading: loading }] = useLoginMutation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Eski sessiyani va cache'ni tozalash — boshqa hisobga kirish uchun
  useEffect(() => {
    dispatch(logout())
    dispatch(apiSlice.util.resetApiState())
  }, [dispatch])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await login(form).unwrap()
      dispatch(setCredentials({ user: res.user, token: res.token }))
      navigate('/learn')
    } catch (err) {
      setError(err.data?.error || err.message || 'Kirishda xatolik yuz berdi')
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

        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="siz@example.uz"
            autoComplete="email"
          />
          <Field
            label="Parol"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Parolingiz"
            autoComplete="current-password"
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
          onError={setError}
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
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full bg-surface-container-low border-2 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors focus:border-secondary ${
          error ? 'border-error' : 'border-outline-variant'
        }`}
        required
      />
      {error && <small className="text-error text-xs mt-1 block">{error}</small>}
    </label>
  )
}
