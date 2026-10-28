'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ThemeToggle } from './theme-toggle';

// Hydration-safe cart count component
function CartCountBadge() {
  const [mounted, setMounted] = React.useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || itemCount === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white transition-transform group-hover:scale-110">
      {itemCount}
    </span>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-black py-2 text-center text-xs font-medium tracking-widest text-white uppercase sm:text-sm">
      Free Shipping on orders above ₹999
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 w-full bg-white border-b',
          isScrolled ? 'py-3 border-surface-200 shadow-sm' : 'py-4 border-transparent'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Toggle (Left on Mobile) */}
          <div className="flex flex-1 items-center md:hidden">
            <button
              className="text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Nav (Left on Desktop) */}
          <nav className="hidden flex-1 items-center gap-8 md:flex">
            {siteConfig.nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-semibold tracking-wide uppercase transition-colors hover:text-black',
                  pathname === item.href ? 'text-black' : 'text-surface-500'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo (Centered) */}
          <Link href="/" className="flex flex-1 justify-center relative z-10 items-center gap-2">
            <span className="font-display text-2xl font-black tracking-tighter text-black sm:text-3xl uppercase">
              SAMVERA
            </span>
          </Link>

          {/* Actions (Right) */}
          <div className="relative z-10 flex flex-1 items-center justify-end gap-5">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                if (q) window.location.href = `/shop?q=${q}`;
              }}
              className="hidden sm:flex items-center"
            >
              <div className="relative flex items-center group">
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search..." 
                  className="w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 group-hover:px-3 focus:w-48 focus:opacity-100 focus:px-3 transition-all duration-300 border-b border-black outline-none text-xs uppercase tracking-widest bg-transparent py-1"
                />
                <button type="submit" className="text-black hover:text-surface-600 p-1">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <Link href="/wishlist" className="text-black transition-colors hover:text-surface-600 hidden sm:block relative">
              <Heart className="h-5 w-5" />
            </Link>
            
            <ThemeToggle />

            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="hidden text-black transition-colors hover:text-surface-600 sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
            
            <button 
              className="group relative text-black transition-colors hover:text-surface-600"
              onClick={() => useCartStore.getState().setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              <CartCountBadge />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-surface-200 bg-white md:hidden"
            >
              <div className="flex flex-col space-y-4 px-4 py-6">
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.currentTarget).get('q');
                    if (q) window.location.href = `/shop?q=${q}`;
                  }}
                  className="mb-4 flex items-center border border-surface-200 px-3 py-2"
                >
                  <Search className="h-4 w-4 text-surface-400" />
                  <input 
                    type="text" 
                    name="q"
                    placeholder="Search..." 
                    className="ml-2 flex-1 bg-transparent text-xs font-bold uppercase tracking-widest outline-none"
                  />
                </form>

                {siteConfig.nav.main.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-bold uppercase tracking-widest text-black transition-colors hover:text-surface-600"
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="my-2 h-px w-full bg-surface-100" />
                <div className="flex justify-center gap-8">
                  <Link href="/wishlist" className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest text-surface-600">
                    <Heart className="h-6 w-6" />
                    Wishlist
                  </Link>
                  <Link href={isAuthenticated ? "/account" : "/login"} className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-widest text-surface-600">
                    <User className="h-6 w-6" />
                    Account
                  </Link>
                  <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-surface-600">
                    <ThemeToggle />
                    Theme
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
