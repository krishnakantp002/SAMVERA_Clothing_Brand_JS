'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PackageSearch, LayoutDashboard, ShoppingCart, Users, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    } else if (!user.roles?.includes('ADMIN')) {
      router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  if (!user || !user.roles?.includes('ADMIN')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-800 border-t-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-surface-800 bg-surface-900/50 backdrop-blur-md z-50">
        <div className="flex h-16 items-center px-6">
          <Link href="/admin" className="font-display text-xl font-bold tracking-widest text-white">
            SAMVERA <span className="text-brand-400">ADMIN</span>
          </Link>
        </div>
        
        <nav className="mt-8 space-y-2 px-4">
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
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}
