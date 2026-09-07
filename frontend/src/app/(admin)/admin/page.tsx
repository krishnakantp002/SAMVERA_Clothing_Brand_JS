'use client';

import * as React from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', icon: IndianRupee },
    { label: 'Total Orders', value: '156', change: '+8.2%', icon: ShoppingBag },
    { label: 'Total Customers', value: '89', change: '+5.4%', icon: Users },
    { label: 'Conversion Rate', value: '3.2%', change: '+1.1%', icon: TrendingUp },
  ];

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
              <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
              <span className="text-sm font-medium text-success">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <div className="col-span-1 rounded-3xl border border-surface-800 bg-surface-900/50 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <button className="text-sm font-medium text-brand-400 hover:text-brand-300">View All</button>
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
                {[
                  { id: 'ORD-170425-102', customer: 'Rahul Sharma', status: 'PROCESSING', amount: '₹1,598' },
                  { id: 'ORD-170425-089', customer: 'Aditi Verma', status: 'SHIPPED', amount: '₹999' },
                  { id: 'ORD-170424-045', customer: 'Karan Singh', status: 'DELIVERED', amount: '₹2,499' },
                  { id: 'ORD-170424-012', customer: 'Neha Gupta', status: 'PENDING', amount: '₹799' },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="py-4 pr-4 font-mono text-white">{order.id}</td>
                    <td className="py-4 px-4">{order.customer}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                        order.status === 'PROCESSING' ? 'bg-brand-500/10 text-brand-400' :
                        order.status === 'SHIPPED' ? 'bg-info/10 text-info' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">Top Products</h2>
          <div className="space-y-6">
            {[
              { name: 'Essential Premium Tee', sales: 124, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80' },
              { name: 'Oversized Streetwear', sales: 98, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&q=80' },
              { name: 'Heavyweight Hoodie', sales: 76, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80' },
            ].map((product) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-800">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-surface-400">{product.sales} sales this week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
