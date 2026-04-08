'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="theme-toggle"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={14} />
      ) : (
        <Moon size={14} />
      )}
    </button>
  );
}
