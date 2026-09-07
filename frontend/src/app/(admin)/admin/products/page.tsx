'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-surface-400">Manage your store's inventory and catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-surface-800 bg-surface-900/50">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-surface-800 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-9 pr-4 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-300">
            <thead className="border-b border-surface-800 bg-surface-900/80 text-xs uppercase text-surface-400">
              <tr>
                <th className="py-4 pl-6 pr-4 font-semibold">Product</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Price</th>
                <th className="py-4 pr-6 pl-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-700 border-t-brand-500"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-surface-400">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-800/30 transition-colors">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-800">
                          {product.primaryImage ? (
                            <img src={product.primaryImage} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center opacity-20">👕</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-surface-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                        product.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-surface-800 text-surface-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {formatPrice(product.basePrice)}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-surface-400 hover:bg-error/10 hover:text-error transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
