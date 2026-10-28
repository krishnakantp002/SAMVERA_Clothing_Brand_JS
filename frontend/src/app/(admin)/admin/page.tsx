'use client';

import * as React from 'react';
import Link from 'next/link';
import { IndianRupee, ShoppingBag, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string } | null;
}

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  unitsSold: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [topProducts, setTopProducts] = React.useState<TopProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingTop, setLoadingTop] = React.useState(true);

  React.useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data?.data || []))
      .catch((error) => console.error('Failed to fetch orders:', error))
      .finally(() => setLoading(false));
    api
      .get('/stats/top-products')
      .then((res) => setTopProducts(res.data?.data || []))
      .catch((error) => console.error('Failed to fetch top products:', error))
      .finally(() => setLoadingTop(false));
  }, []);

  const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.user?.email).filter(Boolean)).size;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: `${activeOrders.length} paid orders`,
      icon: IndianRupee,
    },
    { label: 'Total Orders', value: String(totalOrders), change: 'All time', icon: ShoppingBag },
    { label: 'Total Customers', value: String(totalCustomers), change: 'With orders', icon: Users },
    { label: 'Pending Orders', value: String(pendingOrders), change: 'Needs action', icon: Clock },
  ];

  const statusColor = (status: string) =>
    status === 'DELIVERED'
      ? 'bg-success/10 text-success'
      : status === 'PROCESSING'
        ? 'bg-brand-500/10 text-brand-400'
        : status === 'SHIPPED'
          ? 'bg-info/10 text-info'
          : status === 'CANCELLED'
            ? 'bg-error/10 text-error'
            : 'bg-warning/10 text-warning';

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-1 text-surface-400">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-surface-800 bg-surface-900/50 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-surface-400">{stat.label}</p>
              <div className="rounded-lg bg-brand-500/10 p-2 text-brand-400">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-white">{loading ? '—' : stat.value}</h2>
              <span className="text-sm font-medium text-surface-500">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="col-span-1 rounded-3xl border border-surface-800 bg-surface-900/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-brand-400 hover:text-brand-300">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-surface-300">
              <thead className="border-b border-surface-800 text-xs uppercase text-surface-400">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="h-10 pr-4">
                        <div className="h-3 w-3/4 rounded bg-surface-800" />
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-surface-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-surface-800/50 transition-colors">
                      <td className="py-4 pr-4 font-mono text-white">{order.orderNumber}</td>
                      <td className="py-4 px-4">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold tracking-wider ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-white">{formatPrice(Number(order.total))}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Top Products</h2>
          <div className="space-y-6">
            {loadingTop ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-surface-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-surface-800" />
                    <div className="h-2 w-1/2 rounded bg-surface-800" />
                  </div>
                </div>
              ))
            ) : topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-surface-500">No sales data yet.</p>
            ) : (
              topProducts.map((product) => (
                <Link key={product.id} href={`/admin/products`} className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-800">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg">👕</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-surface-400">{product.unitsSold} units sold</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
