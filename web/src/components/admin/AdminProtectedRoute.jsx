import { Navigate, Outlet } from 'react-router-dom'
import { isAuthed, getUser } from '../../lib/auth'

export default function AdminProtectedRoute() {
  if (!isAuthed()) return <Navigate to="/login" replace />
  const user = getUser()
  if (!user || !['ADMIN', 'CONTENT_EDITOR'].includes(user.role)) {
    return <Navigate to="/learn" replace />
  }
  return <Outlet />
}
