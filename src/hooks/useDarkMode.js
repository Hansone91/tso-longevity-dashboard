import { useState, useEffect, useCallback } from 'react';

export function useDarkMode() {
  const [dark, setDarkState] = useState(() => {
    try {
      const saved = localStorage.getItem('longevity-dark');
      return saved === 'true';
    } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('longevity-dark', String(dark));
  }, [dark]);

  const setDark = useCallback((value) => {
    // Add transition class for smooth animation
    document.documentElement.classList.add('transition-colors-global');
    setDarkState(value);
    // Remove after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transition-colors-global');
    }, 350);
  }, []);

  return [dark, setDark];
}
