'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '@/lib/api';
import { ProductCardData } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  
  const [products, setProducts] = React.useState<ProductCardData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (category) params.append('category', category);
        
        const response = await api.get(`/products?${params.toString()}`);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filter, category]);

  let pageTitle = 'All Collection';
  if (filter === 'new-arrivals') pageTitle = 'New Arrivals';
  if (filter === 'best-sellers') pageTitle = 'Best Sellers';
  if (category) pageTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-bold text-white md:text-5xl"
            >
              {pageTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-surface-400"
            >
              {products.length} products found
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="hidden md:flex"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
            <div className="relative">
              <Button variant="outline" className="min-w-[160px] justify-between">
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex items-start gap-8">
          {/* Desktop Sidebar Filters */}
          <AnimatePresence initial={false}>
            {isFilterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden shrink-0 overflow-hidden md:block"
              >
                <div className="space-y-6 pr-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Category</h3>
                    <div className="mt-4 space-y-3">
                      {[
                        { name: 'All Products', slug: '' },
                        { name: 'T-Shirts', slug: 't-shirts' }, 
                        { name: 'Oversized', slug: 'oversized-t-shirts' }, 
                        { name: 'Hoodies', slug: 'hoodies' }
                      ].map(cat => (
                        <Link 
                          href={cat.slug ? `/shop?category=${cat.slug}` : '/shop'} 
                          key={cat.name} 
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <div className={`flex h-5 w-5 items-center justify-center rounded border ${category === cat.slug || (!category && !cat.slug) ? 'border-brand-500 bg-brand-500' : 'border-surface-700 bg-surface-900'}`}>
                            {(category === cat.slug || (!category && !cat.slug)) && <div className="h-2 w-2 rounded-sm bg-white" />}
                          </div>
                          <span className={`text-sm transition-colors hover:text-white ${category === cat.slug || (!category && !cat.slug) ? 'text-white font-medium' : 'text-surface-300'}`}>
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Filter */}
                  <div className="border-t border-surface-800/50 pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Price Range</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">₹</span>
                        <input type="number" placeholder="Min" className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-7 pr-3 text-sm text-white focus:border-brand-500 focus:outline-none" />
                      </div>
                      <span className="text-surface-500">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">₹</span>
                        <input type="number" placeholder="Max" className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-7 pr-3 text-sm text-white focus:border-brand-500 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[3/4] rounded-2xl bg-surface-800/50" />
                    <div className="h-4 w-2/3 rounded bg-surface-800/50" />
                    <div className="h-4 w-1/3 rounded bg-surface-800/50" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-surface-800/50 bg-surface-900/30 py-32 text-center">
                <div className="rounded-full bg-surface-800 p-6">
                  <Filter className="h-10 w-10 text-surface-500" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">No products found</h3>
                <p className="mt-2 text-surface-400">Try adjusting your filters or search terms.</p>
                <Button className="mt-6" variant="outline" onClick={() => window.location.href = '/shop'}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
