import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('fv-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('fv-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
};
