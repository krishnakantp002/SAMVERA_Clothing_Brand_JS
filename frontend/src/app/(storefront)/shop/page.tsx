'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '@/lib/api';
import { ProductCardData } from '@/types';
import { ProductCard } from '@/components/product/product-card';

function ShopContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  
  const [products, setProducts] = React.useState<ProductCardData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFilterOpen, setIsFilterOpen] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (category) params.append('category', category);
        if (q) params.append('q', q);
        
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
  }, [filter, category, q]);

  let pageTitle = 'All Products';
  if (q) {
    pageTitle = `Search Results for "${q}"`;
  } else if (category) {
    pageTitle = category.charAt(0).toUpperCase() + category.slice(1);
  } else if (filter === 'new-arrivals') {
    pageTitle = 'New Arrivals';
  } else if (filter === 'best-sellers') {
    pageTitle = 'Best Sellers';
  }

  return (
    <main className="min-h-screen bg-white pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-surface-200 pb-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl"
            >
              {pageTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500"
            >
              {isLoading ? 'Loading...' : `${products.length} products`}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="hidden items-center border border-surface-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:bg-surface-100 md:flex"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </button>
            <button className="flex items-center border border-surface-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:bg-surface-100 md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </button>
            <button className="flex items-center border border-surface-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:bg-surface-100">
              Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <div className="mt-8 flex items-start gap-8">
          {/* Desktop Sidebar Filters */}
          <AnimatePresence initial={false}>
            {isFilterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden shrink-0 overflow-hidden md:block"
              >
                <div className="space-y-8 pr-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black">Category</h3>
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
                          <div className={`flex h-4 w-4 items-center justify-center border ${category === cat.slug || (!category && !cat.slug) ? 'border-black bg-black' : 'border-surface-300 bg-white'}`}>
                            {(category === cat.slug || (!category && !cat.slug)) && <div className="h-2 w-2 bg-white" />}
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-black ${category === cat.slug || (!category && !cat.slug) ? 'text-black' : 'text-surface-500'}`}>
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[3/4] bg-surface-100" />
                    <div className="h-4 w-2/3 bg-surface-100" />
                    <div className="h-4 w-1/3 bg-surface-100" />
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
                className="grid grid-cols-2 gap-4 gap-y-10 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
                    }}
                  >
                    <ProductCard product={product as any} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-surface-50 py-32 text-center">
                <Filter className="h-10 w-10 text-surface-300" />
                <h3 className="mt-4 font-display text-xl font-black uppercase tracking-widest text-black">No products found</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-surface-500">Try adjusting your filters.</p>
                <Link href="/shop" className="mt-6 border border-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors">
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </React.Suspense>
  );
}
