# Mobile-Backend Connection Fix Design

## Problem Statement
The mobile application fails to successfully register or login users when connecting to the backend via ngrok tunnel, showing only generic error messages instead of specific backend responses.

## Root Cause Analysis
1. **Generic error handling**: Mobile app displays only fallback error messages (`err.response?.data?.error ?? err.response?.data?.message ?? 'Xatolik yuz berdi'`) instead of specific backend error responses.
2. **Potential CORS issues**: Backend CORS configuration may not accept requests from ngrok domain.
3. **Ngrok instability**: Free ngrok tunnels may have connection limitations or require URL updates.
4. **Lack of debugging**: Insufficient error details make it difficult to diagnose connection problems.

## Solution Overview
Enhance error handling in the mobile application to display specific backend responses, verify and fix CORS configuration in the backend, and improve connection stability monitoring.

## Detailed Design

### 1. Mobile Application Improvements

#### Error Handling Enhancement
- **File**: `mobile/lib/api.ts`
  - Enhance axios response interceptor to log full error objects for debugging
  - Preserve original error details instead of converting to generic messages
  - Add network error detection (timeout, DNS failure, etc.)

- **Files**: `mobile/app/(auth)/login.tsx` and `register.tsx`
  - Replace generic error alert with specific backend error messages when available
  - Show field-specific errors for validation failures (400 responses)
  - Show authentication errors for 401 responses
  - Show server errors for 500+ responses (with technical details in development)
  - Show connection error messages for network failures

#### Connection Monitoring
- Add connectivity check before API requests (optional)
- Display connection status indicator to user
- Implement retry mechanism for transient network failures

### 2. Backend Improvements

#### CORS Configuration
- **File**: `backend/src/app.ts`
  - Update CORS origin configuration to accept ngrok domains
  - Consider using regex pattern or dynamic origin validation for ngrok URLs
  - Add logging of incoming requests origins for debugging

#### Error Response Enhancement
- Ensure all error responses follow consistent format with `error` and `message` fields
- Maintain appropriate HTTP status codes (400, 401, 409, 500, etc.)
- Avoid exposing sensitive information in error messages in production

### 3. Development Workflow Improvements

#### Local Testing
- Provide instructions for testing backend directly via `localhost:3001`
- Steps to verify ngrok tunnel is correctly forwarding to local backend
- Methods to inspect network traffic in React Native debugger

#### Environment Configuration
- Document process for updating mobile `.env` when ngrok URL changes
- Consider adding script to automatically detect and update ngrok URL
- Provide troubleshooting guide for common connection issues

## Success Criteria
1. Mobile app displays specific error messages from backend (e.g., "Email already exists", "Invalid password")
2. Successful login/registration works via ngrok tunnel
3. Network errors show appropriate connection messages
4. Backend properly handles CORS requests from ngrok domain
5. Development team can easily diagnose connection issues

## Non-Goals
- Implementing production-grade ngrok alternatives (like Cloudflare Tunnel)
- Changing authentication mechanism (JWT remains unchanged)
- Major UI redesign of authentication screens

## Testing Plan
1. **Unit tests**: Enhanced error handling in API layer
2. **Integration tests**: Login/register flows with various error scenarios
3. **Manual testing**:
   - Test with ngrok tunnel active
   - Test direct localhost connection for comparison
   - Test various error conditions (invalid credentials, duplicate email, etc.)
   - Test network failure scenarios (disable internet, etc.)
4. **Regression testing**: Ensure existing functionality remains unaffected

## Implementation Notes
- Changes should be backward compatible with existing backend
- Error message improvements should not break frontend consumers
- CORS changes should maintain security (not overly permissive)
- Logging should respect environment (more verbose in development)