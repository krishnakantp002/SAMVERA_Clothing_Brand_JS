'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export default function OrdersPage() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !user) return;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [mounted, user]);

  if (!mounted || !user) return null;

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-surface-200 pb-4">
          <div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl">My Orders</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500">View and track your recent orders.</p>
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
              <Link href="/account/orders" className="flex items-center gap-3 border border-black bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white">
                <Package className="h-4 w-4" /> My Orders
              </Link>
              <Link href="/account/addresses" className="flex items-center gap-3 border border-surface-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-surface-500 hover:border-black hover:text-black transition-colors">
                <MapPin className="h-4 w-4" /> Saved Addresses
              </Link>
            </nav>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center border border-surface-200">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-black"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex h-32 items-center justify-center border border-surface-200 text-xs font-bold uppercase tracking-widest text-surface-500">
                  No orders found.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-surface-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black transition-colors">
                    
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Order Number</p>
                        <p className="mt-1 font-bold uppercase tracking-wide text-black">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Date Placed</p>
                        <p className="mt-1 font-bold uppercase tracking-wide text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Total Amount</p>
                        <p className="mt-1 font-bold uppercase tracking-wide text-black">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Status</p>
                        <span className={`mt-1 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'DELIVERED' ? 'bg-[#e0f5d7] text-[#2b6a12]' :
                          order.status === 'PROCESSING' ? 'bg-[#ffebd1] text-[#b35e00]' :
                          order.status === 'SHIPPED' ? 'bg-[#d1eeff] text-[#0055b3]' :
                          'bg-surface-200 text-surface-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0">
                      <Link 
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-2 border border-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors"
                      >
                        View Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
