import { useEffect, useState } from 'react';

export interface AccessibilitySettings {
  fontSize: 0 | 1 | 2; // 0 = normal, 1 = large, 2 = x-large
  highContrast: boolean;
  reduceTransparency: boolean;
}

const STORAGE_KEY = 'a11y';
const FONT_SIZES = ['100%', '112.5%', '125%'] as const;

function getInitial(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { fontSize: 0, highContrast: false, reduceTransparency: false };
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(getInitial);

  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = FONT_SIZES[settings.fontSize];

    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);

    // Reduce transparency
    root.classList.toggle('reduce-transparency', settings.reduceTransparency);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setFontSize = (size: 0 | 1 | 2) =>
    setSettings(prev => ({ ...prev, fontSize: size }));

  const toggleHighContrast = () =>
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));

  const toggleReduceTransparency = () =>
    setSettings(prev => ({ ...prev, reduceTransparency: !prev.reduceTransparency }));

  return { settings, setFontSize, toggleHighContrast, toggleReduceTransparency };
}
