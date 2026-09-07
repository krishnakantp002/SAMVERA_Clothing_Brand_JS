'use client';

import * as React from 'react';
import { Search, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Orders</h1>
          <p className="mt-1 text-surface-400">Manage customer orders and fulfillments.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-surface-800 bg-surface-900/50">
        <div className="flex items-center justify-between border-b border-surface-800 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-9 pr-4 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
            <thead className="border-b border-surface-800 bg-surface-900/80 text-xs uppercase text-surface-400">
              <tr>
                <th className="py-4 pl-6 pr-4 font-semibold">Order ID</th>
                <th className="py-4 px-4 font-semibold">Date</th>
                <th className="py-4 px-4 font-semibold">Customer</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Total</th>
                <th className="py-4 pr-6 pl-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-700 border-t-brand-500"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-surface-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-800/30 transition-colors">
                    <td className="py-4 pl-6 pr-4 font-mono text-white">{order.orderNumber}</td>
                    <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      {order.user?.firstName} {order.user?.lastName}
                      <div className="text-xs text-surface-500">{order.user?.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                        order.status === 'PROCESSING' ? 'bg-brand-500/10 text-brand-400' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right">
                      <button className="rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
