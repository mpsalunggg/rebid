export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  mutedForeground: string;
  border: string;
  inputBackground: string;
  destructive: string;
};

const light: ThemeColors = {
  background: '#F8F8F8',
  foreground: '#2E2E2E',
  card: '#F8F8F8',
  cardForeground: '#2E2E2E',
  primary: '#10b981',
  primaryForeground: '#fafafa',
  mutedForeground: '#737373',
  border: '#E5E7EB',
  inputBackground: '#ffffff',
  destructive: '#dc2626',
};

const dark: ThemeColors = {
  background: '#171717',
  foreground: '#fafafa',
  card: '#1f1f1f',
  cardForeground: '#fafafa',
  primary: '#34d399',
  primaryForeground: '#fafafa',
  mutedForeground: '#a3a3a3',
  border: '#404040',
  inputBackground: '#262626',
  destructive: '#f87171',
};

export function getColors(
  scheme: 'light' | 'dark' | null | undefined | 'unspecified',
): ThemeColors {
  if (scheme === 'dark') {
    return dark;
  }
  return light;
}
