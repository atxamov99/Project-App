# LingvaUZ Mobile Setup Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining setup tasks for the LingvaUZ mobile application to make it ready for testing and backend integration.

**Architecture:** The mobile app uses Expo SDK 55 with expo-router for navigation, Zustand for state management, TanStack Query for server state, and Axios for API calls. The plan focuses on verifying dependencies, testing the app in Expo Go, confirming backend connectivity, and validating asset configuration.

**Tech Stack:** Expo SDK 55, React Native, React 19, TypeScript, Axios, TanStack Query, Zustand, expo-router

---

### Task 1: Check package.json and prepare for npm install

**Files:**
- Read: `mobile/package.json`

- [ ] **Step 1: Examine package.json for potential issues**

Review the package.json to identify any potential version conflicts or issues that might arise during installation.

- [ ] **Step 2: Check Node and npm versions**

Verify that the installed Node and npm versions are compatible with the project requirements.

Run: `node --version && npm --version`
Expected: Node version compatible with Expo SDK 55, npm version 9+

- [ ] **Step 3: Run npm install with verbose logging to detect issues**

Execute npm install and carefully review output for warnings or errors.

Run: `cd mobile && npm install`
Expected: Successful installation with only peer dependency warnings (if any) that don't prevent functionality

- [ ] **Step 4: Verify installation completed successfully**

Check that node_modules directory was created and package-lock.json was updated.

Run: `cd mobile && ls -la node_modules/ | head -5`
Expected: Node_modules directory with dependency folders visible

- [ ] **Step 5: Commit the changes**

Record the dependency installation.

Run: 
```
git add mobile/package-lock.json
git commit -m "chore: install mobile dependencies"
```

### Task 2: Test application in Expo Go SDK 55

**Files:**
- Modify: `mobile/app.json` (if needed for testing configuration)
- Read: `mobile/app/_layout.tsx` (to verify root layout)

- [ ] **Step 1: Start Expo development server**

Launch Expo DevTools to generate QR code for testing.

Run: `cd mobile && npx expo start`
Expected: Expo DevTools opens in browser displaying QR code and connection options

- [ ] **Step 2: Test connection options**

Verify that the development server offers multiple connection methods (LAN, tunnel, etc.)

Expected: DevTools shows "Connection" options with available networks

- [ ] **Step 3: Test on physical device or emulator**

Scan QR code with Expo Go app (iOS/Android) or press 'a' for Android emulator, 'i' for iOS simulator

Expected: Application loads and displays initial authentication screen

- [ ] **Step 4: Verify basic navigation**

Test that the app can navigate between main sections (after auth) without crashing

Expected: Tabs navigation works and screens render correctly

- [ ] **Step 5: Stop Expo development server**

Terminate the expo start process to move to next task

Run: Ctrl+C in the terminal where expo start is running
Expected: Process terminates cleanly

- [ ] **Step 6: Commit any configuration changes**

If any app.json changes were made for testing, commit them

Run: 
```
git add mobile/app.json
git commit -m "chore: verify Expo configuration for testing"
```

### Task 3: Verify backend connectivity and API configuration

**Files:**
- Read: `mobile/.env`
- Read: `mobile/lib/api.ts`
- Read: `mobile/lib/queryClient.ts`

- [ ] **Step 1: Verify environment variable configuration**

Check that EXPO_PUBLIC_API_URL is correctly set in .env file

Run: `cd mobile && cat .env`
Expected: `EXPO_PUBLIC_API_URL=http://localhost:3001/api` (or appropriate backend URL)

- [ ] **Step 2: Verify API client configuration**

Inspect the Axios instance creation to ensure it uses the environment variable

Run: `cd mobile && cat lib/api.ts`
Expected: Line 5 shows `baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api',`

- [ ] **Step 3: Verify token interceptor is properly configured**

Check that the request interceptor retrieves token from authStore

Expected: Lines 9-15 show proper token attachment to requests

- [ ] **Step 4: Verify error handling for 401 responses**

Check that 401 responses trigger logout from authStore

Expected: Lines 17-25 show proper 401 handling with logout

- [ ] **Step 5: Verify query client configuration**

Inspect TanStack Query client for reasonable defaults

Run: `cd mobile && cat lib/queryClient.ts`
Expected: Shows retry: 1 and staleTime: 60_000 configurations

- [ ] **Step 6: Commit if any configuration corrections were made**

Run: 
```
git add mobile/.env mobile/lib/api.ts mobile/lib/queryClient.ts
git commit -m "chore: verify backend connectivity configuration"
```

### Task 4: Verify asset configuration and resources

**Files:**
- Read: `mobile/app.json`
- Read: `mobile/assets/icon.png`
- Read: `mobile/assets/splash-icon.png`
- Read: `mobile/assets/adaptive-icon.png`
- Read: `mobile/assets/favicon.png`

- [ ] **Step 1: Verify app.json references correct asset paths**

Check that all asset references in app.json point to existing files

Run: `cd mobile && cat app.json`
Expected: 
- "icon": "./assets/icon.png"
- "splash.image": "./assets/splash-icon.png"  
- "adaptiveIcon.foregroundImage": "./assets/adaptive-icon.png"
- "web.favicon": "./assets/favicon.png"

- [ ] **Step 2: Verify asset files exist and are valid images**

Confirm that all referenced asset files are present and accessible

Run: 
```
cd mobile && 
ls -la assets/icon.png assets/splash-icon.png assets/adaptive-icon.png assets/favicon.png
```
Expected: All files listed with reasonable file sizes (not zero bytes)

- [ ] **Step 3: Validate that assets match expected formats and dimensions**

Check that icon files are square and appropriate sizes for mobile apps

Run: `cd mobile && file assets/icon.png assets/splash-icon.png assets/adaptive-icon.png`
Expected: PNG image data with reasonable dimensions

- [ ] **Step 4: Commit if any asset corrections were made**

Run: 
```
git add mobile/app.json
git commit -m "chore: verify asset configuration"
```

### Task 5: Final verification and completion

**Files:**
- Read: All previously modified/created files

- [ ] **Step 1: Run final dependency verification**

Ensure all dependencies are properly installed and no critical issues exist

Run: `cd mobile && npm ls --prod --depth=0`
Expected: List of production dependencies without ERROR: missing or INVALID entries

- [ ] **Step 2: Validate TypeScript compilation**

Check that the project compiles without errors

Run: `cd mobile && npx tsc --noEmit`
Expected: No TypeScript compilation errors

- [ ] **Step 3: Summary of completed work**

Verify that all setup tasks from the original task list have been addressed:
- [x] `npm install` completed with issue checking
- [x] Expo Go SDK 55 testing verified
- [x] Backend connectivity configured (dependent on backend running)
- [x] Assets verified as properly configured

- [ ] **Step 5: Commit final verification**

Run: 
```
git add mobile/package-lock.json
git commit -m "chore: complete mobile setup verification"
```