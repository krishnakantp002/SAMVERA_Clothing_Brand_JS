'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex items-center justify-between border-b border-surface-200 pb-4">
          <div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl">Wishlist</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500">Your saved items</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center border border-black text-black">
            <Heart className="h-5 w-5 fill-black" />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex h-[40vh] flex-col items-center justify-center border-2 border-dashed border-surface-200 text-center">
            <Heart className="mb-4 h-12 w-12 text-surface-300" />
            <h3 className="mb-2 text-lg font-black uppercase tracking-widest text-black">Your wishlist is empty</h3>
            <p className="mb-6 text-sm text-surface-500">Save items you love and buy them later.</p>
            <Link href="/shop" className="border border-black bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group relative flex flex-col border border-surface-200 bg-white">
                <Link href={`/products/${item.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-surface-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-100 text-surface-400">
                      IMG
                    </div>
                  )}
                </Link>
                
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black line-clamp-1">
                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p className="mt-2 text-sm font-bold text-black">{formatPrice(item.price)}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Link 
                      href={`/products/${item.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-black bg-black py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
                    >
                      View Options
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex h-[38px] w-[38px] items-center justify-center border border-surface-200 text-error hover:border-error transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
