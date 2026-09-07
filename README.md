# SAMVERA

> Premium Men's Fashion & Lifestyle Essentials — E-Commerce Platform

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Payments | Razorpay |
| Auth | Custom JWT + HTTP-only Cookies |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- npm

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd samvera
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL and other secrets

# 3. Generate Prisma client
npx prisma generate

# 4. Set up database
npx prisma migrate dev

# 5. Seed development data
npm run db:seed

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (storefront)/       # Customer-facing pages
│   ├── (auth)/             # Authentication pages
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # Design system primitives
│   ├── layout/             # Navbar, Footer, Sidebar
│   ├── product/            # Product components
│   └── ...
├── lib/                    # Core libraries
│   ├── db/                 # Prisma client
│   ├── validation/         # Zod schemas
│   └── utils/              # Utility functions
├── services/               # Business logic layer
├── repositories/           # Data access layer
├── types/                  # TypeScript definitions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── config/                 # Configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## Documentation

- [Product Requirements](./docs/PRD.md)
- [System Architecture](./docs/ARCHITECTURE.md)
- [Database Design](./docs/DATABASE.md)
- [API Design](./docs/API.md)

## License

Private — All Rights Reserved.
