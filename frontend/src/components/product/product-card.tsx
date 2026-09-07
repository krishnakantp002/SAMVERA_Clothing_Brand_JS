'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProductCardData } from '@/types';
import { formatPrice, calcDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useWishlistStore } from '@/stores/wishlistStore';

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount = product.compareAtPrice 
    ? calcDiscount(product.basePrice, product.compareAtPrice) 
    : 0;

  const { items, addItem, removeItem, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation();
    
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.basePrice,
        image: product.primaryImage || undefined
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex cursor-pointer flex-col"
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-900">
        {product.primaryImage ? (
          <img
            src={product.primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900 text-6xl opacity-20">
            👕
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-error px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              {discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2 bg-gradient-to-t from-surface-950/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <Button className="w-full text-xs" size="sm" onClick={(e) => { e.preventDefault(); /* Would trigger quick add modal */ }}>
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            className="shrink-0 rounded-xl"
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-error text-error' : ''}`} />
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col space-y-1">
        <Link href={`/category/${product.category.slug}`} className="text-xs font-medium uppercase tracking-wider text-brand-400 hover:text-brand-300">
          {product.category.name}
        </Link>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-surface-200 transition-colors group-hover:text-white">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-surface-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-brand-400 text-brand-400" />
            <span className="text-xs font-medium text-surface-400">
              {product.rating} <span className="text-surface-600">({product.reviewCount})</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
