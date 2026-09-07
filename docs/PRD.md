# SAMVERA — Product Requirements Document

> **Version:** 1.0  
> **Date:** September 2026  
> **Status:** Draft  
> **Author:** Engineering Team

---

## 1. Executive Summary

**SAMVERA** is a full-stack men's fashion & lifestyle essentials e-commerce platform. It aims to deliver a premium, modern, and trustworthy shopping experience for men's clothing and grooming products in the Indian market.

The platform consists of a **customer-facing storefront** and an **admin dashboard**, built on a modern Next.js full-stack architecture with PostgreSQL, designed to scale from a small brand into a large e-commerce operation without requiring a rewrite.

### Key Differentiators
- Premium, minimal UI that avoids generic template aesthetics
- Mobile-first, conversion-focused design
- Production-grade architecture with real security, payments, and inventory
- Animated, aesthetic user experience with smooth interactions

---

## 2. Product Vision & Goals

### Vision
Build SAMVERA as the go-to online destination for men's fashion essentials — a brand that feels premium, trustworthy, and effortless to shop from.

### Goals

| Goal | Metric | Target |
|------|--------|--------|
| Fast page loads | LCP | < 2.5s |
| Mobile conversion | Conversion rate | > 2% |
| Cart abandonment | Abandonment rate | < 65% |
| Customer retention | Repeat purchase rate | > 25% within 90 days |
| SEO visibility | Organic traffic | Top 3 for brand keywords |
| Accessibility | WCAG compliance | AA level |

### Design Principles
- **Modern** — Contemporary UI patterns, smooth animations
- **Minimal** — Clean layouts, purposeful whitespace
- **Premium** — High-quality imagery, refined typography
- **Fast** — Optimized loading, instant interactions
- **Mobile-first** — Designed for thumb-friendly mobile browsing
- **Conversion-focused** — Clear CTAs, streamlined checkout
- **Accessible** — Usable by everyone
- **Production-ready** — Real security, real payments, real inventory

---

## 3. Target Audience

### Primary Persona
- **Age:** 18–35 years
- **Gender:** Male
- **Location:** India (Tier 1 & Tier 2 cities)
- **Income:** Middle to upper-middle class
- **Behavior:** Fashion-conscious, values quality over quantity, shops primarily on mobile
- **Motivation:** Looking for trendy, well-fitted, affordable premium essentials

### Secondary Persona
- **Gift shoppers** — Women/partners shopping for men
- **Bulk buyers** — Customers looking for combos and bundles

---

## 4. Product Categories

| Category | Examples |
|----------|---------|
| T-Shirts | Solid, printed, graphic tees |
| Oversized T-Shirts | Drop shoulder, boxy fit, streetwear |
| Shirts | Casual, semi-formal, linen |
| Hoodies | Pullover, zip-up, oversized |
| Sweatshirts | Crewneck, graphic, minimal |
| Bottomwear | Joggers, cargo pants, shorts, trousers |
| Innerwear | Boxers, briefs, vests |
| Accessories | Caps, socks, belts, wallets |
| Grooming / Men's Essentials | Skincare, fragrance, grooming kits |
| Combo / Bundle Products | Multi-pack tees, mix & match bundles |

---

## 5. User Roles

### Initial Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor | Browse, search, view products |
| **Customer** | Registered user | All guest + cart, wishlist, checkout, orders, reviews, account |
| **Admin** | Platform administrator | Full access to admin dashboard, product/order/inventory management |

### Future Roles (RBAC-ready)

| Role | Description |
|------|-------------|
| Super Admin | Full system access + user role management |
| Inventory Manager | Inventory & stock management |
| Order Manager | Order processing & fulfillment |
| Content Manager | Banners, collections, marketing content |
| Customer Support | Order lookup, customer queries |

Architecture uses **Role-Based Access Control (RBAC)** with a `Role → Permission` mapping, not hardcoded checks.

---

## 6. User Journeys

### Journey 1: Guest → Registration → First Purchase

```
Visit homepage
  → Browse featured products / categories
  → View product details
  → Select size & color
  → Prompted to register/login
  → Register (email/password)
  → Verify email
  → Add to cart
  → Proceed to checkout
  → Enter shipping address
  → Select shipping method
  → Apply coupon (optional)
  → Review order summary
  → Pay via Razorpay (UPI/Card/Wallet)
  → Payment verified via webhook
  → Order confirmation page
  → Receive confirmation email
```

### Journey 2: Returning Customer → Quick Purchase

```
Visit homepage
  → Login
  → Search for product
  → View product details
  → Add to cart
  → Checkout with saved address
  → Pay
  → Order confirmed
  → Track order from account
```

### Journey 3: Customer → Wishlist → Purchase

```
Browse products
  → Add multiple items to wishlist
  → Return later
  → Open wishlist
  → Move item to cart
  → Checkout
```

### Journey 4: Customer → Order Return

```
Go to account → orders
  → View order details
  → Request return (within return window)
  → Return approved
  → Ship product back
  → Refund processed
```

### Journey 5: Admin → Daily Operations

```
Login to admin
  → View dashboard (revenue, orders, low stock)
  → Process pending orders (confirm → pack → ship)
  → Add new products with variants
  → Adjust inventory
  → Create promotional coupon
  → Review and approve customer reviews
  → Check analytics
```

---

## 7. Functional Requirements

### FR-01: Customer Storefront
- Responsive homepage with hero, categories, product sections
- Product listing pages with filters, sorting, pagination
- Product detail pages with variants, gallery, reviews
- SEO-friendly URLs (`/products/oversized-black-tshirt`)

### FR-02: Authentication System
- Email/password registration with validation
- Secure login with session management
- Email verification flow
- Forgot/reset password flow
- Secure password hashing (bcrypt/argon2)
- HTTP-only secure cookies

### FR-03: Product & Catalog Management
- Products with variants (size × color = SKU)
- SKU-level pricing and inventory
- Product images (multiple per product/variant)
- Categories and subcategories
- Brand management
- Product status (Draft / Active / Archived)
- Featured, New Arrival, Best Seller flags

### FR-04: Search & Discovery
- Keyword search with suggestions
- Autocomplete
- Filters: category, price range, size, color, brand, rating, discount, availability
- Sorting: relevance, newest, price (asc/desc), rating, popularity
- Paginated results

### FR-05: Cart System
- Add/remove/update items
- Variant selection
- Quantity management with stock validation
- **Server-side price calculation** (never trust client prices)
- Subtotal, discount, shipping, tax, grand total
- Stock re-validation on every cart action

### FR-06: Wishlist
- Add/remove products
- Move to cart
- Handle unavailable products gracefully

### FR-07: Checkout
- Multi-step: Address → Shipping → Coupon → Summary → Payment → Confirmation
- Address management (new or saved)
- Shipping method selection
- Coupon application (server-validated)
- Server-side total calculation
- Order address snapshot (not reference)

### FR-08: Payment Processing
- **Razorpay** integration
- Supported methods: UPI, Cards, Net Banking, Wallets, COD
- Server-side order creation
- Webhook-based payment verification
- Idempotent payment processing
- Handle: success, failure, pending, timeout, duplicate callbacks
- Refund support

### FR-09: Order Management
- Order creation with inventory reservation
- Order states: Pending → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered
- Cancellation flow
- Return/refund flow
- Status history tracking
- Order number generation

### FR-10: Inventory Management
- SKU/variant-level tracking
- Total Stock / Reserved Stock / Available Stock
- InventoryTransaction audit trail
- Concurrency-safe stock operations
- Low stock alerts
- Prevent overselling

### FR-11: Shipping Management
- Abstraction layer (provider-agnostic)
- Shipment creation
- Tracking integration
- Future providers: Shiprocket, Delhivery, Blue Dart

### FR-12: Coupon & Discount System
- Percentage and flat discounts
- Min order amount, max discount cap
- Expiry dates, usage limits, per-user limits
- Category/product restrictions
- Server-side validation only

### FR-13: Reviews & Ratings
- Star ratings (1–5)
- Text reviews with optional images
- Verified purchase badge
- Admin moderation (approve/hide/delete)

### FR-14: Customer Account
- Profile management
- Address book
- Order history with tracking
- Wishlist
- Review history
- Coupon wallet

### FR-15: Admin Dashboard
- Revenue, orders, customers, products overview
- Charts: revenue over time, orders over time, category sales
- Top products, top categories
- Conversion rate, average order value

### FR-16: Admin Management
- Product CRUD with variant management
- Order processing & fulfillment
- Inventory adjustments with audit logs
- Customer management
- Coupon management
- Review moderation
- Content management (banners, collections)

### FR-17: Analytics
- Event tracking: page view, product view, add to cart, checkout, purchase
- Conversion funnel
- Revenue analytics
- Product performance
- Customer analytics

### FR-18: Notifications
- Email: order confirmation, payment receipt, shipping update, delivery, password reset
- Architecture ready for SMS, WhatsApp, push notifications
- Notification service abstraction

### FR-19: Security
- Input validation (Zod schemas)
- Server-side authorization on every endpoint
- Rate limiting
- CSRF protection
- Secure cookie handling
- Audit logging for admin actions
- No secrets exposed to client

### FR-20: SEO
- Dynamic metadata per page
- Open Graph tags
- Canonical URLs
- XML sitemap
- robots.txt
- Product structured data (JSON-LD)
- Breadcrumb structured data

### FR-21: Testing
- Unit tests: price calculation, discounts, inventory logic
- Integration tests: auth, cart, checkout, orders, payments
- E2E tests: full purchase flow, admin operations
- Edge case tests: concurrent purchases, webhook duplicates, stock races

---

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| **Availability** | 99.9% uptime |
| **Security** | OWASP Top 10 protection |
| **Scalability** | Handle 10K concurrent users |
| **Accessibility** | WCAG 2.1 AA |
| **Responsive** | 320px – 1440px+ |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **SEO** | Core Web Vitals pass, structured data |
| **Data Integrity** | Transactional operations, no partial state |
| **Observability** | Structured logging, error tracking, metrics |

---

## 9. MVP Scope

### ✅ MVP — Must Have

**Customer Features:**
- Registration / Login / Logout
- Homepage with hero, categories, products
- Product catalog with filters & sorting
- Product detail pages with variants
- Search
- Cart with server-side validation
- Wishlist
- Checkout flow
- Razorpay payment integration
- Order placement & history
- Customer account (profile, addresses, orders)

**Admin Features:**
- Admin login (protected)
- Dashboard with key metrics
- Product management (CRUD + variants)
- Category management
- Inventory management
- Order management
- Customer management
- Coupon management

**Infrastructure:**
- PostgreSQL + Prisma
- Authentication + RBAC
- Razorpay integration
- Image storage
- Input validation (Zod)
- Security fundamentals
- Structured logging
- Core test suite
- Deployment pipeline

### ❌ Post-MVP — Future Phases

- AI shopping assistant
- Natural language search
- Outfit recommendations
- Size recommendation engine
- Personalized product recommendations
- Loyalty / referral system
- Subscription boxes
- Multi-language support
- Multi-currency support
- Mobile app (React Native)
- Advanced analytics dashboard
- A/B testing framework

---

## 10. Success Metrics

| Metric | Definition | MVP Target |
|--------|-----------|------------|
| Conversion Rate | Orders / Unique Visitors | > 2% |
| Cart Abandonment | Carts created but not completed | < 65% |
| Average Order Value | Total Revenue / Total Orders | > ₹1,200 |
| Page Load Time | Largest Contentful Paint | < 2.5s |
| Mobile Usability | Google Mobile-Friendly score | Pass |
| Customer Satisfaction | Post-purchase rating | > 4.2/5 |
| Return Rate | Returns / Total Orders | < 8% |
| Repeat Purchase Rate | Returning customers within 90 days | > 25% |

---

## 11. Constraints & Assumptions

### Constraints
- **Market:** India-focused (INR pricing, Indian payment methods)
- **Payment:** Razorpay as primary gateway
- **Database:** PostgreSQL (managed, e.g., Supabase, Neon, AWS RDS)
- **Framework:** Next.js full-stack
- **Architecture:** Modular monolith (no premature microservices)
- **Budget:** Optimize for cost-effective hosting (Vercel + managed DB)

### Assumptions
- Users primarily access via mobile (60%+ traffic)
- Product catalog starts at < 500 products, growing to 5,000+
- Order volume starts at < 100/day, growing to 1,000+/day
- Single warehouse/fulfillment initially
- English language only for MVP

---

## 12. Future Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Core e-commerce (above) | Phase 0–14 |
| **v1.1** | Reviews, security hardening, performance | Phase 15–18 |
| **v1.2** | SEO, deployment, analytics | Phase 19–21 |
| **v2.0** | AI recommendations, personalization | Phase 22+ |
| **v2.1** | Loyalty program, referral system | Future |
| **v3.0** | Mobile app, multi-language | Future |

---

## 13. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Payment integration issues | High | Medium | Thorough Razorpay testing, webhook verification |
| Inventory race conditions | High | Medium | Database transactions, row-level locking |
| Security vulnerabilities | Critical | Medium | OWASP compliance, regular audits |
| Poor mobile performance | High | Low | Mobile-first design, performance budgets |
| Scalability bottlenecks | Medium | Low | Modular architecture, database indexing |
| Data loss | Critical | Low | Automated backups, transaction logs |

---

*This document will be updated as the project evolves through development phases.*
