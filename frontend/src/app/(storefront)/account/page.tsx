'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !user) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !user) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-black"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-surface-200 pb-4">
          <div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl">My Account</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500">Welcome back, {user.firstName}!</p>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 border border-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col space-y-4">
              <Link href="/account" className="flex items-center gap-3 border border-black bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 border border-surface-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-surface-500 hover:border-black hover:text-black transition-colors">
                <Package className="h-4 w-4" /> My Orders
              </Link>
              <Link href="/account/addresses" className="flex items-center gap-3 border border-surface-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-surface-500 hover:border-black hover:text-black transition-colors">
                <MapPin className="h-4 w-4" /> Saved Addresses
              </Link>
            </nav>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-3">
            <div className="border border-surface-200 p-6 sm:p-8">
              <h2 className="mb-8 text-xl font-black uppercase tracking-wider text-black">Personal Information</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">First Name</label>
                  <p className="mt-2 font-bold uppercase tracking-wide text-black">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Last Name</label>
                  <p className="mt-2 font-bold uppercase tracking-wide text-black">{user.lastName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Email Address</label>
                  <p className="mt-2 font-bold uppercase tracking-wide text-black">{user.email}</p>
                </div>
              </div>

              <div className="mt-12 border-t border-surface-200 pt-8">
                <button className="border border-surface-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:border-black transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
