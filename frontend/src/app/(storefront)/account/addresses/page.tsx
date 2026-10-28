'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, Plus, Trash2, Edit2 } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';

export default function AddressesPage() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-surface-200 pb-4">
          <div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl">Saved Addresses</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500">Manage your shipping and billing addresses.</p>
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
              <Link href="/account" className="flex items-center gap-3 border border-surface-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-surface-500 hover:border-black hover:text-black transition-colors">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 border border-surface-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-surface-500 hover:border-black hover:text-black transition-colors">
                <Package className="h-4 w-4" /> My Orders
              </Link>
              <Link href="/account/addresses" className="flex items-center gap-3 border border-black bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white">
                <MapPin className="h-4 w-4" /> Saved Addresses
              </Link>
            </nav>
          </div>

          {/* Addresses */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <div className="flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-surface-200 p-8 hover:border-black transition-colors">
                <Plus className="mb-4 h-8 w-8 text-surface-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-black">Add New Address</span>
              </div>

              <div className="relative flex flex-col border border-black p-6">
                <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase tracking-widest text-brand-500">Default Shipping</span>
                <div className="flex-1">
                  <h3 className="mb-2 font-bold uppercase tracking-wide text-black">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm font-medium leading-relaxed tracking-wide text-surface-600">
                    Naga road ward no 23<br />
                    near Shankar thakur<br />
                    Raxaul, Bihar 845305<br />
                    India
                  </p>
                  <p className="mt-4 text-sm font-medium tracking-wide text-surface-600">Phone: +91 8227929861</p>
                </div>
                <div className="mt-6 flex items-center gap-4 border-t border-surface-200 pt-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-brand-500">
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-error hover:text-error/80">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
