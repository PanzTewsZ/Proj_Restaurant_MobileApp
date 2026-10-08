import { createContext, useContext, useMemo, useState } from 'react';
import { getColors } from '../constants/colors';
import { createStyles } from '../constants/styles';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const value = useMemo(() => {
    const colors = getColors(isDark);
    return { isDark, setIsDark, colors, styles: createStyles(colors) };
  }, [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside ThemeProvider');
  return theme;
}
