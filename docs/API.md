# SAMVERA — API Design Document

> **Version:** 1.0  
> **Date:** September 2026  
> **Status:** Draft

---

## 1. Overview

All APIs follow RESTful conventions with consistent request/response formats. The API is built using Next.js API Routes and Server Actions with server-side validation (Zod), authentication, and authorization on every endpoint.

---

## 2. Standard Response Format

### Success Response
```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
```

### Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;         // Machine-readable: "PRODUCT_NOT_FOUND"
    message: string;      // Human-readable: "The requested product was not found"
    details?: Record<string, string[]>;  // Field-level validation errors
  };
}
```

---

## 3. HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success — resource retrieved or updated |
| `201` | Created — resource created |
| `204` | No Content — resource deleted |
| `400` | Bad Request — validation error |
| `401` | Unauthorized — not authenticated |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate or state conflict |
| `422` | Unprocessable Entity — business logic error |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error — unexpected error |

---

## 4. Rate Limiting

| Endpoint Category | Rate Limit | Window |
|-------------------|-----------|--------|
| Authentication (login/register) | 10 requests | 15 min |
| Password reset | 5 requests | 15 min |
| Search | 60 requests | 1 min |
| Cart operations | 30 requests | 1 min |
| Checkout/Payment | 10 requests | 1 min |
| General API | 100 requests | 1 min |
| Admin API | 200 requests | 1 min |
| Webhooks | No limit | — |

---

## 5. Pagination

### Offset-Based (Default)
```
GET /api/products?page=1&limit=20
```
Response includes `meta` with `page`, `limit`, `total`, `totalPages`, `hasMore`.

### Cursor-Based (For infinite scroll)
```
GET /api/products?cursor=<lastItemId>&limit=20
```
Response includes `meta` with `nextCursor`, `hasMore`.

---

## 6. Filtering & Sorting Convention

```
GET /api/products?category=tshirts&minPrice=500&maxPrice=2000&size=M,L&color=black&sort=price_asc&page=1&limit=20
```

| Parameter | Type | Example |
|-----------|------|---------|
| `category` | string | `tshirts` |
| `subcategory` | string | `oversized` |
| `minPrice` | number | `500` |
| `maxPrice` | number | `2000` |
| `size` | string (comma-separated) | `M,L,XL` |
| `color` | string (comma-separated) | `black,white` |
| `brand` | string | `samvera` |
| `rating` | number (min) | `4` |
| `discount` | boolean | `true` |
| `inStock` | boolean | `true` |
| `sort` | enum | `newest`, `price_asc`, `price_desc`, `rating`, `popularity` |
| `page` | number | `1` |
| `limit` | number | `20` (max: 50) |

---

## 7. Authentication APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/auth/register` | Register new customer | ❌ | — |
| `POST` | `/api/auth/login` | Login with email/password | ❌ | — |
| `POST` | `/api/auth/logout` | Logout (clear session) | ✅ | Any |
| `GET` | `/api/auth/me` | Get current user profile | ✅ | Any |
| `POST` | `/api/auth/forgot-password` | Request password reset email | ❌ | — |
| `POST` | `/api/auth/reset-password` | Reset password with token | ❌ | — |
| `POST` | `/api/auth/verify-email` | Verify email with token | ❌ | — |
| `POST` | `/api/auth/refresh` | Refresh session token | ✅ | Any |

### Register — Request/Response

```typescript
// POST /api/auth/register
// Request
{
  firstName: string;    // min: 2, max: 50
  lastName: string;     // min: 2, max: 50
  email: string;        // valid email
  password: string;     // min: 8, uppercase, lowercase, number
  phone?: string;       // valid phone
}

// Response 201
{
  success: true,
  data: {
    user: { id, firstName, lastName, email, emailVerified },
    message: "Registration successful. Please verify your email."
  }
}

// Error 409
{
  success: false,
  error: { code: "EMAIL_EXISTS", message: "An account with this email already exists" }
}
```

### Login — Request/Response

```typescript
// POST /api/auth/login
// Request
{
  email: string;
  password: string;
}

// Response 200 (sets HTTP-only cookie)
{
  success: true,
  data: {
    user: { id, firstName, lastName, email, roles },
    message: "Login successful"
  }
}

// Error 401
{
  success: false,
  error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" }
}
```

---

## 8. User APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/users/profile` | Get user profile | ✅ | Customer |
| `PUT` | `/api/users/profile` | Update user profile | ✅ | Customer |
| `PUT` | `/api/users/change-password` | Change password | ✅ | Customer |
| `GET` | `/api/users/addresses` | List user addresses | ✅ | Customer |
| `POST` | `/api/users/addresses` | Add new address | ✅ | Customer |
| `PUT` | `/api/users/addresses/:id` | Update address | ✅ | Customer |
| `DELETE` | `/api/users/addresses/:id` | Delete address | ✅ | Customer |
| `PUT` | `/api/users/addresses/:id/default` | Set default address | ✅ | Customer |

---

## 9. Product APIs (Public)

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/products` | List products (paginated, filtered) | ❌ | — |
| `GET` | `/api/products/:slug` | Get product detail | ❌ | — |
| `GET` | `/api/products/featured` | Featured products | ❌ | — |
| `GET` | `/api/products/new-arrivals` | New arrival products | ❌ | — |
| `GET` | `/api/products/best-sellers` | Best seller products | ❌ | — |
| `GET` | `/api/products/:slug/reviews` | Product reviews (paginated) | ❌ | — |
| `GET` | `/api/products/:slug/related` | Related products | ❌ | — |

### Product Detail — Response

```typescript
// GET /api/products/:slug
{
  success: true,
  data: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    specifications: Record<string, string>;
    material: string;
    fit: string;
    careInstructions: string;
    basePrice: number;
    compareAtPrice: number | null;
    category: { id, name, slug };
    subcategory: { id, name, slug } | null;
    brand: { id, name, slug } | null;
    images: Array<{ id, url, altText, isPrimary, colorId }>;
    videoUrl: string | null;
    variants: Array<{
      id: string;
      size: { id, name };
      color: { id, name, hexCode };
      sku: string;
      price: number;
      compareAtPrice: number | null;
      isActive: boolean;
      inventory: {
        available: number;    // availableStock (not totalStock!)
        lowStock: boolean;
      };
    }>;
    rating: {
      average: number;
      count: number;
      distribution: { 1: number, 2: number, 3: number, 4: number, 5: number };
    };
    metaTitle: string;
    metaDescription: string;
  }
}
```

> ⚠️ **Security:** Never expose `totalStock` or `reservedStock` to the public API. Only expose `available` (capped at a threshold like 10+ = "In Stock").

---

## 10. Category APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/categories` | List all active categories | ❌ | — |
| `GET` | `/api/categories/:slug` | Category with subcategories | ❌ | — |
| `GET` | `/api/categories/:slug/products` | Products in category (paginated) | ❌ | — |

---

## 11. Search APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/search` | Full search with filters | ❌ | — |
| `GET` | `/api/search/suggestions` | Search autocomplete | ❌ | — |
| `GET` | `/api/search/popular` | Popular search terms | ❌ | — |

### Search — Request

```
GET /api/search?q=oversized+black&category=tshirts&minPrice=500&maxPrice=2000&size=M,L&color=black&sort=relevance&page=1&limit=20
```

### Search Suggestions — Response

```typescript
// GET /api/search/suggestions?q=over
{
  success: true,
  data: {
    suggestions: [
      { text: "oversized tshirt", type: "query" },
      { text: "oversized hoodie", type: "query" },
      { text: "Oversized Black Tee", type: "product", slug: "oversized-black-tee" }
    ]
  }
}
```

---

## 12. Cart APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/cart` | Get user's cart with items | ✅ | Customer |
| `POST` | `/api/cart/items` | Add item to cart | ✅ | Customer |
| `PUT` | `/api/cart/items/:id` | Update cart item (quantity/variant) | ✅ | Customer |
| `DELETE` | `/api/cart/items/:id` | Remove item from cart | ✅ | Customer |
| `DELETE` | `/api/cart` | Clear entire cart | ✅ | Customer |

### Add to Cart — Request/Response

```typescript
// POST /api/cart/items
// Request
{
  variantId: string;
  quantity: number;    // min: 1, max: 10
}

// Server-side validation:
// 1. Product exists and is ACTIVE
// 2. Variant exists and isActive
// 3. Available stock >= requested quantity
// 4. Price is fetched from DB (NEVER from client)
// 5. Quantity doesn't exceed per-item limit

// Response 201
{
  success: true,
  data: {
    cart: {
      id: string;
      items: CartItem[];
      summary: {
        itemCount: number;
        subtotal: number;   // Calculated server-side
      }
    }
  }
}

// Error 422
{
  success: false,
  error: { code: "INSUFFICIENT_STOCK", message: "Only 2 items available" }
}
```

---

## 13. Wishlist APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/wishlist` | Get user's wishlist | ✅ | Customer |
| `POST` | `/api/wishlist/items` | Add product to wishlist | ✅ | Customer |
| `DELETE` | `/api/wishlist/items/:id` | Remove from wishlist | ✅ | Customer |
| `POST` | `/api/wishlist/items/:id/move-to-cart` | Move wishlist item to cart | ✅ | Customer |

---

## 14. Checkout APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/checkout/validate` | Validate cart for checkout | ✅ | Customer |
| `POST` | `/api/checkout/apply-coupon` | Apply coupon code | ✅ | Customer |
| `DELETE` | `/api/checkout/remove-coupon` | Remove applied coupon | ✅ | Customer |
| `POST` | `/api/checkout/calculate` | Calculate order totals | ✅ | Customer |
| `GET` | `/api/checkout/shipping-methods` | Available shipping methods | ✅ | Customer |

### Calculate Totals — Response

```typescript
// POST /api/checkout/calculate
// Request
{
  addressId: string;
  shippingMethod: string;
  couponCode?: string;
}

// Response (ALL calculated server-side)
{
  success: true,
  data: {
    subtotal: 2499.00,
    discount: 249.90,         // From coupon
    coupon: { code: "WELCOME10", description: "10% off" } | null,
    shippingCost: 99.00,
    tax: 0.00,
    total: 2348.10,           // subtotal - discount + shipping + tax
    items: [
      {
        variantId: string;
        productName: string;
        variantName: "M / Black";
        sku: string;
        price: 1249.50;      // Current server-side price
        quantity: 2;
        total: 2499.00;
        available: true;
        imageUrl: string;
      }
    ]
  }
}
```

> ⚠️ **Critical:** The frontend NEVER sends prices. The server fetches current prices from the database and calculates everything.

---

## 15. Order APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/orders` | Create order | ✅ | Customer |
| `GET` | `/api/orders` | List user's orders (paginated) | ✅ | Customer |
| `GET` | `/api/orders/:id` | Get order details | ✅ | Customer |
| `POST` | `/api/orders/:id/cancel` | Cancel order | ✅ | Customer |
| `POST` | `/api/orders/:id/return` | Request return | ✅ | Customer |

### Create Order — Flow

```typescript
// POST /api/orders
// Request
{
  shippingAddressId: string;
  billingAddressId?: string;     // Defaults to shipping
  shippingMethod: string;
  couponCode?: string;
  paymentMethod: "ONLINE" | "COD";
  notes?: string;
  idempotencyKey: string;        // Client-generated UUID
}

// Server-side steps (TRANSACTIONAL):
// 1. Validate idempotency key (prevent duplicate orders)
// 2. Fetch cart items with current prices from DB
// 3. Validate all items are available
// 4. Calculate totals server-side
// 5. Validate and apply coupon
// 6. Reserve inventory (with row-level lock)
// 7. Create Order + OrderItems + OrderAddresses (snapshots)
// 8. Create Payment record (PENDING)
// 9. Record OrderStatusHistory
// 10. Clear cart
// 11. Return order with payment info

// Response 201
{
  success: true,
  data: {
    order: {
      id: string;
      orderNumber: "SAM-20260908-A1B2";
      status: "PENDING";
      total: 2348.10;
      payment: {
        id: string;
        gatewayOrderId: string;   // For Razorpay checkout
        amount: 2348.10;
        currency: "INR";
      }
    }
  }
}
```

---

## 16. Payment APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/payments/create-order` | Create Razorpay order | ✅ | Customer |
| `POST` | `/api/payments/verify` | Verify payment (frontend callback) | ✅ | Customer |
| `POST` | `/api/payments/webhook` | Razorpay webhook (server-to-server) | ❌* | — |

*Webhook uses Razorpay signature verification instead of session auth.

### Payment Verification

```typescript
// POST /api/payments/verify
// Request (from Razorpay checkout callback)
{
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Server-side steps:
// 1. Verify HMAC SHA256 signature using Razorpay secret
// 2. Find payment by gatewayOrderId
// 3. Check idempotency (skip if already processed)
// 4. Update Payment status to SUCCESS
// 5. Update Order status to CONFIRMED
// 6. Convert reserved inventory to sold
// 7. Record OrderStatusHistory
// 8. Send confirmation email
// 9. Create PaymentTransaction record

// Response 200
{
  success: true,
  data: {
    order: {
      id: string;
      orderNumber: string;
      status: "CONFIRMED";
    },
    message: "Payment verified successfully"
  }
}
```

### Webhook Handler

```typescript
// POST /api/payments/webhook
// Headers: X-Razorpay-Signature

// Server-side steps:
// 1. Verify webhook signature (HMAC SHA256)
// 2. Parse event type (payment.authorized, payment.captured, payment.failed)
// 3. Find payment by gateway IDs
// 4. Check if already processed (idempotency)
// 5. Update payment and order status accordingly
// 6. Handle failure: release inventory, update order
// 7. Log PaymentTransaction

// Response 200 (always return 200 to prevent retries for processed events)
{ received: true }
```

> ⚠️ **Security Notes:**
> - Never mark payment as successful based on frontend callback alone
> - Webhook is the source of truth for payment status
> - All payment verification must use cryptographic signature verification
> - Payment operations must be idempotent

---

## 17. Review APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/reviews` | Create review | ✅ | Customer |
| `PUT` | `/api/reviews/:id` | Update own review | ✅ | Customer |
| `DELETE` | `/api/reviews/:id` | Delete own review | ✅ | Customer |

### Create Review

```typescript
// POST /api/reviews
// Request
{
  productId: string;
  orderId?: string;       // For verified purchase badge
  rating: number;         // 1-5
  title?: string;         // max: 100
  comment?: string;       // max: 2000
  images?: string[];      // max: 5 image URLs
}

// Validation:
// - User has purchased this product (for verified badge)
// - User hasn't already reviewed this product
// - Rating between 1-5
// - Review auto-set to isApproved: false (admin moderates)
```

---

## 18. Admin APIs

### 18.1 Dashboard

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/dashboard/stats` | Key metrics | ✅ | Admin |
| `GET` | `/api/admin/dashboard/revenue` | Revenue chart data | ✅ | Admin |
| `GET` | `/api/admin/dashboard/orders-chart` | Orders chart data | ✅ | Admin |
| `GET` | `/api/admin/dashboard/top-products` | Top selling products | ✅ | Admin |
| `GET` | `/api/admin/dashboard/recent-orders` | Recent orders | ✅ | Admin |

```typescript
// GET /api/admin/dashboard/stats?period=30d
{
  success: true,
  data: {
    revenue: { total: 485000, change: 12.5 },           // vs previous period
    orders: { total: 342, change: 8.3 },
    customers: { total: 1205, new: 89 },
    averageOrderValue: { total: 1418, change: 3.8 },
    conversionRate: { total: 2.4, change: -0.2 },
    topProducts: [{ id, name, image, sold, revenue }],
    lowStockCount: 12,
    pendingOrders: 28
  }
}
```

### 18.2 Product Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/products` | List products (paginated) | ✅ | Admin |
| `POST` | `/api/admin/products` | Create product | ✅ | Admin |
| `GET` | `/api/admin/products/:id` | Get product detail (admin) | ✅ | Admin |
| `PUT` | `/api/admin/products/:id` | Update product | ✅ | Admin |
| `DELETE` | `/api/admin/products/:id` | Archive product (soft delete) | ✅ | Admin |
| `PUT` | `/api/admin/products/:id/status` | Change status (DRAFT/ACTIVE/ARCHIVED) | ✅ | Admin |
| `POST` | `/api/admin/products/:id/variants` | Add variant | ✅ | Admin |
| `PUT` | `/api/admin/products/:id/variants/:vid` | Update variant | ✅ | Admin |
| `DELETE` | `/api/admin/products/:id/variants/:vid` | Delete variant | ✅ | Admin |
| `POST` | `/api/admin/products/:id/images` | Upload images | ✅ | Admin |
| `PUT` | `/api/admin/products/:id/images/:imgId` | Update image (order, alt) | ✅ | Admin |
| `DELETE` | `/api/admin/products/:id/images/:imgId` | Delete image | ✅ | Admin |

### 18.3 Category Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/categories` | List all categories | ✅ | Admin |
| `POST` | `/api/admin/categories` | Create category | ✅ | Admin |
| `PUT` | `/api/admin/categories/:id` | Update category | ✅ | Admin |
| `DELETE` | `/api/admin/categories/:id` | Deactivate category | ✅ | Admin |
| `POST` | `/api/admin/categories/:id/subcategories` | Add subcategory | ✅ | Admin |
| `PUT` | `/api/admin/subcategories/:id` | Update subcategory | ✅ | Admin |
| `DELETE` | `/api/admin/subcategories/:id` | Deactivate subcategory | ✅ | Admin |

### 18.4 Order Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/orders` | List orders (paginated, filtered) | ✅ | Admin |
| `GET` | `/api/admin/orders/:id` | Order detail (full) | ✅ | Admin |
| `PUT` | `/api/admin/orders/:id/status` | Update order status | ✅ | Admin |
| `POST` | `/api/admin/orders/:id/cancel` | Cancel order | ✅ | Admin |
| `POST` | `/api/admin/orders/:id/refund` | Process refund | ✅ | Admin |
| `POST` | `/api/admin/orders/:id/ship` | Create shipment | ✅ | Admin |

### 18.5 Inventory Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/inventory` | List all inventory (paginated) | ✅ | Admin |
| `GET` | `/api/admin/inventory/low-stock` | Low stock items | ✅ | Admin |
| `GET` | `/api/admin/inventory/out-of-stock` | Out of stock items | ✅ | Admin |
| `PUT` | `/api/admin/inventory/:variantId/adjust` | Adjust stock | ✅ | Admin |
| `GET` | `/api/admin/inventory/:variantId/history` | Transaction history | ✅ | Admin |

```typescript
// PUT /api/admin/inventory/:variantId/adjust
// Request
{
  adjustment: number;        // +10 or -5
  type: "STOCK_ADDED" | "STOCK_DAMAGED" | "STOCK_ADJUSTED";
  reason: string;            // Required for audit
}

// Server-side:
// 1. Validate adjustment won't result in negative stock
// 2. Update inventory with row-level lock
// 3. Create InventoryTransaction
// 4. Create AuditLog entry
```

### 18.6 Customer Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/customers` | List customers (paginated) | ✅ | Admin |
| `GET` | `/api/admin/customers/:id` | Customer detail + orders | ✅ | Admin |
| `PUT` | `/api/admin/customers/:id/status` | Activate/deactivate | ✅ | Admin |

### 18.7 Coupon Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/coupons` | List coupons | ✅ | Admin |
| `POST` | `/api/admin/coupons` | Create coupon | ✅ | Admin |
| `GET` | `/api/admin/coupons/:id` | Coupon detail + usage | ✅ | Admin |
| `PUT` | `/api/admin/coupons/:id` | Update coupon | ✅ | Admin |
| `DELETE` | `/api/admin/coupons/:id` | Deactivate coupon | ✅ | Admin |

### 18.8 Review Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/reviews` | List reviews (filtered) | ✅ | Admin |
| `PUT` | `/api/admin/reviews/:id/approve` | Approve review | ✅ | Admin |
| `PUT` | `/api/admin/reviews/:id/hide` | Hide review | ✅ | Admin |
| `DELETE` | `/api/admin/reviews/:id` | Delete review | ✅ | Admin |

### 18.9 Content Management

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/banners` | List banners | ✅ | Admin |
| `POST` | `/api/admin/banners` | Create banner | ✅ | Admin |
| `PUT` | `/api/admin/banners/:id` | Update banner | ✅ | Admin |
| `DELETE` | `/api/admin/banners/:id` | Delete banner | ✅ | Admin |
| `GET` | `/api/admin/collections` | List collections | ✅ | Admin |
| `POST` | `/api/admin/collections` | Create collection | ✅ | Admin |
| `PUT` | `/api/admin/collections/:id` | Update collection | ✅ | Admin |
| `DELETE` | `/api/admin/collections/:id` | Delete collection | ✅ | Admin |
| `POST` | `/api/admin/collections/:id/products` | Add products to collection | ✅ | Admin |
| `DELETE` | `/api/admin/collections/:id/products/:pid` | Remove product from collection | ✅ | Admin |

### 18.10 Analytics

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/admin/analytics/revenue` | Revenue analytics | ✅ | Admin |
| `GET` | `/api/admin/analytics/orders` | Order analytics | ✅ | Admin |
| `GET` | `/api/admin/analytics/products` | Product performance | ✅ | Admin |
| `GET` | `/api/admin/analytics/customers` | Customer analytics | ✅ | Admin |
| `GET` | `/api/admin/analytics/conversion` | Conversion funnel | ✅ | Admin |

---

## 19. Notification APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `GET` | `/api/notifications` | List notifications (paginated) | ✅ | Any |
| `PUT` | `/api/notifications/:id/read` | Mark as read | ✅ | Any |
| `PUT` | `/api/notifications/read-all` | Mark all as read | ✅ | Any |
| `GET` | `/api/notifications/unread-count` | Get unread count | ✅ | Any |

---

## 20. Shipping APIs

| Method | Path | Description | Auth | Role |
|--------|------|-------------|------|------|
| `POST` | `/api/shipping/check-availability` | Check delivery availability | ❌ | — |
| `GET` | `/api/shipping/track/:trackingId` | Track shipment | ✅ | Customer |
| `GET` | `/api/shipping/methods` | Available shipping methods | ❌ | — |

```typescript
// POST /api/shipping/check-availability
// Request
{
  postalCode: string;
}

// Response
{
  success: true,
  data: {
    available: true,
    estimatedDays: 3-5,
    methods: [
      { id: "standard", name: "Standard Delivery", cost: 99, days: "5-7" },
      { id: "express", name: "Express Delivery", cost: 199, days: "2-3" }
    ],
    codAvailable: true
  }
}
```

---

## 21. API Endpoint Summary

| Domain | Endpoints | Auth Required |
|--------|-----------|---------------|
| Authentication | 8 | Mixed |
| User | 8 | Yes |
| Products (Public) | 7 | No |
| Categories | 3 | No |
| Search | 3 | No |
| Cart | 5 | Yes |
| Wishlist | 4 | Yes |
| Checkout | 5 | Yes |
| Orders | 5 | Yes |
| Payments | 3 | Mixed |
| Reviews | 3 | Yes |
| Notifications | 4 | Yes |
| Shipping | 3 | Mixed |
| Admin Dashboard | 5 | Yes (Admin) |
| Admin Products | 11 | Yes (Admin) |
| Admin Categories | 7 | Yes (Admin) |
| Admin Orders | 6 | Yes (Admin) |
| Admin Inventory | 5 | Yes (Admin) |
| Admin Customers | 3 | Yes (Admin) |
| Admin Coupons | 5 | Yes (Admin) |
| Admin Reviews | 4 | Yes (Admin) |
| Admin Content | 10 | Yes (Admin) |
| Admin Analytics | 5 | Yes (Admin) |
| **Total** | **~127** | |

---

## 22. Security Checklist for APIs

- [ ] Every endpoint validates input with Zod
- [ ] Every authenticated endpoint checks session
- [ ] Every admin endpoint checks RBAC permissions
- [ ] Cart/checkout never accepts client-side prices
- [ ] Payment verification uses cryptographic signatures
- [ ] Webhook handler verifies Razorpay signature
- [ ] Rate limiting on all endpoints
- [ ] No stack traces in production errors
- [ ] No internal IDs leaked in error messages
- [ ] Inventory operations use database transactions
- [ ] Payment operations are idempotent
- [ ] File uploads validated (type, size, count)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React auto-escaping + CSP)
- [ ] CSRF tokens on state-changing operations

---

*This API design document serves as the contract between frontend and backend. All endpoints must be implemented with proper validation, authentication, authorization, and error handling as specified.*
