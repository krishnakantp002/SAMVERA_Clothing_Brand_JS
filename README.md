# SAMVERA

E-commerce platform for premium men's fashion & lifestyle essentials.

## Features

**Storefront (customer-facing)**
- Product catalog with categories, brands, variants, and search/filtering
- Product reviews and customer Q&A
- Cart, wishlist, and smooth checkout flow
- User accounts with order history and saved addresses
- Light/dark mode

**Admin dashboard**
- Product, order, inventory, and coupon management
- Customer management
- Q&A moderation
- Banner management and store settings

**Backend (REST API)**
- JWT auth with HTTP-only cookies
- Razorpay payment integration
- Image uploads (Cloudinary + local static serving)

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js (App Router), React 19, TypeScript |
| Styling   | Tailwind CSS v4, Framer Motion       |
| State     | Zustand                              |
| Forms     | React Hook Form + Zod                |
| Backend   | Node.js, Express, TypeScript         |
| Database  | Prisma ORM                           |
| Payments  | Razorpay                             |
| Uploads   | Multer + Cloudinary                  |

## Getting Started

```bash
# 1. Clone and install (npm workspaces monorepo)
npm install

# 2. Configure environment
#    backend/.env  and  frontend/.env.local with DATABASE_URL and secrets

# 3. Set up the database (from backend/)
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Run both apps in dev mode
npm run dev
```

- Storefront: http://localhost:3000
- API: http://localhost:5000

## Project Structure

```
backend/        Express API (controllers, routes, services, prisma)
frontend/       Next.js app
  src/app/(storefront)/   Customer-facing pages
  src/app/(admin)/        Admin dashboard
  src/app/(auth)/         Authentication pages
  src/components/         UI, layout, product components
  src/types/              Shared TypeScript types
```

## License

Private — All Rights Reserved.
