'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronRight,
} from 'lucide-react';

// ── Animation Variants ─────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Hero Section ────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-surface-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />
        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              New Collection — Fall 2026
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="mt-8 font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Redefine
            <br />
            <span className="text-gradient">Your Style.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-surface-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Premium men&apos;s fashion & lifestyle essentials. Curated for the modern man
            who values quality, comfort, and effortless style.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-surface-950 transition-all duration-300 hover:bg-brand-400 hover:text-white hover:shadow-lg hover:shadow-brand-500/25"
            >
              <ShoppingBag className="h-5 w-5" />
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category/new-arrivals"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-700 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-brand-500/50 hover:bg-brand-500/10"
            >
              New Arrivals
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            className="mt-16 flex flex-wrap gap-8 text-sm text-surface-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {[
              { icon: Truck, text: 'Free shipping over ₹999' },
              { icon: RotateCcw, text: '7-day easy returns' },
              { icon: Shield, text: 'Secure payments' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-brand-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-surface-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-surface-600 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

// ── Categories Section ──────────────────────

const categories = [
  { name: 'T-Shirts', slug: 'tshirts', emoji: '👕', color: 'from-blue-500/20 to-blue-600/5' },
  { name: 'Oversized', slug: 'oversized-tshirts', emoji: '🎽', color: 'from-purple-500/20 to-purple-600/5' },
  { name: 'Hoodies', slug: 'hoodies', emoji: '🧥', color: 'from-amber-500/20 to-amber-600/5' },
  { name: 'Shirts', slug: 'shirts', emoji: '👔', color: 'from-emerald-500/20 to-emerald-600/5' },
  { name: 'Bottomwear', slug: 'bottomwear', emoji: '👖', color: 'from-cyan-500/20 to-cyan-600/5' },
  { name: 'Accessories', slug: 'accessories', emoji: '🧢', color: 'from-rose-500/20 to-rose-600/5' },
];

function CategoriesSection() {
  return (
    <section className="bg-surface-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 text-surface-400">
              Find exactly what you&apos;re looking for
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} variants={fadeUp} custom={i}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-4 rounded-2xl border border-surface-800/50 bg-surface-900/50 p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-surface-900 hover:shadow-lg hover:shadow-brand-500/5"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-3xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    {cat.emoji}
                  </div>
                  <span className="text-sm font-medium text-surface-300 transition-colors group-hover:text-white">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Product Card Placeholder ────────────────

function ProductCardPlaceholder({ index }: { index: number }) {
  const products = [
    { name: 'Midnight Black Oversized Tee', price: '₹899', compare: '₹1,499', discount: '40% OFF' },
    { name: 'Essential White Crew Neck', price: '₹699', compare: '₹1,199', discount: '42% OFF' },
    { name: 'Olive Cargo Joggers', price: '₹1,299', compare: '₹2,199', discount: '41% OFF' },
    { name: 'Navy Blue Polo Shirt', price: '₹999', compare: '₹1,799', discount: '44% OFF' },
    { name: 'Charcoal Grey Hoodie', price: '₹1,499', compare: '₹2,499', discount: '40% OFF' },
    { name: 'Desert Beige Chinos', price: '₹1,199', compare: '₹1,999', discount: '40% OFF' },
    { name: 'Forest Green Sweatshirt', price: '₹1,099', compare: '₹1,899', discount: '42% OFF' },
    { name: 'Classic Maroon Henley', price: '₹799', compare: '₹1,399', discount: '43% OFF' },
  ];

  const product = products[index % products.length];

  return (
    <motion.div
      variants={scaleIn}
      className="group cursor-pointer"
    >
      {/* Image placeholder with gradient */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900">
        {/* Shimmer effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">👕</span>
        </div>
        {/* Discount badge */}
        <div className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">
          {product.discount}
        </div>
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-surface-950/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <button className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-surface-950 transition-colors hover:bg-brand-400 hover:text-white">
            Add to Cart
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-surface-200 transition-colors group-hover:text-white">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">{product.price}</span>
          <span className="text-sm text-surface-500 line-through">{product.compare}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < 4 ? 'fill-brand-400 text-brand-400' : 'text-surface-700'}`}
            />
          ))}
          <span className="ml-1 text-xs text-surface-500">(128)</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Product Section ─────────────────────────

function ProductSection({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string;
  subtitle: string;
  viewAllHref: string;
}) {
  return (
    <section className="bg-surface-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="flex items-end justify-between"
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 text-surface-400">{subtitle}</p>
            </div>
            <Link
              href={viewAllHref}
              className="hidden items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300 sm:flex"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            variants={staggerContainer}
            className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {[0, 1, 2, 3].map((i) => (
              <ProductCardPlaceholder key={i} index={i} />
            ))}
          </motion.div>

          {/* Mobile view all */}
          <motion.div variants={fadeUp} className="mt-8 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-400"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Promo Banner ────────────────────────────

function PromoBanner() {
  return (
    <section className="bg-surface-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-dark"
        >
          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative flex flex-col items-center justify-between gap-6 px-8 py-16 text-center sm:flex-row sm:text-left lg:px-16">
            <div>
              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Combo Deals
              </h3>
              <p className="mt-2 text-lg text-white/80">
                Save up to 40% on curated bundles
              </p>
            </div>
            <Link
              href="/category/combos"
              className="shrink-0 rounded-full bg-white px-8 py-3 font-semibold text-brand-600 transition-all duration-300 hover:bg-surface-100 hover:shadow-lg"
            >
              Shop Combos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Features / Trust ────────────────────────

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on orders above ₹999',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% secure payment gateway',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Handpicked fabrics & superior finish',
  },
];

function FeaturesSection() {
  return (
    <section className="border-y border-surface-800/50 bg-surface-900/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10">
                <feature.icon className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-1 text-xs text-surface-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Newsletter ──────────────────────────────

function NewsletterSection() {
  return (
    <section className="bg-surface-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white">
            Join the <span className="text-gradient">SAMVERA</span> Club
          </h2>
          <p className="mt-3 text-surface-400">
            Subscribe for exclusive drops, early access, and member-only deals.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-surface-700 bg-surface-900 px-6 py-3.5 text-white placeholder-surface-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-500 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-surface-600">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────

function Footer() {
  const footerLinks = {
    Shop: [
      { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
      { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
      { label: 'T-Shirts', href: '/category/tshirts' },
      { label: 'Hoodies', href: '/category/hoodies' },
      { label: 'Bottomwear', href: '/category/bottomwear' },
      { label: 'Combos', href: '/category/combos' },
    ],
    Help: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Shipping', href: '/shipping-info' },
      { label: 'Returns', href: '/returns' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  };

  return (
    <footer className="border-t border-surface-800/50 bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold text-white">
              SAMVERA
            </Link>
            <p className="mt-3 text-sm text-surface-400">
              Premium men&apos;s fashion &amp; lifestyle essentials for the modern man.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300">
                {category}
              </h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-800/50 pt-8 sm:flex-row">
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} SAMVERA. All rights reserved.
          </p>
          <div className="flex gap-4 text-surface-600">
            <span className="text-xs">UPI</span>
            <span className="text-xs">Visa</span>
            <span className="text-xs">Mastercard</span>
            <span className="text-xs">RuPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ───────────────────────────────

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh drops you don't want to miss"
        viewAllHref="/shop?filter=new-arrivals"
      />
      <PromoBanner />
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by our customers"
        viewAllHref="/shop?filter=best-sellers"
      />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
