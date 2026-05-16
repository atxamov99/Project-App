import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout, setCredentials } from '../../store/slices/authSlice'
import { useMeQuery } from '../../store/apiSlice'
import TopAppBar from './TopAppBar'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

export default function AppShell() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const { data: meData, error } = useMeQuery(undefined, { skip: !token })

  useEffect(() => {
    if (meData?.user) {
      dispatch(setCredentials({ user: meData.user, token }))
    }
  }, [meData?.user, token, dispatch])

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout())
      navigate('/login')
    }
  }, [error, dispatch, navigate])

  return (
    <div className="min-h-dvh bg-background">
      <div className="md:hidden">
        <TopAppBar user={user} />
      </div>
      <SideNav user={user} />
      <main className="md:ml-64 lg:ml-72 pb-24 md:pb-8">
        <Outlet context={{ user }} />
      </main>
      <BottomNav />
    </div>
  )
}
