'use client';

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider(props: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cw-theme');
    const prefersDark = saved === 'dark';
    setIsDark(prefersDark);
    
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    setTimeout(() => {
      document.body.classList.add('theme-ready');
    }, 50);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newState = !prev;
      localStorage.setItem('cw-theme', newState ? 'dark' : 'light');
      
      if (newState) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      return newState;
    });
  };

  const value = { isDark, toggleTheme };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    props.children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
