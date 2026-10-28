// ============================================
// SAMVERA — Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

// ── Common ──────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const idSchema = z.object({
  id: z.string().cuid(),
});

export const slugSchema = z.object({
  slug: z.string().min(1).max(200),
});

// ── Auth ────────────────────────────────────

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

// ── Address ─────────────────────────────────

export const addressSchema = z.object({
  firstName: z.string().min(2).max(50).trim(),
  lastName: z.string().min(2).max(50).trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid phone number'),
  addressLine1: z.string().min(5, 'Address is required').max(200).trim(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, 'City is required').max(100).trim(),
  state: z.string().min(2, 'State is required').max(100).trim(),
  postalCode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
  country: z.string().default('IN'),
  isDefault: z.boolean().default(false),
});

// ── Cart ────────────────────────────────────

export const addToCartSchema = z.object({
  variantId: z.string().cuid('Invalid variant'),
  quantity: z.number().int().min(1).max(10, 'Maximum 10 items per product'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(10, 'Maximum 10 items per product'),
});

// ── Wishlist ────────────────────────────────

export const addToWishlistSchema = z.object({
  productId: z.string().cuid('Invalid product'),
  variantId: z.string().cuid().optional(),
});

// ── Checkout ────────────────────────────────

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase().trim(),
});

export const checkoutCalculateSchema = z.object({
  addressId: z.string().cuid(),
  shippingMethod: z.enum(['standard', 'express']),
  couponCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  shippingAddressId: z.string().cuid(),
  billingAddressId: z.string().cuid().optional(),
  shippingMethod: z.enum(['standard', 'express']),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['ONLINE', 'COD']),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().uuid('Invalid idempotency key'),
});

// ── Review ──────────────────────────────────

export const createReviewSchema = z.object({
  productId: z.string().cuid(),
  orderId: z.string().cuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(5).default([]),
});

// ── Search ──────────────────────────────────

export const searchSchema = z.object({
  q: z.string().min(1).max(200).trim(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  inStock: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  sort: z
    .enum(['relevance', 'newest', 'price_asc', 'price_desc', 'rating', 'popularity'])
    .default('relevance'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ── Admin Product ───────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  slug: z.string().min(2).max(200).optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(10, 'Description is required'),
  specifications: z.record(z.string(), z.string()).optional(),
  material: z.string().max(200).optional(),
  fit: z.string().max(100).optional(),
  careInstructions: z.string().max(500).optional(),
  basePrice: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().cuid(),
  subcategoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  weight: z.number().positive().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).default([]),
  videoUrl: z.string().url().optional(),
});

export const createVariantSchema = z.object({
  sizeId: z.string().cuid(),
  colorId: z.string().cuid(),
  sku: z.string().min(3).max(50),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  initialStock: z.number().int().min(0).default(0),
});

// ── Admin Inventory ─────────────────────────

export const adjustInventorySchema = z.object({
  adjustment: z.number().int().refine((v) => v !== 0, 'Adjustment cannot be zero'),
  type: z.enum(['STOCK_ADDED', 'STOCK_DAMAGED', 'STOCK_ADJUSTED']),
  reason: z.string().min(3, 'Please provide a reason').max(500),
});

// ── Admin Coupon ────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase().trim(),
  type: z.enum(['PERCENTAGE', 'FLAT']),
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
  description: z.string().max(500).optional(),
});

// ── Payment ─────────────────────────────────

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// ── Type Exports ────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
