'use client';

import * as React from 'react';
import { UserPlus, Search, MoreVertical, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomersPage() {
  const customers = [
    { id: 'CUS-1029', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', orders: 12, spent: '₹14,500', status: 'ACTIVE' },
    { id: 'CUS-1028', name: 'Aditi Verma', email: 'aditi.v@example.com', phone: '+91 98765 43211', orders: 5, spent: '₹5,200', status: 'ACTIVE' },
    { id: 'CUS-1027', name: 'Karan Singh', email: 'karan.s@example.com', phone: '+91 98765 43212', orders: 1, spent: '₹1,299', status: 'INACTIVE' },
    { id: 'CUS-1026', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 98765 43213', orders: 3, spent: '₹4,100', status: 'ACTIVE' },
    { id: 'CUS-1025', name: 'Vikram Das', email: 'vikram.d@example.com', phone: '+91 98765 43214', orders: 0, spent: '₹0', status: 'ACTIVE' },
    { id: 'CUS-1024', name: 'Pooja Patel', email: 'pooja.p@example.com', phone: '+91 98765 43215', orders: 8, spent: '₹9,800', status: 'ACTIVE' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Customers</h1>
          <p className="mt-1 text-surface-400">Manage your store's customers and their data.</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Filters/Search */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <Input 
            placeholder="Search customers by name, email or phone..." 
            leftIcon={<Search className="h-4 w-4 text-surface-400" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 text-sm text-surface-400">
          <span className="font-semibold text-white">Total Customers:</span> 89
        </div>
      </div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
            <thead className="border-b border-surface-800 bg-surface-900/80 text-xs uppercase text-surface-400">
              <tr>
                <th className="py-4 pl-6 pr-4 font-semibold">Customer</th>
                <th className="py-4 px-4 font-semibold">Contact Info</th>
                <th className="py-4 px-4 font-semibold text-center">Orders</th>
                <th className="py-4 px-4 font-semibold">Total Spent</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 pr-6 pl-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-surface-800/50 transition-colors">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 font-display font-bold text-brand-400">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{customer.name}</p>
                        <p className="text-xs text-surface-500">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-surface-500" /> {customer.email}
                      </span>
                      <span className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-surface-500" /> {customer.phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-medium">
                    {customer.orders}
                  </td>
                  <td className="py-4 px-4 font-medium text-white">
                    {customer.spent}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold tracking-wider ${
                      customer.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-surface-800 text-surface-400'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 pl-4 text-right">
                    <button className="text-surface-400 hover:text-white transition-colors">
                      <MoreVertical className="h-5 w-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="border-t border-surface-800 p-4 flex items-center justify-between text-xs text-surface-400">
          <span>Showing 1 to 6 of 89 customers</span>
          <div className="flex items-center gap-2">
            <button className="rounded px-2 py-1 hover:bg-surface-800 disabled:opacity-50" disabled>Previous</button>
            <button className="rounded bg-surface-800 px-2 py-1 text-white">1</button>
            <button className="rounded px-2 py-1 hover:bg-surface-800">2</button>
            <button className="rounded px-2 py-1 hover:bg-surface-800">3</button>
            <span>...</span>
            <button className="rounded px-2 py-1 hover:bg-surface-800">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
