import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import { useMeQuery } from '../../store/apiSlice'

export default function AdminProtectedRoute() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth)
  const { data: meData, isLoading } = useMeQuery(undefined, { skip: !token })

  useEffect(() => {
    if (meData?.user) {
      dispatch(setCredentials({ user: meData.user, token }))
    }
  }, [meData?.user, token, dispatch])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Server'dan yangi ma'lumot yuklanayotgan bo'lsa kutamiz
  if (isLoading && !meData) {
    return <div className="min-h-dvh grid place-items-center text-on-surface-variant">Yuklanmoqda…</div>
  }

  const freshRole = meData?.user?.role ?? user?.role
  if (!freshRole || !['ADMIN', 'CONTENT_EDITOR'].includes(freshRole)) {
    return <Navigate to="/learn" replace />
  }

  return <Outlet />
}
