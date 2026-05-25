# LingvaUZ Mobile App - Figma Design Implementation

## Overview
Implementation of the LingvaUZ mobile application based on the Figma design provided by the user. This specification outlines the hybrid design system approach to create a pixel-perfect match to the Figma design while preserving the existing strong architectural foundations.

## 🎯 Goals
- Create a mobile app that matches the Figma design exactly
- Implement complete language learning system with all exercise types
- Add sophisticated animations and micro-interactions
- Integrate 3D models and interactive elements where appropriate
- Maintain and improve existing architecture (state management, navigation, API)

## 🏗️ Architecture

### Preserved Elements
- **State Management**: Zustand stores (`authStore`, `lessonStore`)
- **Data Fetching**: TanStack Query v5 + Axios
- **Authentication**: JWT-based with access/refresh tokens
- **Navigation**: Expo Router v5 with file-based routing
- **Animation Base**: React Native Reanimated v3 (already integrated)

### Design System
Values extracted from Figma design during implementation:
- **Color Palette**: 
  - Primary: #58CC02 (LingvaUZ Green) - verified from existing codebase
  - Secondary, Success, Warning, Error, Neutral/Grayscale: Extracted using Figma color picker tool
- **Typography**: 
  - Font family: Extracted from Figma text styles
  - Heading levels: H1-H6 with specific weights and sizes measured from Figma
  - Body text: Regular and medium weights with line heights from Figma
  - Labels and captions: Smaller sizes with appropriate weights from Figma
- **Spacing**: 4px grid system for consistency - measurements taken from Figma layout
- **Border Radius**: 
  - Small: 4px (inputs, buttons)
  - Medium: 8px (cards, containers)
  - Large: 16px (modals, major containers)
  - All values validated against Figma measurements
- **Shadows/Elevation**: 
  - Specific opacity, blur, and spread values extracted from Figma shadow effects
  - Defined elevation levels matching Figma depth hierarchy

## ⚙️ Component Strategy

### Hybrid Approach
Gradual replacement of existing components with Figma-accurate versions:

#### Phase 1: Core Learning Components
- Lesson screen and navigation
- All 8 exercise type components:
  1. Translate Text
  2. Build Sentence
  3. Listen and Type
  4. Speak and Check
  5. Match Pairs
  6. Select Image
  7. Fill in Blank
  8. Multiple Choice
- Answer feedback systems
- Progress tracking UI (lives, streak, XP)

#### Phase 2: Navigation & Layout
- Tab bar navigation with animated icons
- Auth screens (login, register)
- Profile screen with statistics
- Leaderboard and league views
- Practice and shop screens

#### Phase 3: Utility & Helper Components
- Custom buttons, inputs, toggles
- Loading skeletons and placeholders
- Icons and illustrations
- Audio players and controls
- Mascot and celebration animations

Each component includes:
- Pixel-perfect Figma styling
- Frenter-optimized animations using Reanimated worklets
- Accessibility features (screen reader labels, touch targets)
- Performance optimizations (memoization, efficient re-renders)

## 🎬 Animation System

### Enhanced Reanimated Implementation
Building upon existing Reanimated v3 integration:

#### Screen Transitions
- Shared element animations between screens
- Modal entrance/exit with fade and scale
- Tab transitions with subtle motion

#### Exercise-Specific Animations
- Correct answer celebrations: confetti, mascot reactions, score bursts
- Wrong answer feedback: gentle shake, color flash, explanation reveal
- Input animations: focus states, character-by-character appearance
- Progress bar animations: smooth filling with celebratory milestones

#### Micro-interactions
- Button presses: scale down/up with ripple effect
- Input focus: border glow and label elevation
- Toggle switches: smooth thumb movement with background change
- Card taps: slight elevation change with shadow adjustment

#### Performance Considerations
- All animations implemented as worklets for 60fps guarantee
- Judicious use of `useSharedValue` and `useAnimatedStyle`
- Layout animations avoided where possible to prevent performance issues
- Animation cleanup in component unmount to prevent memory leaks

## 🧩 3D Models & Interactive Elements

### Selective Integration Strategy
3D elements used only where they enhance learning outcomes:

#### Vocabulary Lessons
- Interactive 3D objects for spatial vocabulary (furniture, tools, animals)
- Rotation, zoom, and tap-to-hear pronunciation
- Scale based on word difficulty and lesson level

#### Culture & History Lessons
- 3D models of historical artifacts, monuments, cultural items
- Interactive exploration with hotspots for additional information
- AR mode option for placing artifacts in real world (future enhancement)

#### Science & Technical Lessons
- Technical diagrams and machinery with labeled parts
- Interactive simulations for cause-and-effect learning
- Animated processes (water cycle, machinery operation)

#### Fallback Strategy
- 2D illustrations for devices with limited GPU capabilities
- Reduced complexity models for older devices
- Quality settings based on device performance benchmark

#### Technical Implementation
- Primary library: Expo Three.js or React Native Three Fiber
- Model formats: GLTF/GLB with compression (Draco)
- Texture optimization: compressed basis universal textures
- Loading: progressive loading with placeholders
- Touch handling: raycasting for interaction detection

## 📱 Language Learning Features

### Complete Exercise Implementation
All 8 exercise types from the Figma design with full functionality:

#### 1. Translate Text
- Text input with real-time validation
- Audio pronunciation button
- Character counting and input assistance
- Hint system (reveal first letter, etc.)

#### 2. Build Sentence
- Drag-and-drop word tiles with snap-to-grid
- Word bank with intelligent distraction options
- Sentence structure validation
- Audio playback of constructed sentence

#### 3. Listen and Type
- High-quality audio playback with variable speed
- Recording capability for speech practice
- Waveform visualization during playback
- Pitch and rhythm feedback (future enhancement)

#### 4. Speak and Check
- Speech-to-text integration (device native or cloud service)
- Pronunciation scoring with detailed feedback
- Visual waveform comparison
- Attempt limiting and hint system

#### 5. Match Pairs
- Animated card flipping with satisfying physics
- Timed and untimed modes
- Increasing difficulty with more pairs
- Sound effects for matches and mismatches

#### 6. Select Image
- High-resolution images with zoom capability
- Audio description for accessibility
- Multiple correct answers for complex concepts
- Image source attribution when required

#### 7. Fill in Blank
- Contextual clue highlighting
- Word bank with grammatical hints
- Multiple blanks per sentence
- Real-time validation as user types

#### 8. Multiple Choice
- Animated option selection
- Immediate feedback with explanation
- Option shuffling to prevent memorization
- Confidence-based option ordering

### Progress & Gamification
- **XP System**: Awarded per exercise, scaled by difficulty and streak
- **Level Progression**: Non-linear XP requirements with milestone rewards
- **Streak System**: Daily activity tracking with freeze options
- **Lives System**: 5 lives with configurable refill timing
- **Achievements**: 
  - Streak milestones (3, 7, 14, 30 days)
  - Volume milestones (10, 50, 100 exercises)
  - Accuracy milestones (80%, 90%, 95% over time)
  - Speed milestones (completion under time thresholds)
- **Gem Economy**: 
  - Earned through lesson completion and achievements
  - Spendable on streak freezes, extra lives, cosmetic items
  - Daily login bonuses and streak bonuses

### Social & Competitive Features
- **Leagues**: Weekly XP-based competition with promotion/relegation
- **Friend System**: Follow friends, see their progress, send gifts
- **Clubs/Communities**: Topic-based groups for practice and discussion
- **Shared Achievements**: Collaborative goals for friend groups

## 📱 Platform Considerations

### Device Support
- **Minimum**: Android 8.0, iOS 13
- **Optimized**: Latest Android and iOS versions
- **Form Factors**: Phone primary, tablet secondary
- **Orientation**: Portrait primary, landscape for specific exercises

### Performance Targets
- **Frame Rate**: 60fps for animations and transitions
- **Load Time**: <2s for initial load, <1s for screen transitions
- **Memory Usage**: <150MB typical usage
- **Bundle Size**: <40MB APK/IPA size

### Accessibility
- **WCAG 2.1 AA Compliance**: 
  - Text contrast ratios verified against Figma colors
  - Touch target sizes (minimum 48x48dp) verified in Figma
  - Screen reader support throughout
  - Dynamic type support
  - Reduced motion options
- **Internationalization**: 
  - UTF-8 support for all languages
  - Right-to-left layout support (future for Arabic/Hebrew)
  - Culturally appropriate examples and media

## 🔒 Security & Privacy
- **Data Protection**: 
  - Encrypted local storage for sensitive data
  - Secure token handling with refresh rotation
  - Minimal personal data collection
- **Network Security**: 
  - HTTPS everywhere with certificate pinning
  - Secure WebSocket connections for real-time features
  - Rate limiting and abuse prevention
- **Permissions**: 
  - Microphone only when speech features active
  - Storage only for user-generated content
  - Location only if explicitly opted-in for local events

## 🧪 Testing Strategy
- **Unit Testing**: Jest and React Native Testing Library for business logic
- **Integration Testing**: Detox for critical user flows
- **Visual Testing**: Storybook with Chromatic for UI consistency
- **Performance Testing**: 
  - Frame rate monitoring with performance profiles
  - Memory leak detection with Xcode Instruments/Android Profiler
  - Bundle analysis with source-map-explorer
- **User Acceptance Testing**: 
  - Beta testing through TestFlight/Google Play Internal
  - A/B testing for new features and animations
  - Accessibility testing with screen reader users

## 🚀 Implementation Roadmap
See implementation plan for detailed breakdown.

---
*Spec Version: 1.0*
*Date: 2026-05-11*
*Approach: Hybrid Design System*
*Status: Approved for Implementation*