import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Learn from './pages/Learn'
import Lesson from './pages/Lesson'
import Practice from './pages/Practice'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/layout/AppShell'

import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminShell from './components/admin/AdminShell'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminLanguages from './pages/admin/AdminLanguages'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCourseDetail from './pages/admin/AdminCourseDetail'
import AdminUnitDetail from './pages/admin/AdminUnitDetail'
import AdminLessonEditor from './pages/admin/AdminLessonEditor'
import AdminWords from './pages/admin/AdminWords'
import AdminAchievements from './pages/admin/AdminAchievements'
import AdminStats from './pages/admin/AdminStats'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated student routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route element={<AppShell />}>
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminShell />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/languages" element={<AdminLanguages />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
            <Route path="/admin/units/:unitId" element={<AdminUnitDetail />} />
            <Route path="/admin/lessons/:id" element={<AdminLessonEditor />} />
            <Route path="/admin/words" element={<AdminWords />} />
            <Route path="/admin/achievements" element={<AdminAchievements />} />
            <Route path="/admin/stats" element={<AdminStats />} />
          </Route>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
