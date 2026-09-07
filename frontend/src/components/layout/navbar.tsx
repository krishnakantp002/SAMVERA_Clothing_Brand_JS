'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

// Hydration-safe cart count component
function CartCountBadge() {
  const [mounted, setMounted] = React.useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || itemCount === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white transition-transform group-hover:scale-110">
      {itemCount}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-surface-950/80 backdrop-blur-md border-b border-surface-800/50 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            SAMVERA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-white',
                pathname === item.href ? 'text-white' : 'text-surface-300'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="relative z-10 flex items-center gap-4">
          <button className="text-surface-300 transition-colors hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className="hidden text-surface-300 transition-colors hover:text-white sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          
          <button
            onClick={() => useCartStore.getState().setIsOpen(true)}
            className="group relative flex items-center text-surface-300 transition-colors hover:text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            <CartCountBadge />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="text-surface-300 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full border-b border-surface-800 bg-surface-950 px-4 py-6 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {siteConfig.nav.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-surface-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-4 h-px w-full bg-surface-800" />
              <Link
                href={isAuthenticated ? "/account" : "/login"}
                className="flex items-center gap-3 text-lg font-medium text-surface-200 transition-colors hover:text-white"
              >
                <User className="h-5 w-5" />
                {isAuthenticated ? "My Account" : "Login / Register"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
