'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlistStore';
import * as React from 'react';

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { hasItem, addItem, removeItem } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? hasItem(product.id) : false;

  // Helper to get the primary image or a fallback
  // API list endpoints return a flat `primaryImage` string instead of the `images` array
  const imageFromArray = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
  const altText = product.images?.find((img) => img.isPrimary)?.altText;
  const imageUrl = product.primaryImage || imageFromArray || '/images/placeholder.webp';

  const discount = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? Math.round(((Number(product.compareAtPrice) - Number(product.basePrice)) / Number(product.compareAtPrice)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-surface-100">
        {imageUrl.includes('placeholder') ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
            <span className="text-4xl">👕</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={altText || product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isWishlisted) {
              removeItem(product.id);
            } else {
              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.basePrice),
                image: imageUrl
              });
            }
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-black' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-2 transition-transform duration-300 group-hover:translate-y-0 sm:p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push(`/products/${product.slug}`);
            }}
            className="w-full bg-white py-3 text-xs font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-black hover:text-white"
          >
            Quick Add
          </button>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1 px-1">
        {product.category && (
          <Link href={`/shop?category=${product.category.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-surface-500 hover:text-black">
            {product.category.name}
          </Link>
        )}
        
        <Link href={`/products/${product.slug}`} className="text-sm font-semibold leading-tight text-black line-clamp-1 hover:underline">
          {product.name}
        </Link>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-black">{formatPrice(Number(product.basePrice))}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-surface-500 line-through">
              {formatPrice(Number(product.compareAtPrice))}
            </span>
          )}
        </div>

        {/* Reviews */}
        {product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!)
                      ? 'fill-black text-black'
                      : 'fill-surface-200 text-surface-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-surface-500">({product.reviewCount})</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
