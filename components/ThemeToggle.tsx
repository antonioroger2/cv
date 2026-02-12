'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  if (typeof window !== 'undefined' && !mounted) {
    // This runs during rendering (not in an effect) so it's safe
    // We use a state initializer trick: on first client render, set mounted
    Promise.resolve().then(() => setMounted(true));
  }
  return mounted;
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="w-[124px] h-10 rounded-xl bg-bg-secondary/50 animate-pulse" />
    );
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <div className="relative flex items-center p-1 rounded-xl bg-bg-tertiary/40 backdrop-blur-md border border-white/5 shadow-inner">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center
              w-9 h-8 rounded-lg transition-colors duration-200
              ${isActive ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}
            `}
          >
            {/* Animated Background Pill */}
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <Icon size={16} className="relative z-10" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}