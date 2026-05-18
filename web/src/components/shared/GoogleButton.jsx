import { useEffect, useRef, useState } from 'react'
import { useGoogleLoginMutation } from '../../store/apiSlice'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleButton({ onSuccess, onError }) {
  const buttonRef = useRef(null)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const dispatch = useAppDispatch()
  const [googleLogin] = useGoogleLoginMutation()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  // Callback'larni ref orqali — useEffect qayta ishga tushmasin
  useEffect(() => { onSuccessRef.current = onSuccess; onErrorRef.current = onError })

  useEffect(() => {
    if (!CLIENT_ID) return

    let cancelled = false
    let timeoutId

    async function handleCredential(response) {
      if (!response?.credential) {
        onErrorRef.current?.('Google javob bermadi')
        return
      }
      setLoading(true)
      try {
        const result = await googleLogin({ idToken: response.credential }).unwrap()
        dispatch(setCredentials({ user: result.user, token: result.token }))
        onSuccessRef.current?.(result)
      } catch (err) {
        onErrorRef.current?.(err.data?.error || err.message || 'Google login xatoligi')
      } finally {
        setLoading(false)
      }
    }

    function tryInit() {
      if (cancelled) return
      if (!window.google?.accounts?.id) {
        timeoutId = setTimeout(tryInit, 100)
        return
      }

      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
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
      } catch (err) {
        console.error('Google init failed:', err)
        onErrorRef.current?.('Google yuklanmadi. Sahifani yangilang.')
      }
    }

    tryInit()
    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [googleLogin, dispatch])

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
