import { useEffect, useRef, useState } from 'react'
import { useGoogleLoginMutation } from '../../store/apiSlice'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleButton({ onSuccess, onError }) {
  const buttonRef = useRef(null)
  const dispatch = useAppDispatch()
  const [googleLogin] = useGoogleLoginMutation()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!CLIENT_ID) return

    let cancelled = false
    function tryInit() {
      if (cancelled) return
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 100)
        return
      }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
      })

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: buttonRef.current.offsetWidth || 320,
        })
      }
      setReady(true)
    }

    async function handleCredential(response) {
      if (!response?.credential) {
        onError?.('Google javob bermadi')
        return
      }
      setLoading(true)
      try {
        const result = await googleLogin({ idToken: response.credential }).unwrap()
        dispatch(setCredentials({ user: result.user, token: result.token }))
        onSuccess?.(result)
      } catch (err) {
        onError?.(err.data?.error || err.message || 'Google login xatoligi')
      } finally {
        setLoading(false)
      }
    }

    tryInit()
    return () => { cancelled = true }
  }, [onError, onSuccess, googleLogin, dispatch])

  if (!CLIENT_ID) {
    return (
      <div className="text-xs text-on-surface-variant text-center bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2">
        Google login sozlanmagan ⚙️
      </div>
    )
  }

  return (
    <div className="w-full">
      <div ref={buttonRef} className="flex justify-center min-h-11" />
      {!ready && (
        <p className="text-xs text-on-surface-variant text-center mt-2">Google yuklanmoqda…</p>
      )}
      {loading && (
        <p className="text-xs text-on-surface-variant text-center mt-2">Tekshirilmoqda…</p>
      )}
    </div>
  )
}
