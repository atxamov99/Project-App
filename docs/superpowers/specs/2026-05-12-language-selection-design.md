# LingvaUZ Language Selection Design Specification

## Overview
This document specifies the language selection flow for user registration in the LingvaUZ language learning app. The design ensures clear distinction between interface language (used for app navigation, explanations, and translations) and target language (the language the user wants to learn).

## Language Selection Flow

### Overall Flow
1. Registration (email, username, password)
2. Interface Language Selection Screen
3. Learning Language Selection Screen  
4. Mini Level Test / Onboarding
5. Home Screen

### Screen 1: Interface Language Selection
**Purpose:** Select the language for app interface, explanations, and translations

**UI Elements:**
- Title: "What language do you speak?"
- Subtitle: "This language will be used for app navigation, explanations, and translations"
- Auto-detection banner: Shows recommended option based on device language (e.g., "Recommended: Russian (based on your device language)")
- Three large rounded selection cards:
  - Uzbek: 🇺🇿 O'zbekcha
  - English: 🇬🇧 English  
  - Russian: 🇷🇺 Русский
- Card layout: Flag + Language Name + Native Name
- Primary action button: "Continue"

**Behavior:**
- User selects one language by tapping a card
- Selected card receives visual highlight (border/background change)
- "Continue" button advances to next screen
- Auto-detection recommendation appears as a subtle banner above the cards

### Screen 2: Learning Language Selection
**Purpose:** Select the language the user wants to study

**UI Elements:**
- Title: "What language do you want to learn?"
- Subtitle: "This is the language you'll study through lessons and exercises"
- Three large rounded selection cards showing the same three languages
- **Key UX Feature:** The language selected in Screen 1 is disabled (grayed out, not tappable)
- Disabled card shows indicator: "Already selected as interface language"
- Primary action button: "Start Learning"

**Behavior:**
- User selects one of the two remaining languages
- Disabled card from Screen 1 cannot be selected
- Selected card receives visual highlight
- "Start Learning" button completes registration and transitions to mini onboarding

## Validation & Error Prevention
- **Preventive Approach:** Rather than showing errors after selection, the system prevents invalid selections by disabling already-chosen options
- **Visual Feedback:** Clear indication of why an option is unavailable
- **No Hard Errors:** Eliminates frustrating error states through proactive UI design
- **Auto-Detection:** Uses device language to provide intelligent default recommendation

## Data Storage
Upon successful completion of both language selection screens:
- Interface language stored in user profile as `interfaceLanguage`
- Target language stored in user profile as `targetLanguage`
- Both values reference language codes: 'uz', 'en', 'ru'

## Accessibility Considerations
- Large touch targets (minimum 48x48dp) for all selection cards
- Sufficient color contrast for disabled vs enabled states
- Clear visual hierarchy distinguishing title, subtitle, and action buttons
- Screen reader accessible labels for all interactive elements

## Scalability
- Design easily accommodates additional languages by adding more selection cards
- Language data stored as key-value pairs allowing simple expansion
- Auto-detection logic extensible to new language codes
- UI layout adapts to 2-6 language options without redesign

## Rationale
This two-screen approach with preventive UX provides:
1. **Cognitive Clarity:** Separates two distinct decisions (interface vs learning language)
2. **Error Prevention:** Disables invalid selections before user can make mistakes
3. **User-Friendly Language:** Uses conversational phrasing instead of technical terms
4. **Personalization:** Auto-detection reduces setup friction
5. **Required Core Setup:** No skip option ensures proper app personalization from first use
6. **Scalability:** Clean pattern for adding new languages

## Related Components
- Registration screens (`mobile/app/(auth)/register.tsx`)
- Language selection components (to be created)
- User profile/storage updates (to be implemented in authStore)
- Mini onboarding flow (existing lesson system)