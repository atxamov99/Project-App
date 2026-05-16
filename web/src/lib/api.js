const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

function buildQuery(params) {
  if (!params) return ''
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (!filtered.length) return ''
  return '?' + filtered.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
}

async function request(path, { method = 'GET', body, auth = false, params } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem('token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}${buildQuery(params)}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.status = res.status
    err.details = data.details
    throw err
  }
  return data
}

export const api = {
  register:     (input)   => request('/auth/register', { method: 'POST', body: input }),
  login:        (input)   => request('/auth/login',    { method: 'POST', body: input }),
  googleLogin:  (idToken) => request('/auth/google',   { method: 'POST', body: { idToken } }),
  me:           ()        => request('/auth/me',       { auth: true }),
  logout:       ()        => request('/auth/logout',   { method: 'POST', auth: true }),

  courses: {
    list:   ()   => request('/courses'),
    get:    (id) => request(`/courses/${id}`, { auth: true }),
    enroll: (id) => request(`/courses/${id}/enroll`, { method: 'POST', auth: true }),
  },

  lessons: {
    get:      (id)       => request(`/lessons/${id}`, { auth: true }),
    complete: (id, body) => request(`/lessons/${id}/complete`, { method: 'POST', body, auth: true }),
  },

  exercises: {
    check: (id, answer) => request(`/exercises/${id}/check`, { method: 'POST', body: { answer }, auth: true }),
  },

  league: {
    get: () => request('/league', { auth: true }),
  },

  lives: {
    get: () => request('/lives', { auth: true }),
    buy: () => request('/lives/buy', { method: 'POST', auth: true }),
  },

  friends: {
    following: () => request('/friends/following', { auth: true }),
    followers: () => request('/friends/followers', { auth: true }),
    follow:    (username) => request('/friends/follow', { method: 'POST', body: { username }, auth: true }),
    unfollow:  (userId) => request(`/friends/unfollow/${userId}`, { method: 'DELETE', auth: true }),
    search:    (q) => request('/friends/search', { auth: true, params: { q } }),
  },
}

const adminGet    = (path, params) => request(path, { auth: true, params })
const adminPost   = (path, body)   => request(path, { method: 'POST',   body, auth: true })
const adminPatch  = (path, body)   => request(path, { method: 'PATCH',  body, auth: true })
const adminDelete = (path)         => request(path, { method: 'DELETE', auth: true })

export const adminApi = {
  users: {
    list:      (params)        => adminGet('/admin/users', params),
    get:       (id)            => adminGet(`/admin/users/${id}`),
    changeRole:(id, role)      => adminPatch(`/admin/users/${id}/role`, { role }),
    suspend:   (id, reason)    => adminPost(`/admin/users/${id}/suspend`, { reason }),
    unsuspend: (id)            => adminPost(`/admin/users/${id}/unsuspend`),
    remove:    (id)            => adminDelete(`/admin/users/${id}`),
  },
  languages: {
    list:   ()         => adminGet('/admin/languages'),
    create: (data)     => adminPost('/admin/languages', data),
    update: (id, data) => adminPatch(`/admin/languages/${id}`, data),
    remove: (id)       => adminDelete(`/admin/languages/${id}`),
  },
  courses: {
    list:   ()         => adminGet('/admin/courses'),
    get:    (id)       => adminGet(`/admin/courses/${id}`),
    create: (data)     => adminPost('/admin/courses', data),
    update: (id, data) => adminPatch(`/admin/courses/${id}`, data),
    remove: (id)       => adminDelete(`/admin/courses/${id}`),
  },
  units: {
    listByCourse: (courseId)  => adminGet(`/admin/units/by-course/${courseId}`),
    create:       (data)      => adminPost('/admin/units', data),
    update:       (id, data)  => adminPatch(`/admin/units/${id}`, data),
    remove:       (id)        => adminDelete(`/admin/units/${id}`),
    reorder:      (items)     => adminPost('/admin/units/reorder', { items }),
  },
  lessons: {
    listByUnit: (unitId)    => adminGet(`/admin/lessons/by-unit/${unitId}`),
    get:        (id)        => adminGet(`/admin/lessons/${id}`),
    create:     (data)      => adminPost('/admin/lessons', data),
    update:     (id, data)  => adminPatch(`/admin/lessons/${id}`, data),
    remove:     (id)        => adminDelete(`/admin/lessons/${id}`),
  },
  exercises: {
    listByLesson: (lessonId) => adminGet(`/admin/exercises/by-lesson/${lessonId}`),
    create:       (data)     => adminPost('/admin/exercises', data),
    update:       (id, data) => adminPatch(`/admin/exercises/${id}`, data),
    remove:       (id)       => adminDelete(`/admin/exercises/${id}`),
    detach:       (linkId)   => adminDelete(`/admin/exercises/link/${linkId}`),
  },
  words: {
    list:   (params)   => adminGet('/admin/words', params),
    create: (data)     => adminPost('/admin/words', data),
    update: (id, data) => adminPatch(`/admin/words/${id}`, data),
    remove: (id)       => adminDelete(`/admin/words/${id}`),
  },
  achievements: {
    list:   ()         => adminGet('/admin/achievements'),
    create: (data)     => adminPost('/admin/achievements', data),
    update: (id, data) => adminPatch(`/admin/achievements/${id}`, data),
    remove: (id)       => adminDelete(`/admin/achievements/${id}`),
  },
  stats: {
    dashboard: ()           => adminGet('/admin/stats/dashboard'),
    troubled:  (limit = 20) => adminGet('/admin/stats/exercises/troubled', { limit }),
  },
}
