import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { clearSession, getUser } from '../../lib/auth'
import TopAppBar from './TopAppBar'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

export default function AppShell() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    api.me()
      .then((d) => setUser(d.user))
      .catch((err) => {
        if (err.status === 401) {
          clearSession()
          navigate('/login')
        }
      })
  }, [navigate])

  return (
    <div className="min-h-dvh bg-background">
      {/* Mobile-only top app bar */}
      <div className="md:hidden">
        <TopAppBar user={user} />
      </div>

      {/* Desktop side nav */}
      <SideNav user={user} />

      {/* Content — pushed right on desktop to clear sidebar */}
      <main className="md:ml-64 lg:ml-72 pb-24 md:pb-8">
        <Outlet context={{ user, setUser }} />
      </main>

      {/* Mobile-only bottom nav */}
      <BottomNav />
    </div>
  )
}
