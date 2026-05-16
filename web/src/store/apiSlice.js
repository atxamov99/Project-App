import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Course', 'Lesson', 'Exercise', 'Language', 'Unit', 'Word', 'Achievement'],
  endpoints: (builder) => ({
    // --- Auth ---
    register: builder.mutation({
      query: (input) => ({ url: '/auth/register', method: 'POST', body: input }),
    }),
    login: builder.mutation({
      query: (input) => ({ url: '/auth/login', method: 'POST', body: input }),
    }),
    googleLogin: builder.mutation({
      query: ({ idToken }) => ({ url: '/auth/google', method: 'POST', body: { idToken } }),
    }),
    me: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),

    // --- User Content ---
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    getCourse: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ['Course'],
    }),
    enrollCourse: builder.mutation({
      query: (id) => ({ url: `/courses/${id}/enroll`, method: 'POST' }),
      invalidatesTags: ['Course'],
    }),
    getLesson: builder.query({
      query: (id) => `/lessons/${id}`,
      providesTags: ['Lesson'],
    }),
    completeLesson: builder.mutation({
      query: ({ id, body }) => ({ url: `/lessons/${id}/complete`, method: 'POST', body }),
      invalidatesTags: ['Lesson', 'User', 'Course'],
    }),
    checkExercise: builder.mutation({
      query: ({ id, answer }) => ({ url: `/exercises/${id}/check`, method: 'POST', body: { answer } }),
    }),
    getPracticeSession: builder.query({
      query: (limit = 10) => ({ url: '/practice/session', params: { limit } }),
    }),
    getLeague: builder.query({
      query: () => '/league',
    }),
    getStreak: builder.query({
      query: () => '/streak',
    }),
    getLives: builder.query({
      query: () => '/lives',
    }),
    buyLives: builder.mutation({
      query: () => ({ url: '/lives/buy', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
    getFollowing: builder.query({
      query: () => '/friends/following',
    }),
    getFollowers: builder.query({
      query: () => '/friends/followers',
    }),
    followUser: builder.mutation({
      query: (username) => ({ url: '/friends/follow', method: 'POST', body: { username } }),
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({ url: `/friends/unfollow/${userId}`, method: 'DELETE' }),
    }),
    searchFriends: builder.query({
      query: (q) => `/friends/search?q=${encodeURIComponent(q)}`,
    }),

    // --- Admin ---
    adminUsers: builder.query({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['User'],
    }),
    adminUserDetail: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ['User'],
    }),
    adminChangeRole: builder.mutation({
      query: ({ id, role }) => ({ url: `/admin/users/${id}/role`, method: 'PATCH', body: { role } }),
      invalidatesTags: ['User'],
    }),
    adminSuspendUser: builder.mutation({
      query: ({ id, reason }) => ({ url: `/admin/users/${id}/suspend`, method: 'POST', body: { reason } }),
      invalidatesTags: ['User'],
    }),
    adminUnsuspendUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}/unsuspend`, method: 'POST' }),
      invalidatesTags: ['User'],
    }),
    adminRemoveUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    adminLanguages: builder.query({
      query: () => '/admin/languages',
      providesTags: ['Language'],
    }),
    adminCreateLanguage: builder.mutation({
      query: (data) => ({ url: '/admin/languages', method: 'POST', body: data }),
      invalidatesTags: ['Language'],
    }),
    adminUpdateLanguage: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/languages/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Language'],
    }),
    adminRemoveLanguage: builder.mutation({
      query: (id) => ({ url: `/admin/languages/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Language'],
    }),
    adminCourses: builder.query({
      query: () => '/admin/courses',
      providesTags: ['Course'],
    }),
    adminCourseDetail: builder.query({
      query: (id) => `/admin/courses/${id}`,
      providesTags: ['Course'],
    }),
    adminCreateCourse: builder.mutation({
      query: (data) => ({ url: '/admin/courses', method: 'POST', body: data }),
      invalidatesTags: ['Course'],
    }),
    adminUpdateCourse: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/courses/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Course'],
    }),
    adminRemoveCourse: builder.mutation({
      query: (id) => ({ url: `/admin/courses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Course'],
    }),
    adminUnitsByCourse: builder.query({
      query: (courseId) => `/admin/units/by-course/${courseId}`,
      providesTags: ['Unit'],
    }),
    adminCreateUnit: builder.mutation({
      query: (data) => ({ url: '/admin/units', method: 'POST', body: data }),
      invalidatesTags: ['Unit'],
    }),
    adminUpdateUnit: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/units/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Unit'],
    }),
    adminRemoveUnit: builder.mutation({
      query: (id) => ({ url: `/admin/units/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Unit'],
    }),
    adminReorderUnits: builder.mutation({
      query: (items) => ({ url: '/admin/units/reorder', method: 'POST', body: { items } }),
      invalidatesTags: ['Unit'],
    }),
    adminLessonsByUnit: builder.query({
      query: (unitId) => `/admin/lessons/by-unit/${unitId}`,
      providesTags: ['Lesson'],
    }),
    adminLessonDetail: builder.query({
      query: (id) => `/admin/lessons/${id}`,
      providesTags: ['Lesson'],
    }),
    adminCreateLesson: builder.mutation({
      query: (data) => ({ url: '/admin/lessons', method: 'POST', body: data }),
      invalidatesTags: ['Lesson'],
    }),
    adminUpdateLesson: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/lessons/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Lesson'],
    }),
    adminRemoveLesson: builder.mutation({
      query: (id) => ({ url: `/admin/lessons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Lesson'],
    }),
    adminExercisesByLesson: builder.query({
      query: (lessonId) => `/admin/exercises/by-lesson/${lessonId}`,
      providesTags: ['Exercise'],
    }),
    adminCreateExercise: builder.mutation({
      query: (data) => ({ url: '/admin/exercises', method: 'POST', body: data }),
      invalidatesTags: ['Exercise'],
    }),
    adminUpdateExercise: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/exercises/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Exercise'],
    }),
    adminRemoveExercise: builder.mutation({
      query: (id) => ({ url: `/admin/exercises/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Exercise'],
    }),
    adminDetachExercise: builder.mutation({
      query: (linkId) => ({ url: `/admin/exercises/link/${linkId}`, method: 'DELETE' }),
      invalidatesTags: ['Exercise'],
    }),
    adminWords: builder.query({
      query: (params) => ({ url: '/admin/words', params }),
      providesTags: ['Word'],
    }),
    adminCreateWord: builder.mutation({
      query: (data) => ({ url: '/admin/words', method: 'POST', body: data }),
      invalidatesTags: ['Word'],
    }),
    adminUpdateWord: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/words/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Word'],
    }),
    adminRemoveWord: builder.mutation({
      query: (id) => ({ url: `/admin/words/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Word'],
    }),
    adminAchievements: builder.query({
      query: () => '/admin/achievements',
      providesTags: ['Achievement'],
    }),
    adminCreateAchievement: builder.mutation({
      query: (data) => ({ url: '/admin/achievements', method: 'POST', body: data }),
      invalidatesTags: ['Achievement'],
    }),
    adminUpdateAchievement: builder.mutation({
      query: ({ id, data }) => ({ url: `/admin/achievements/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Achievement'],
    }),
    adminRemoveAchievement: builder.mutation({
      query: (id) => ({ url: `/admin/achievements/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Achievement'],
    }),
    adminStatsDashboard: builder.query({
      query: () => '/admin/stats/dashboard',
    }),
    adminTroubledExercises: builder.query({
      query: (limit = 20) => ({ url: '/admin/stats/exercises/troubled', params: { limit } }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useEnrollCourseMutation,
  useGetLessonQuery,
  useCompleteLessonMutation,
  useCheckExerciseMutation,
  useGetPracticeSessionQuery,
  useGetLeagueQuery,
  useGetStreakQuery,
  useGetLivesQuery,
  useBuyLivesMutation,
  useGetFollowingQuery,
  useGetFollowersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useSearchFriendsQuery,
  useAdminUsersQuery,
  useAdminUserDetailQuery,
  useAdminChangeRoleMutation,
  useAdminSuspendUserMutation,
  useAdminUnsuspendUserMutation,
  useAdminRemoveUserMutation,
  useAdminLanguagesQuery,
  useAdminCreateLanguageMutation,
  useAdminUpdateLanguageMutation,
  useAdminRemoveLanguageMutation,
  useAdminCoursesQuery,
  useAdminCourseDetailQuery,
  useAdminCreateCourseMutation,
  useAdminUpdateCourseMutation,
  useAdminRemoveCourseMutation,
  useAdminUnitsByCourseQuery,
  useAdminCreateUnitMutation,
  useAdminUpdateUnitMutation,
  useAdminRemoveUnitMutation,
  useAdminReorderUnitsMutation,
  useAdminLessonsByUnitQuery,
  useAdminLessonDetailQuery,
  useAdminCreateLessonMutation,
  useAdminUpdateLessonMutation,
  useAdminRemoveLessonMutation,
  useAdminExercisesByLessonQuery,
  useAdminCreateExerciseMutation,
  useAdminUpdateExerciseMutation,
  useAdminRemoveExerciseMutation,
  useAdminDetachExerciseMutation,
  useAdminWordsQuery,
  useAdminCreateWordMutation,
  useAdminUpdateWordMutation,
  useAdminRemoveWordMutation,
  useAdminAchievementsQuery,
  useAdminCreateAchievementMutation,
  useAdminUpdateAchievementMutation,
  useAdminRemoveAchievementMutation,
  useAdminStatsDashboardQuery,
  useAdminTroubledExercisesQuery,
} = apiSlice;
