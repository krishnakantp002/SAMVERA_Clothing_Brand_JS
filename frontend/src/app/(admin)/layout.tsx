'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageSearch, LayoutDashboard, ShoppingCart, Users, Settings, LogOut, LayoutTemplate, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !user) {
      router.push('/login');
    } else if (!user.roles?.includes('ADMIN')) {
      router.push('/account');
    }
  }, [mounted, isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout API failed', e);
    }
    logout();
    router.push('/login');
  };

  if (!mounted || !user || !user.roles?.includes('ADMIN')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 flex flex-col border-r border-surface-800 bg-surface-900/50 backdrop-blur-md z-50">
        <div className="flex h-16 items-center px-6 shrink-0">
          <Link href="/admin" className="font-display text-xl font-bold tracking-widest text-white">
            SAMVERA <span className="text-brand-400">ADMIN</span>
          </Link>
        </div>
        
        <nav className="mt-8 space-y-2 px-4 flex-1">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-400">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <PackageSearch className="h-5 w-5" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <ShoppingCart className="h-5 w-5" /> Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" /> Customers
          </Link>
          <Link href="/admin/storefront" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <LayoutTemplate className="h-5 w-5" /> Storefront
          </Link>
          <Link href="/admin/qa" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <HelpCircle className="h-5 w-5" /> Q & A
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 shrink-0 border-t border-surface-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}
