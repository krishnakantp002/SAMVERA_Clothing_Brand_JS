// ============================================
// SAMVERA — Type Definitions
// ============================================

export * from './api';

// Re-export Prisma types for convenience
export type {
  User,
  Role,
  Permission,
  Address,
  Category,
  Subcategory,
  Brand,
  Size,
  Color,
  Product,
  ProductVariant,
  ProductImage,
  Inventory,
  InventoryTransaction,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
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

import type {
  Product as PrismaProduct,
  ProductVariant as PrismaProductVariant,
  ProductImage as PrismaProductImage,
  Size as PrismaSize,
  Color as PrismaColor,
  Category as PrismaCategory,
  Subcategory as PrismaSubcategory,
  Brand as PrismaBrand,
  Inventory as PrismaInventory,
  Review as PrismaReview,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderAddress as PrismaOrderAddress,
  Payment as PrismaPayment,
  User as PrismaUser,
} from '@prisma/client';

/**
 * Product with all relations for detail page
 */
export interface ProductWithDetails extends PrismaProduct {
  category: PrismaCategory;
  subcategory: PrismaSubcategory | null;
  brand: PrismaBrand | null;
  images: PrismaProductImage[];
  variants: VariantWithDetails[];
  reviews: PrismaReview[];
  _count?: {
    reviews: number;
  };
}

/**
 * Product variant with size, color, and inventory
 */
export interface VariantWithDetails extends PrismaProductVariant {
  size: PrismaSize;
  color: PrismaColor;
  inventory: PrismaInventory | null;
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
    size: PrismaSize;
    color: PrismaColor;
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
export interface OrderWithDetails extends PrismaOrder {
  items: PrismaOrderItem[];
  addresses: PrismaOrderAddress[];
  payment: PrismaPayment | null;
  user: Pick<PrismaUser, 'id' | 'firstName' | 'lastName' | 'email'>;
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
