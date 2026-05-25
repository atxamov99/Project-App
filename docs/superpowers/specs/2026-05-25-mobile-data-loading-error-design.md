# Mobile Data Loading Error Fix

## Overview
The mobile app shows an error "Ma'lumot yuklanmadi. Qayta urining." when trying to access lessons, preventing users from starting the learning part. This error originates from the home screen's course data fetch failure. Additionally, the lesson hook does not handle API errors gracefully, leading to potential undefined exercise rendering.

## Proposed Solution
Enhance error handling in both the home screen course fetch and the lesson hook to:
1. Provide specific error messages
2. Offer retry functionality
3. Prevent undefined state propagation

## Architecture

### Hook Modifications
- Extend `useLesson` hook with `error: string | null` state and `setError` setter.
- In the initial fetch (`useEffect`), catch API errors and call `setError` with a user-friendly message (from `error.response?.data?.message` or `error.message`).
- On retry, clear the error state and refetch.

### Component Modifications
- **HomeScreen**: Keep existing error handling but enhance the error message to include possible causes (network, auth, server) and retain the retry button.
- **LessonScreen**: 
  - Read `error` from `useLesson`.
  - If `error` is not null, display:
    - Error message text
    - Retry button that calls `reset()` from lesson store and refetches (by triggering the hook's effect via lessonId change or a refetch function).
  - Otherwise, render the lesson as usual.

## Data Flow
- `useLesson` hook manages `error` state locally.
- Lesson screen subscribes to `error` via hook return value.
- Retry action in lesson screen:
  1. Clears hook's error state (via `setError(null)`)
  2. Resets lesson store (to clear previous exercises/index)
  3. Optionally increments a version key in lessonId to force hook re-run, or simply calls the reset function which triggers the effect again (since the effect depends on `reset` callback).
- Home screen retry: simply refetches the course query by invalidating the query cache or triggering a refetch.

## Error Handling
- **Home Screen**:
  - On course fetch error, show error message with retry button.
  - Message: "Ma'lumot yuklanmadi. Sabb: [network/auth/server]. Qayta urining."
  - Retry: calls `queryClient.refetchQueries(['course'])`.
- **Lesson Hook**:
  - On lesson/lives fetch error, set error state to:
    - Network: "Internet aloqasini tekshiring."
    - 401: "Tizimga kirish tokeni muddati tugagan. Qayta kirishing."
    - 500: "Serverda xatolik yuz berdi. Biroz so'ng urining."
    - Default: "Ma'lumot yuklanmadi. Qayta urining."
  - On retry: clear error, reset store, and refetch.

## Testing
- **Unit Tests**:
  - Mock `api.get` to reject, verify hook sets error state.
  - Mock `api.get` to resolve, verify error is null and exercises set.
- **Integration Tests**:
  - Render LessonScreen with mocked hook returning error, verify error message and retry button are present.
  - Mock retry action, verify error cleared and refetch attempted.
- **Manual Testing**:
  - Disable network, verify error message appears.
  - Use invalid token, verify 401-specific message.
  - Simulate 500 error, verify server error message.
  - Retry after fixing network, verify lesson loads correctly.

## Implementation Notes
- Ensure error messages are localized (currently Uzbek; keep consistent).
- Avoid showing raw error details to users.
- Retry should not cause infinite loops; consider limiting retry attempts or using exponential backoff (optional for MVP).
- The lesson store reset ensures clean state on retry.