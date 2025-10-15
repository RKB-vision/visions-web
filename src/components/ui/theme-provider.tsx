'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemePrefs = {
  mode: 'light' | 'dark';
  highContrast: boolean;
  largeFont: boolean;
  readerMode: boolean;
  reduceMotion: boolean;
  setMode: (m: 'light' | 'dark') => void;
  toggleHighContrast: () => void;
  toggleLargeFont: () => void;
  toggleReaderMode: () => void;
  toggleReduceMotion: () => void;
};

const ThemeContext = createContext<ThemePrefs | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // initialize from localStorage + system preferences
  useEffect(() => {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setMode((localStorage.getItem('pref_mode') as 'light' | 'dark') ?? (prefersDark ? 'dark' : 'light'));
    setHighContrast(localStorage.getItem('pref_highContrast') === 'true');
    setLargeFont(localStorage.getItem('pref_largeFont') === 'true');
    setReaderMode(localStorage.getItem('pref_readerMode') === 'true');
    setReduceMotion((localStorage.getItem('pref_reduceMotion') ?? (prefersReduced ? 'true' : 'false')) === 'true');
  }, []);

  // write to DOM attributes and localStorage
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', mode);
    html.setAttribute('data-high-contrast', String(highContrast));
    html.setAttribute('data-large-font', String(largeFont));
    html.setAttribute('data-reader-mode', String(readerMode));
    html.setAttribute('data-reduced-motion', String(reduceMotion));

    localStorage.setItem('pref_mode', mode);
    localStorage.setItem('pref_highContrast', String(highContrast));
    localStorage.setItem('pref_largeFont', String(largeFont));
    localStorage.setItem('pref_readerMode', String(readerMode));
    localStorage.setItem('pref_reduceMotion', String(reduceMotion));
  }, [mode, highContrast, largeFont, readerMode, reduceMotion]);

  const value = useMemo<ThemePrefs>(() => ({
    mode,
    highContrast,
    largeFont,
    readerMode,
    reduceMotion,
    setMode,
    toggleHighContrast: () => setHighContrast(v => !v),
    toggleLargeFont: () => setLargeFont(v => !v),
    toggleReaderMode: () => setReaderMode(v => !v),
    toggleReduceMotion: () => setReduceMotion(v => !v),
  }), [mode, highContrast, largeFont, readerMode, reduceMotion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePrefs() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePrefs must be used within ThemeProvider');
  return ctx;
}