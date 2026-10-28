'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { api } from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Hero Section ────────────────────────────

function HeroSection({ heroBanner, renderMedia }: { heroBanner: any, renderMedia: any }) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-surface-100">
      <div className="absolute inset-0 bg-surface-200 flex items-center justify-center">
        {heroBanner ? (
          <div className="absolute inset-0">
            {renderMedia(heroBanner.imageUrl)}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-10">SAMVERA</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl font-black uppercase tracking-tighter text-black sm:text-7xl md:text-8xl lg:text-9xl"
        >
          New Rules.
          <br />
          New Style.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 max-w-xl text-sm font-medium uppercase tracking-widest text-surface-800 sm:text-base"
        >
          Premium Streetwear Essentials. Made for the Bold.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="group flex items-center justify-center gap-2 bg-black px-12 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-surface-800"
          >
            Shop the Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Categories Section ──────────────────────

function CategoriesSection({ categories = [] }: { categories: any[] }) {
  // If no categories from DB, show a fallback layout
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-surface-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex aspect-square items-center justify-center overflow-hidden bg-surface-100 transition-all hover:bg-surface-200"
            >
              {cat.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="text-6xl opacity-20 transition-transform duration-500 group-hover:scale-110">👕</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <span className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-lg">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Product Section ─────────────────────────

function ProductSection({
  title,
  viewAllHref,
  products,
  loading,
}: {
  title: string;
  viewAllHref: string;
  products: any[];
  loading: boolean;
}) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-black pb-4">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black hover:text-surface-600"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-surface-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-1/2 bg-surface-100" />
                  <div className="h-4 w-3/4 bg-surface-100" />
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-sm font-medium uppercase tracking-widest text-surface-500">
              No products available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Features ────────────────────────────────

function FeaturesSection() {
  return (
    <section className="border-t border-surface-200 bg-surface-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₹999' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '7 days return policy' },
            { icon: Shield, title: 'Secure Checkout', desc: '100% secure payments' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <f.icon className="h-8 w-8 text-black" strokeWidth={1.5} />
              <h3 className="mt-4 text-xs font-bold uppercase tracking-widest text-black">{f.title}</h3>
              <p className="mt-1 text-sm text-surface-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ───────────────────────────────

export default function HomePage() {
  const [newArrivals, setNewArrivals] = React.useState<any[]>([]);
  const [bestSellers, setBestSellers] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [heroBanner, setHeroBanner] = React.useState<any>(null);
  const [promoBanner, setPromoBanner] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [newRes, bestRes, bannerRes, catRes] = await Promise.all([
          api.get('/products?filter=new-arrivals&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?filter=best-sellers&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/banners').catch(() => ({ data: { data: [] } })),
          api.get('/products/categories').catch(() => ({ data: { data: [] } }))
        ]);
        setNewArrivals(newRes.data?.data?.products || []);
        setBestSellers(bestRes.data?.data?.products || []);
        setCategories(catRes.data?.data || []);
        
        const banners = bannerRes.data?.data || [];
        setHeroBanner(banners.find((b: any) => b.position === 'HERO'));
        setPromoBanner(banners.find((b: any) => b.position === 'PROMOTIONAL'));
      } catch {
        // Fallback handled by empty arrays
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderMedia = (url: string | undefined, className: string = "h-full w-full object-cover") => {
    if (!url) return null;
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    if (isVideo) {
      return (
        <video autoPlay loop muted playsInline className={className}>
          <source src={url} type="video/mp4" />
        </video>
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="Banner" className={className} />;
  };

  return (
    <main className="bg-white">
      <HeroSection heroBanner={heroBanner} renderMedia={renderMedia} />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
      <ProductSection
        title="New Arrivals"
        viewAllHref="/shop?filter=new-arrivals"
        products={newArrivals}
        loading={loading}
      />
      {promoBanner ? (
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] bg-surface-100 flex items-center justify-center overflow-hidden border-y border-surface-200">
          {renderMedia(promoBanner.imageUrl)}
        </div>
      ) : (
        <div className="w-full bg-surface-100 py-32 text-center border-y border-surface-200">
          <span className="text-xs font-bold uppercase tracking-widest text-surface-400">
            Lifestyle Banner / Video Placement
          </span>
        </div>
      )}
      <ProductSection
        title="Best Sellers"
        viewAllHref="/shop?filter=best-sellers"
        products={bestSellers}
        loading={loading}
      />
    </main>
  );
}
