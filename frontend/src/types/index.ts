// ============================================
// SAMVERA — Type Definitions
// ============================================

export * from './api';

// Re-export Prisma types for convenience
// (User, Address, Category, Product, ProductVariant, ProductImage, Order and OrderItem
// are defined locally below and take precedence)
export type {
  Role,
  Permission,
  Subcategory,
  Brand,
  Size,
  Color,
  Inventory,
  InventoryTransaction,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  OrderAddress,
  OrderStatusHistory,
  Payment,
  PaymentTransaction,
  Coupon,
  CouponUsage,
  Review,
  Banner,
  Collection,
  Shipment,
  Notification,
  AuditLog,
  AnalyticsEvent,
} from '@prisma/client';

// ── Extended Types (with relations) ─────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  sizeId: string;
  colorId: string;
  size?: { id: string; name: string };
  color?: { id: string; name: string; hexCode: string };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number | string;
  compareAtPrice?: number | string | null;
  categoryId: string;
  category?: Category;
  primaryImage?: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number | string;
  quantity: number;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  createdAt: Date | string;
  items?: OrderItem[];
  payment?: { status: string; method: string };
}

/**
 * Product with all relations for detail page
 */
export interface ProductWithDetails extends Product {
  subcategory: any | null;
  brand: any | null;
  images: ProductImage[];
  variants: VariantWithDetails[];
  reviews: any[];
  _count?: {
    reviews: number;
  };
}

/**
 * Product variant with size, color, and inventory
 */
export interface VariantWithDetails extends ProductVariant {
  inventory: any | null;
}

/**
 * Product card data (lightweight)
 */
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  primaryImage: string | null;
  category: { name: string; slug: string };
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  variants: Array<{
    id: string;
    size: { name: string };
    color: { name: string; hexCode: string };
    price: number;
    available: boolean;
  }>;
}

/**
 * Cart with items and product details
 */
export interface CartWithItems {
  id: string;
  items: CartItemWithDetails[];
  summary: CartSummary;
}

export interface CartItemWithDetails {
  id: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    isActive: boolean;
    size: { id: string; name: string };
    color: { id: string; name: string; hexCode: string };
    product: {
      id: string;
      name: string;
      slug: string;
      primaryImage: string | null;
    };
    inventory: {
      available: number;
    } | null;
  };
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
}

/**
 * Order with full details
 */
export interface OrderWithDetails extends Order {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  items: OrderItem[];
  addresses: Address[];
  statusHistory: any[];
  payment: any | null;
  shipments: any[];
}

export interface CartItemData {
  id: string; // matches variantId
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

/**
 * Dashboard stats for admin
 */
export interface DashboardStats {
  revenue: { total: number; change: number };
  orders: { total: number; change: number };
  customers: { total: number; new: number };
  averageOrderValue: { total: number; change: number };
  lowStockCount: number;
  pendingOrders: number;
}
