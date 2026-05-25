// ─────────────────────────────────────────────────────────────
//  LingvaUZ — Theme system
//  5 colors × 2 modes (light / dark) = 10 themes
//  Each theme defines primary / secondary / tertiary + neutral base.
// ─────────────────────────────────────────────────────────────

const lightBase = {
  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceAlt: '#EDEDED',
  text: '#1A1A1A',
  textSecondary: '#5C5C5C',
  textLight: '#9A9A9A',
  border: '#E5E5E5',
  borderMedium: '#CFCFCF',
  tabInactive: '#A0A0A0',
  tabBorder: '#E5E5E5',
  error: '#E63946',
  errorLight: '#FFE5E7',
  wrong: '#E63946',
  wrongBg: '#FFE5E7',
  wrongBorder: '#E63946',
  correct: '#16A34A',
  correctBg: '#E8F8EE',
  correctBorder: '#16A34A',
  selectedBorder: '#60A5FA',
  selectedBg: '#E6F0FF',
  gem: '#1CB0F6',
  warning: '#F59E0B',
  warningLight: '#FFF3D9',
  info: '#1CB0F6',
  infoLight: '#E8F7FF',
  streak: '#F59E0B',
  xp: '#F59E0B',
  heart: '#E63946',
}

const darkBase: typeof lightBase = {
  background: '#0F1115',
  surface: '#161A21',
  surfaceAlt: '#1E232C',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textLight: '#64748B',
  border: '#252B36',
  borderMedium: '#34404F',
  tabInactive: '#64748B',
  tabBorder: '#252B36',
  error: '#F87171',
  errorLight: '#3A1F23',
  wrong: '#F87171',
  wrongBg: '#3A1F23',
  wrongBorder: '#F87171',
  correct: '#4ADE80',
  correctBg: '#152C1E',
  correctBorder: '#4ADE80',
  selectedBorder: '#60A5FA',
  selectedBg: '#152030',
  gem: '#4CC2FF',
  warning: '#FBBF24',
  warningLight: '#2E2316',
  info: '#4CC2FF',
  infoLight: '#152030',
  streak: '#FBBF24',
  xp: '#FBBF24',
  heart: '#F87171',
}

// Each theme provides 3 brand colors + per-mode neutral overrides.
type Trio = {
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  secondaryDark: string
  secondaryLight: string
  tertiary: string
  tertiaryDark: string
  tertiaryLight: string
}

type ColorOverrides = Partial<typeof lightBase>

interface ColorDef {
  id: string
  label: string
  emoji: string
  light: Trio & ColorOverrides
  dark:  Trio & ColorOverrides
}

const COLORS = {
  // 1. Terracotta — warm earth tones, designed primarily for light mode
  terracotta: {
    id: 'terracotta', label: 'Terracotta', emoji: '🏜️',
    light: {
      primary: '#7D4E3A', primaryDark: '#5C3725', primaryLight: '#EFD9CC',
      secondary: '#D8754E', secondaryDark: '#B95A35', secondaryLight: '#FBDFD0',
      tertiary: '#2C2C2C', tertiaryDark: '#000000', tertiaryLight: '#5E5E5E',
      background: '#FBF2E2', surface: '#F4E9D2', surfaceAlt: '#EBDDC0',
      border: '#E3D2B0', borderMedium: '#CDB78D',
      text: '#2C2017', textSecondary: '#6B5742', textLight: '#A0866A',
    },
    dark: {
      primary: '#D49371', primaryDark: '#A56B4D', primaryLight: '#3A2418',
      secondary: '#E89070', secondaryDark: '#B95A35', secondaryLight: '#3A1F12',
      tertiary: '#E5DDD2', tertiaryDark: '#B5ACA0', tertiaryLight: '#3A332B',
      background: '#1A130D', surface: '#241B12', surfaceAlt: '#2E2419',
      border: '#382C1E', borderMedium: '#4A3D2D',
      text: '#F2E6D2', textSecondary: '#B5A78F', textLight: '#7A6B55',
    },
  },

  // 2. Emerald — vivid greens with teal & sky highlights
  emerald: {
    id: 'emerald', label: 'Emerald', emoji: '💚',
    light: {
      primary: '#16A34A', primaryDark: '#0F7A37', primaryLight: '#DCFCE7',
      secondary: '#0D9488', secondaryDark: '#0B7A70', secondaryLight: '#CFFAF4',
      tertiary: '#2563EB', tertiaryDark: '#1E4FBF', tertiaryLight: '#DBE9FF',
      background: '#F3FBF6', surface: '#E8F5EC', surfaceAlt: '#D6EBDD',
      border: '#CCE3D3', borderMedium: '#A8CDB4',
      text: '#0F2A1A', textSecondary: '#456B55', textLight: '#7A9988',
      selectedBorder: '#16A34A', selectedBg: '#DCFCE7',
    },
    dark: {
      primary: '#2ECC71', primaryDark: '#22A65C', primaryLight: '#0E2A19',
      secondary: '#1ABC9C', secondaryDark: '#129580', secondaryLight: '#0D2724',
      tertiary: '#3498DB', tertiaryDark: '#2674B0', tertiaryLight: '#0F2434',
      background: '#0E150F', surface: '#16201A', surfaceAlt: '#1E2A22',
      border: '#243126', borderMedium: '#32413A',
    },
  },

  // 3. Vivid — purple / pink / blue accent
  vivid: {
    id: 'vivid', label: 'Vivid', emoji: '🪻',
    light: {
      primary: '#9333EA', primaryDark: '#7022B5', primaryLight: '#F2E5FE',
      secondary: '#DB2777', secondaryDark: '#A21D5C', secondaryLight: '#FCE2EE',
      tertiary: '#2563EB', tertiaryDark: '#1E4FBF', tertiaryLight: '#DBE9FF',
      background: '#FBF6FF', surface: '#F3E8FB', surfaceAlt: '#EAD8F6',
      border: '#E1CCF1', borderMedium: '#C9A6E5',
      text: '#2A0F3D', textSecondary: '#6B4585', textLight: '#9A7AAE',
      selectedBorder: '#9333EA', selectedBg: '#F2E5FE',
    },
    dark: {
      primary: '#A855F7', primaryDark: '#8B2FDB', primaryLight: '#26143C',
      secondary: '#EC4899', secondaryDark: '#C7327F', secondaryLight: '#3A1326',
      tertiary: '#3B82F6', tertiaryDark: '#2A66D0', tertiaryLight: '#0F1F3A',
      background: '#0F172A', surface: '#1A2238', surfaceAlt: '#212B45',
      border: '#2A3450', borderMedium: '#384567',
    },
  },

  // 4. Cyber — neon cyan over dark indigo (light = cool minimalist white)
  cyber: {
    id: 'cyber', label: 'Cyber', emoji: '⚡',
    light: {
      primary: '#0891B2', primaryDark: '#066E8B', primaryLight: '#CFFAFE',
      secondary: '#14B8A6', secondaryDark: '#0F8C80', secondaryLight: '#CFFAF4',
      tertiary: '#1E293B', tertiaryDark: '#0F1F3A', tertiaryLight: '#E2E8F0',
      background: '#F2FAFC', surface: '#E2F1F5', surfaceAlt: '#CCE5EB',
      border: '#C5DDE3', borderMedium: '#9BC2CD',
      text: '#0F1F2A', textSecondary: '#476778', textLight: '#7C97A6',
      selectedBorder: '#0891B2', selectedBg: '#CFFAFE',
      info: '#0891B2', gem: '#0891B2',
    },
    dark: {
      primary: '#00E5FF', primaryDark: '#00B5CC', primaryLight: '#0F2A33',
      secondary: '#2DD4BF', secondaryDark: '#22A99B', secondaryLight: '#0F2A28',
      tertiary: '#94A3B8', tertiaryDark: '#6B7B92', tertiaryLight: '#1B2533',
      background: '#0F172A', surface: '#172033', surfaceAlt: '#1F2A40',
      border: '#293650', borderMedium: '#384568',
    },
  },

  // 5. Sunset — warm orange / amber
  sunset: {
    id: 'sunset', label: 'Sunset', emoji: '🌅',
    light: {
      primary: '#F97316', primaryDark: '#C2580B', primaryLight: '#FFE5D0',
      secondary: '#EF4444', secondaryDark: '#B91C1C', secondaryLight: '#FEE2E2',
      tertiary: '#FBBF24', tertiaryDark: '#D89713', tertiaryLight: '#FEF3C7',
      background: '#FFF7EC', surface: '#FFEAD2', surfaceAlt: '#FFD8B5',
      border: '#F5CDA3', borderMedium: '#E8AC78',
      text: '#3D1A07', textSecondary: '#7A4520', textLight: '#A87858',
      selectedBorder: '#F97316', selectedBg: '#FFE5D0',
      streak: '#C2580B', xp: '#C2580B',
    },
    dark: {
      primary: '#FB923C', primaryDark: '#F97316', primaryLight: '#3A1F0E',
      secondary: '#F87171', secondaryDark: '#EF4444', secondaryLight: '#3A1416',
      tertiary: '#FBBF24', tertiaryDark: '#D89713', tertiaryLight: '#332512',
      background: '#1A1310', surface: '#241B17', surfaceAlt: '#2E251F',
      border: '#3A2E25', borderMedium: '#4D3E33',
      streak: '#FB923C', xp: '#FB923C',
    },
  },
} satisfies Record<string, ColorDef>

export type ThemeId = keyof typeof COLORS
export type ThemeMode = 'light' | 'dark'

// ─── Resolved themes ─────────────────────────────────────────

export const THEMES = Object.fromEntries(
  Object.entries(COLORS).map(([id, c]) => [
    id,
    {
      id: id as ThemeId,
      label: c.label,
      emoji: c.emoji,
      light: { ...lightBase, ...c.light },
      dark:  { ...darkBase,  ...c.dark  },
    },
  ]),
) as { [K in ThemeId]: {
  id: ThemeId
  label: string
  emoji: string
  light: typeof lightBase & Trio
  dark:  typeof lightBase & Trio
} }

export const THEME_IDS = Object.keys(THEMES) as ThemeId[]

// Flat shape returned by useColors() — components keep using c.primary etc.
export type ThemeColors = typeof lightBase & Trio & {
  id: ThemeId
  label: string
  emoji: string
  mode: ThemeMode
  // Foreground color to use on top of primary/secondary/tertiary fills.
  // In light mode primary is dark → white text reads well.
  // In dark mode primary is light → use dark text instead.
  onPrimary: string
  onSecondary: string
  onTertiary: string
}

// ─── Typography ─────────────────────────────────────────────
// Per-theme font stacks. On mobile these are React-Native font family names
// (require expo-font to actually load custom fonts). Fallback to system.

export const FONTS: Record<ThemeId, { headline: string; body: string; mono: string }> = {
  terracotta: { headline: 'PlusJakartaSans', body: 'PlusJakartaSans', mono: 'JetBrainsMono' },
  emerald:    { headline: 'SpaceGrotesk',    body: 'SpaceGrotesk',    mono: 'JetBrainsMono' },
  vivid:      { headline: 'Sora',            body: 'Inter',            mono: 'JetBrainsMono' },
  cyber:      { headline: 'Manrope',         body: 'Inter',            mono: 'JetBrainsMono' },
  sunset:     { headline: 'PlusJakartaSans', body: 'Inter',            mono: 'JetBrainsMono' },
}
