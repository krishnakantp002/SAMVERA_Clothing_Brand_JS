'use client';

import * as React from 'react';
import { Search, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  orders: number;
  spent: number;
}

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const fetchCustomers = React.useCallback(async (pageNum: number, q: string) => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { page: pageNum, limit: PAGE_SIZE, q: q || undefined } });
      setCustomers(res.data?.data || []);
      setTotal(res.data?.meta?.total || 0);
      setTotalPages(res.data?.meta?.totalPages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search (also performs the initial load after mount)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(1, query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, fetchCustomers]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Customers</h1>
          <p className="mt-1 text-surface-400">Manage your store's customers and their data.</p>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search customers by name, email or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-surface-400" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 text-sm text-surface-400">
          <span className="font-semibold text-white">Total Customers:</span> {total}
        </div>
      </div>

      {/* Table */}
      <motion.div
        key={page + query}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                [...Array(PAGE_SIZE)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-4 pl-6 pr-6">
                      <div className="h-3 w-2/3 rounded bg-surface-800" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-surface-500">
                    No customers found{query ? ` for "${query}"` : ''}.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const name = `${customer.firstName} ${customer.lastName}`.trim() || 'Unnamed';
                  return (
                    <tr key={customer.id} className="hover:bg-surface-800/50 transition-colors">
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 font-display font-bold text-brand-400">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{name}</p>
                            <p className="text-xs text-surface-500">
                              Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-surface-500" /> {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3 text-surface-500" /> {customer.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">{customer.orders}</td>
                      <td className="py-4 px-4 font-medium text-white">{formatPrice(customer.spent)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold tracking-wider ${
                            customer.isActive ? 'bg-success/10 text-success' : 'bg-surface-800 text-surface-400'
                          }`}
                        >
                          {customer.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-surface-800 p-4 flex items-center justify-between text-xs text-surface-400">
          <span>
            {total === 0 ? 'No customers' : `Page ${page} of ${totalPages} · ${total} customers`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCustomers(page - 1, query)}
              disabled={loading || page <= 1}
              className="rounded px-2 py-1 hover:bg-surface-800 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded bg-surface-800 px-2 py-1 text-white">{page}</span>
            <button
              onClick={() => fetchCustomers(page + 1, query)}
              disabled={loading || page >= totalPages}
              className="rounded px-2 py-1 hover:bg-surface-800 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
