// ─────────────────────────────────────────────────────────────
//  LingvaUZ — Web theme system
//  5 colors × 2 modes (light / dark) = 10 themes
//  Mirrors mobile/constants/themes.ts conceptually.
//
//  Each theme defines 9 brand colors (primary/secondary/tertiary trio)
//  plus neutral mode-base. expandTokens() derives the full Material 3
//  token set used by Tailwind classes in the rest of the app.
// ─────────────────────────────────────────────────────────────

const lightBase = {
  background: '#FBF9F4',
  surface: '#FBF9F4',
  surfaceDim: '#DBDAD5',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F3EE',
  surfaceContainer: '#F0EEE9',
  surfaceContainerHigh: '#EAE8E3',
  surfaceContainerHighest: '#E4E2DD',
  surfaceVariant: '#E4E2DD',
  onBackground: '#1B1C19',
  onSurface: '#1B1C19',
  onSurfaceVariant: '#51443F',
  outline: '#84746E',
  outlineVariant: '#D6C2BB',
  inverseSurface: '#30312E',
  inverseOnSurface: '#F2F1EC',
  shadowAlpha: 'rgba(40, 30, 20, 0.08)',
  paperLiftColor: '#E8E3D5',
}

const darkBase = {
  background: '#0F1115',
  surface: '#0F1115',
  surfaceDim: '#0F1115',
  surfaceBright: '#2A2E36',
  surfaceContainerLowest: '#0A0C0F',
  surfaceContainerLow: '#161A21',
  surfaceContainer: '#1A1F27',
  surfaceContainerHigh: '#22272F',
  surfaceContainerHighest: '#2A303A',
  surfaceVariant: '#252B36',
  onBackground: '#F1F5F9',
  onSurface: '#F1F5F9',
  onSurfaceVariant: '#94A3B8',
  outline: '#64748B',
  outlineVariant: '#252B36',
  inverseSurface: '#F1F5F9',
  inverseOnSurface: '#0F1115',
  shadowAlpha: 'rgba(0, 0, 0, 0.4)',
  paperLiftColor: '#000000',
}

const sharedSemantic = (mode) => mode === 'light'
  ? {
      error: '#BA1A1A', onError: '#FFFFFF',
      errorContainer: '#FFDAD6', onErrorContainer: '#93000A',
    }
  : {
      error: '#F87171', onError: '#FFFFFF',
      errorContainer: '#3A1F23', onErrorContainer: '#FECACA',
    }

const COLORS = {
  // 1. Terracotta — warm earth tones (orig design)
  terracotta: {
    id: 'terracotta', label: 'Terracotta', emoji: '🏜️',
    light: {
      primary: '#7D4E3A',  primaryDark: '#5C3725', primaryLight: '#EFD9CC',
      secondary: '#D8754E', secondaryDark: '#B95A35', secondaryLight: '#FBDFD0',
      tertiary: '#2C2C2C',  tertiaryDark: '#000000', tertiaryLight: '#5E5E5E',
      background: '#FBF2E2', surface: '#FBF2E2',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F4E9D2',
      surfaceContainer: '#EBDDC0',
      surfaceContainerHigh: '#E3D2B0',
      surfaceContainerHighest: '#D9C6A0',
      outline: '#84746E', outlineVariant: '#D6C2BB',
      onBackground: '#2C2017', onSurface: '#2C2017', onSurfaceVariant: '#6B5742',
      shadowAlpha: 'rgba(125, 78, 58, 0.10)',
      paperLiftColor: '#E8E3D5',
    },
    dark: {
      primary: '#D49371',  primaryDark: '#A56B4D', primaryLight: '#3A2418',
      secondary: '#E89070', secondaryDark: '#B95A35', secondaryLight: '#3A1F12',
      tertiary: '#E5DDD2',  tertiaryDark: '#B5ACA0', tertiaryLight: '#3A332B',
      background: '#1A130D', surface: '#1A130D',
      surfaceContainerLowest: '#0F0A07',
      surfaceContainerLow: '#241B12',
      surfaceContainer: '#2E2419',
      surfaceContainerHigh: '#382C1E',
      surfaceContainerHighest: '#4A3D2D',
      outline: '#A0866A', outlineVariant: '#4A3D2D',
      onBackground: '#F2E6D2', onSurface: '#F2E6D2', onSurfaceVariant: '#B5A78F',
      shadowAlpha: 'rgba(0, 0, 0, 0.5)',
      paperLiftColor: '#0F0A07',
    },
  },

  // 2. Emerald — vivid greens with teal & sky highlights
  emerald: {
    id: 'emerald', label: 'Emerald', emoji: '💚',
    light: {
      primary: '#16A34A',  primaryDark: '#0F7A37', primaryLight: '#DCFCE7',
      secondary: '#0D9488', secondaryDark: '#0B7A70', secondaryLight: '#CFFAF4',
      tertiary: '#2563EB',  tertiaryDark: '#1E4FBF', tertiaryLight: '#DBE9FF',
      background: '#F3FBF6', surface: '#F3FBF6',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#E8F5EC',
      surfaceContainer: '#D6EBDD',
      surfaceContainerHigh: '#C4E0CD',
      surfaceContainerHighest: '#B0D4BC',
      outline: '#5B7A66', outlineVariant: '#CCE3D3',
      onBackground: '#0F2A1A', onSurface: '#0F2A1A', onSurfaceVariant: '#456B55',
      shadowAlpha: 'rgba(22, 163, 74, 0.10)',
      paperLiftColor: '#C4E0CD',
    },
    dark: {
      primary: '#2ECC71',  primaryDark: '#22A65C', primaryLight: '#0E2A19',
      secondary: '#1ABC9C', secondaryDark: '#129580', secondaryLight: '#0D2724',
      tertiary: '#3498DB',  tertiaryDark: '#2674B0', tertiaryLight: '#0F2434',
      background: '#0E150F', surface: '#0E150F',
      surfaceContainerLowest: '#070A07',
      surfaceContainerLow: '#16201A',
      surfaceContainer: '#1E2A22',
      surfaceContainerHigh: '#243126',
      surfaceContainerHighest: '#32413A',
      outline: '#7A9988', outlineVariant: '#32413A',
      onBackground: '#E4F2EA', onSurface: '#E4F2EA', onSurfaceVariant: '#94B5A0',
      shadowAlpha: 'rgba(0, 0, 0, 0.5)',
      paperLiftColor: '#070A07',
    },
  },

  // 3. Vivid — purple / pink / blue accent
  vivid: {
    id: 'vivid', label: 'Vivid', emoji: '🪻',
    light: {
      primary: '#9333EA',  primaryDark: '#7022B5', primaryLight: '#F2E5FE',
      secondary: '#DB2777', secondaryDark: '#A21D5C', secondaryLight: '#FCE2EE',
      tertiary: '#2563EB',  tertiaryDark: '#1E4FBF', tertiaryLight: '#DBE9FF',
      background: '#FBF6FF', surface: '#FBF6FF',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F3E8FB',
      surfaceContainer: '#EAD8F6',
      surfaceContainerHigh: '#E1CCF1',
      surfaceContainerHighest: '#D6BFEC',
      outline: '#7A5A92', outlineVariant: '#E1CCF1',
      onBackground: '#2A0F3D', onSurface: '#2A0F3D', onSurfaceVariant: '#6B4585',
      shadowAlpha: 'rgba(147, 51, 234, 0.10)',
      paperLiftColor: '#E1CCF1',
    },
    dark: {
      primary: '#A855F7',  primaryDark: '#8B2FDB', primaryLight: '#26143C',
      secondary: '#EC4899', secondaryDark: '#C7327F', secondaryLight: '#3A1326',
      tertiary: '#3B82F6',  tertiaryDark: '#2A66D0', tertiaryLight: '#0F1F3A',
      background: '#0F172A', surface: '#0F172A',
      surfaceContainerLowest: '#0A0E1A',
      surfaceContainerLow: '#1A2238',
      surfaceContainer: '#212B45',
      surfaceContainerHigh: '#2A3450',
      surfaceContainerHighest: '#384567',
      outline: '#9A7AAE', outlineVariant: '#384567',
      onBackground: '#EDE3F8', onSurface: '#EDE3F8', onSurfaceVariant: '#B59AC7',
      shadowAlpha: 'rgba(0, 0, 0, 0.5)',
      paperLiftColor: '#0A0E1A',
    },
  },

  // 4. Cyber — neon cyan over dark indigo
  cyber: {
    id: 'cyber', label: 'Cyber', emoji: '⚡',
    light: {
      primary: '#0891B2',  primaryDark: '#066E8B', primaryLight: '#CFFAFE',
      secondary: '#14B8A6', secondaryDark: '#0F8C80', secondaryLight: '#CFFAF4',
      tertiary: '#1E293B',  tertiaryDark: '#0F1F3A', tertiaryLight: '#E2E8F0',
      background: '#F2FAFC', surface: '#F2FAFC',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#E2F1F5',
      surfaceContainer: '#CCE5EB',
      surfaceContainerHigh: '#B8D8E0',
      surfaceContainerHighest: '#A4CBD3',
      outline: '#5C7986', outlineVariant: '#C5DDE3',
      onBackground: '#0F1F2A', onSurface: '#0F1F2A', onSurfaceVariant: '#476778',
      shadowAlpha: 'rgba(8, 145, 178, 0.10)',
      paperLiftColor: '#B8D8E0',
    },
    dark: {
      primary: '#00E5FF',  primaryDark: '#00B5CC', primaryLight: '#0F2A33',
      secondary: '#2DD4BF', secondaryDark: '#22A99B', secondaryLight: '#0F2A28',
      tertiary: '#94A3B8',  tertiaryDark: '#6B7B92', tertiaryLight: '#1B2533',
      background: '#0F172A', surface: '#0F172A',
      surfaceContainerLowest: '#0A0E1A',
      surfaceContainerLow: '#172033',
      surfaceContainer: '#1F2A40',
      surfaceContainerHigh: '#293650',
      surfaceContainerHighest: '#384568',
      outline: '#7C97A6', outlineVariant: '#384568',
      onBackground: '#E1F0F7', onSurface: '#E1F0F7', onSurfaceVariant: '#94B0BD',
      shadowAlpha: 'rgba(0, 0, 0, 0.5)',
      paperLiftColor: '#0A0E1A',
    },
  },

  // 5. Sunset — warm orange / amber
  sunset: {
    id: 'sunset', label: 'Sunset', emoji: '🌅',
    light: {
      primary: '#F97316',  primaryDark: '#C2580B', primaryLight: '#FFE5D0',
      secondary: '#EF4444', secondaryDark: '#B91C1C', secondaryLight: '#FEE2E2',
      tertiary: '#FBBF24',  tertiaryDark: '#D89713', tertiaryLight: '#FEF3C7',
      background: '#FFF7EC', surface: '#FFF7EC',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#FFEAD2',
      surfaceContainer: '#FFD8B5',
      surfaceContainerHigh: '#F5CDA3',
      surfaceContainerHighest: '#EBBE8E',
      outline: '#8A6A4D', outlineVariant: '#F5CDA3',
      onBackground: '#3D1A07', onSurface: '#3D1A07', onSurfaceVariant: '#7A4520',
      shadowAlpha: 'rgba(249, 115, 22, 0.10)',
      paperLiftColor: '#F5CDA3',
    },
    dark: {
      primary: '#FB923C',  primaryDark: '#F97316', primaryLight: '#3A1F0E',
      secondary: '#F87171', secondaryDark: '#EF4444', secondaryLight: '#3A1416',
      tertiary: '#FBBF24',  tertiaryDark: '#D89713', tertiaryLight: '#332512',
      background: '#1A1310', surface: '#1A1310',
      surfaceContainerLowest: '#0F0908',
      surfaceContainerLow: '#241B17',
      surfaceContainer: '#2E251F',
      surfaceContainerHigh: '#3A2E25',
      surfaceContainerHighest: '#4D3E33',
      outline: '#A8825E', outlineVariant: '#4D3E33',
      onBackground: '#F8E8D5', onSurface: '#F8E8D5', onSurfaceVariant: '#C9AB89',
      shadowAlpha: 'rgba(0, 0, 0, 0.5)',
      paperLiftColor: '#0F0908',
    },
  },
}

// ─── Token expansion ─────────────────────────────────────────
// Derive the full Material-3 token set used across the codebase
// from the 9 brand colors + neutral mode base.

function expandTokens(theme, mode) {
  const base = mode === 'light' ? lightBase : darkBase
  const m = { ...base, ...theme[mode] }
  const semantic = sharedSemantic(mode)
  const isLight = mode === 'light'

  return {
    // ── neutral / surface ─────────────────────
    background: m.background,
    onBackground: m.onBackground,
    surface: m.surface,
    onSurface: m.onSurface,
    onSurfaceVariant: m.onSurfaceVariant,
    surfaceDim: m.surfaceDim,
    surfaceBright: m.surfaceBright,
    surfaceContainerLowest: m.surfaceContainerLowest,
    surfaceContainerLow: m.surfaceContainerLow,
    surfaceContainer: m.surfaceContainer,
    surfaceContainerHigh: m.surfaceContainerHigh,
    surfaceContainerHighest: m.surfaceContainerHighest,
    surfaceVariant: m.surfaceContainerHighest,
    surfaceTint: m.primary,
    outline: m.outline,
    outlineVariant: m.outlineVariant,
    inverseSurface: m.inverseSurface,
    inverseOnSurface: m.inverseOnSurface,

    // ── primary ───────────────────────────────
    primary: m.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: isLight ? m.primaryDark : m.primaryLight,
    onPrimaryContainer: isLight ? '#FFFFFF' : m.primary,
    primaryFixed: m.primaryLight,
    primaryFixedDim: isLight ? m.primary : m.primaryDark,
    onPrimaryFixed: m.primaryDark,
    onPrimaryFixedVariant: isLight ? m.primaryDark : m.primary,
    inversePrimary: isLight ? m.primaryDark : m.primaryLight,

    // ── secondary ─────────────────────────────
    secondary: m.secondary,
    onSecondary: '#FFFFFF',
    secondaryContainer: isLight ? m.secondaryDark : m.secondaryLight,
    onSecondaryContainer: isLight ? '#FFFFFF' : m.secondary,
    secondaryFixed: m.secondaryLight,
    secondaryFixedDim: isLight ? m.secondary : m.secondaryDark,
    onSecondaryFixed: m.secondaryDark,
    onSecondaryFixedVariant: isLight ? m.secondaryDark : m.secondary,

    // ── tertiary ──────────────────────────────
    tertiary: m.tertiary,
    onTertiary: '#FFFFFF',
    tertiaryContainer: isLight ? m.tertiaryDark : m.tertiaryLight,
    onTertiaryContainer: isLight ? '#FFFFFF' : m.tertiary,
    tertiaryFixed: m.tertiaryLight,
    tertiaryFixedDim: isLight ? m.tertiary : m.tertiaryDark,
    onTertiaryFixed: m.tertiaryDark,
    onTertiaryFixedVariant: isLight ? m.tertiaryDark : m.tertiary,

    // ── error ─────────────────────────────────
    ...semantic,

    // ── utility ───────────────────────────────
    shadowAlpha: m.shadowAlpha,
    paperLiftColor: m.paperLiftColor,
  }
}

// ─── Public API ──────────────────────────────────────────────

export const THEMES = Object.fromEntries(
  Object.entries(COLORS).map(([id, c]) => [
    id,
    {
      id,
      label: c.label,
      emoji: c.emoji,
      light: expandTokens(c, 'light'),
      dark: expandTokens(c, 'dark'),
      raw: c, // keep originals for swatch UI
    },
  ]),
)

export const THEME_IDS = Object.keys(THEMES)

// CamelCase → kebab-case for CSS variable names
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

// Apply a resolved theme to document.documentElement as CSS variables.
// Matches the variable names declared in web/src/index.css @theme block.
export function applyTheme(themeId, mode) {
  if (typeof document === 'undefined') return
  const theme = THEMES[themeId] ?? THEMES.terracotta
  const tokens = theme[mode] ?? theme.light
  const root = document.documentElement
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty(`--color-${kebab(k)}`, v)
  }
  root.dataset.theme = themeId
  root.dataset.mode = mode
}
