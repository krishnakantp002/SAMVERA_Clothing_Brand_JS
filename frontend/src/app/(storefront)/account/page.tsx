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

  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">My Account</h1>
            <p className="mt-1 text-surface-400">Welcome back, {user.firstName}!</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col space-y-2 rounded-3xl border border-surface-800 bg-surface-900/50 p-4">
              <Link href="/account" className="flex items-center gap-3 rounded-xl bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-400">
                <User className="h-5 w-5" /> Profile
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                <Package className="h-5 w-5" /> My Orders
              </Link>
              <Link href="/account/addresses" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                <MapPin className="h-5 w-5" /> Saved Addresses
              </Link>
            </nav>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-white">Personal Information</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-surface-500">First Name</label>
                  <p className="mt-1 font-medium text-white">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-surface-500">Last Name</label>
                  <p className="mt-1 font-medium text-white">{user.lastName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-surface-500">Email Address</label>
                  <p className="mt-1 font-medium text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-surface-500">Account Role</label>
                  <p className="mt-1 font-medium text-white capitalize">{user.roles?.join(', ')}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-surface-800 pt-8">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
