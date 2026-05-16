import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../store/apiSlice'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'
import Mascot from '../components/shared/Mascot'
import GoogleButton from '../components/shared/GoogleButton'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [register, { isLoading: loading }] = useRegisterMutation()
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErrors({})
    setGlobalError('')
    try {
      const res = await register(form).unwrap()
      dispatch(setCredentials({ user: res.user, token: res.token }))
      navigate('/learn')
    } catch (err) {
      if (err.data?.details) {
        const fieldErrors = {}
        for (const [k, v] of Object.entries(err.data.details)) {
          fieldErrors[k] = Array.isArray(v) ? v[0] : v
        }
        setErrors(fieldErrors)
      } else {
        setGlobalError(err.data?.error || err.message || 'Hisob yaratishda xatolik yuz berdi')
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
          <h1 className="text-3xl font-extrabold text-on-surface">Hisob yaratish</h1>
          <p className="text-on-surface-variant">Bepul, 30 soniyada</p>
        </div>

        {globalError && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-4">
            {globalError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Email" type="email" value={form.email}
                 onChange={(v) => update('email', v)} placeholder="siz@example.uz"
                 autoComplete="email" error={errors.email} />
          <Field label="Username" value={form.username}
                 onChange={(v) => update('username', v.toLowerCase())} placeholder="username"
                 autoComplete="username" error={errors.username} />
          <Field label="Ism" value={form.displayName}
                 onChange={(v) => update('displayName', v)} placeholder="Ismingiz"
                 autoComplete="name" error={errors.displayName} />
          <Field label="Parol" type="password" value={form.password}
                 onChange={(v) => update('password', v)} placeholder="Kamida 8 belgi"
                 autoComplete="new-password" error={errors.password} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest terracotta-lift disabled:opacity-60"
          >
            {loading ? 'Yaratilmoqda...' : 'Hisob ochish'}
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
          Allaqachon hisobingiz bormi?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Kirish
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
