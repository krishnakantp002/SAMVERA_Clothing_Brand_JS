'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 text-surface-400">
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-surface-200 text-black transition-colors hover:bg-surface-100"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {theme === 'dark' ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            key="moon"
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            key="sun"
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </div>
    </button>
  );
}
