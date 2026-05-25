import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://project-app-ekjv.onrender.com/api',
  timeout: 20_000,
  headers: {
    // Bypass ngrok's free-plan browser warning page; no-op on other hosts.
    'ngrok-skip-browser-warning': '1',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    if (__DEV__ && !error.response) {
      console.warn('[API] Network error:', error.message, '→', error.config?.url)
    }
    return Promise.reject(error)
  }
)
