'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, Heart, Star, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '@/lib/api';
import { formatPrice, calcDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    
    // Find the specific variant
    const variant = product.variants.find((v: any) => 
      v.sizeId === selectedSize && v.colorId === selectedColor
    );
    
    if (!variant) {
      alert('This combination is currently out of stock.');
      return;
    }

    const primaryImage = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url;
    
    addItem({
      id: variant.id, // Use variant ID as cart item ID so different sizes/colors stack separately
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      price: Number(variant.price),
      quantity: 1,
      image: primaryImage,
      color: variant.color.name,
      size: variant.size.name
    });
  };

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        if (response.data.success) {
          setProduct(response.data.data);
          // Set defaults
          if (response.data.data.variants?.length > 0) {
            setSelectedSize(response.data.data.variants[0].sizeId);
            setSelectedColor(response.data.data.variants[0].colorId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface-950 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-surface-900" />
            <div className="space-y-6 pt-8">
              <div className="h-8 w-3/4 animate-pulse rounded bg-surface-900" />
              <div className="h-6 w-1/4 animate-pulse rounded bg-surface-900" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-900" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-900" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-900" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-surface-950 text-center">
        <h1 className="font-display text-4xl font-bold text-white">Product Not Found</h1>
        <p className="mt-2 text-surface-400">The product you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-8" onClick={() => window.location.href = '/shop'}>
          Back to Shop
        </Button>
      </main>
    );
  }

  const primaryImage = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url;
  const discount = product.compareAtPrice ? calcDiscount(Number(product.basePrice), Number(product.compareAtPrice)) : 0;

  // Extract unique sizes and colors
  const sizes = Array.from(new Set(product.variants.map((v: any) => JSON.stringify({ id: v.size.id, name: v.size.name })))).map(s => JSON.parse(s as string));
  const colors = Array.from(new Set(product.variants.map((v: any) => JSON.stringify({ id: v.color.id, name: v.color.name, hex: v.color.hexCode })))).map(c => JSON.parse(c as string));

  return (
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Images */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-900"
            >
              {primaryImage ? (
                <img src={primaryImage} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-9xl opacity-10">👕</div>
              )}
              {discount > 0 && (
                <span className="absolute left-6 top-6 rounded-full bg-error px-3 py-1.5 text-sm font-bold text-white">
                  {discount}% OFF
                </span>
              )}
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((img: any, i: number) => (
                <button key={img.id} className="aspect-square overflow-hidden rounded-xl bg-surface-900 ring-2 ring-transparent transition-all focus:outline-none focus:ring-brand-500 hover:opacity-80">
                  <img src={img.url} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4 lg:pt-8">
            <div className="flex items-center gap-2 text-sm text-brand-400">
              <span className="uppercase tracking-widest">{product.category.name}</span>
            </div>
            
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>
            
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-brand-400 text-brand-400' : 'text-surface-700'}`} />
                ))}
              </div>
              <a href="#reviews" className="text-sm font-medium text-surface-400 hover:text-brand-400">
                128 Reviews
              </a>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-white">{formatPrice(Number(product.basePrice))}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-surface-500 line-through">
                  {formatPrice(Number(product.compareAtPrice))}
                </span>
              )}
            </div>

            <p className="mt-6 text-base leading-relaxed text-surface-300">
              {product.description}
            </p>

            <div className="mt-8 border-t border-surface-800/50 pt-8">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-white">Color</h3>
                <div className="mt-3 flex items-center gap-3">
                  {colors.map((color: any) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all focus:outline-none ${selectedColor === color.id ? 'border-white' : 'border-transparent hover:border-surface-600'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <span className="absolute inset-0 rounded-full border-4 border-surface-950 mix-blend-overlay" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Size</h3>
                  <button className="text-sm font-medium text-brand-400 hover:text-brand-300">Size Guide</button>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {sizes.map((size: any) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all focus:outline-none ${
                        selectedSize === size.id
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-surface-700 bg-surface-900 text-surface-300 hover:border-surface-500 hover:bg-surface-800'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex gap-4">
              <Button size="lg" className="flex-1 text-base" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 shrink-0 rounded-2xl">
                <Heart className="h-6 w-6" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-surface-800/50 pt-8">
              <div className="flex items-center gap-3 text-sm text-surface-300">
                <Truck className="h-5 w-5 text-brand-500" />
                <span>Free delivery over ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-surface-300">
                <RotateCcw className="h-5 w-5 text-brand-500" />
                <span>7 days return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
