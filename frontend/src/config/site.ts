// ============================================
// SAMVERA — Site Configuration
// ============================================

export const siteConfig = {
  name: 'SAMVERA',
  description: "Premium men's fashion and lifestyle essentials",
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  currency: 'INR',
  locale: 'en-IN',

  // Navigation
  nav: {
    main: [
      { label: 'Shop', href: '/shop' },
      { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
      { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
    ],
    categories: [
      { label: 'T-Shirts', href: '/category/tshirts', icon: '👕' },
      { label: 'Oversized', href: '/category/oversized-tshirts', icon: '🎽' },
      { label: 'Shirts', href: '/category/shirts', icon: '👔' },
      { label: 'Hoodies', href: '/category/hoodies', icon: '🧥' },
      { label: 'Sweatshirts', href: '/category/sweatshirts', icon: '🧶' },
      { label: 'Bottomwear', href: '/category/bottomwear', icon: '👖' },
      { label: 'Innerwear', href: '/category/innerwear', icon: '🩲' },
      { label: 'Accessories', href: '/category/accessories', icon: '🧢' },
      { label: 'Grooming', href: '/category/grooming', icon: '✨' },
      { label: 'Combos', href: '/category/combos', icon: '📦' },
    ],
    account: [
      { label: 'Profile', href: '/account/profile' },
      { label: 'Orders', href: '/account/orders' },
      { label: 'Addresses', href: '/account/addresses' },
      { label: 'Reviews', href: '/account/reviews' },
    ],
  },

  // Social links
  social: {
    instagram: 'https://instagram.com/samvera',
    twitter: 'https://twitter.com/samvera',
    facebook: 'https://facebook.com/samvera',
  },

  // Business rules
  limits: {
    maxCartQuantity: 10,
    maxCartItems: 50,
    freeShippingThreshold: 999,
    standardShippingCost: 99,
    expressShippingCost: 199,
    maxReviewImages: 5,
    maxProductImages: 10,
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 50,
  },
} as const;

export type SiteConfig = typeof siteConfig;
