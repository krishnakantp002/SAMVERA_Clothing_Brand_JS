import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Full system access' }
  });
  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Regular customer' }
  });

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@samvera.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@samvera.com',
      password: hashedPassword,
      isActive: true,
      roles: {
        create: [{ roleId: adminRole.id }]
      }
    }
  });

  // 3. Create Categories
  const tshirtsCat = await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: { name: 'T-Shirts', slug: 't-shirts', displayOrder: 1 }
  });
  
  const oversizedCat = await prisma.category.upsert({
    where: { slug: 'oversized-t-shirts' },
    update: {},
    create: { name: 'Oversized T-Shirts', slug: 'oversized-t-shirts', displayOrder: 2 }
  });

  const hoodiesCat = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Hoodies', slug: 'hoodies', displayOrder: 3 }
  });

  // 4. Create Sizes & Colors
  const sizeS = await prisma.size.upsert({ where: { name: 'S' }, update: {}, create: { name: 'S' } });
  const sizeM = await prisma.size.upsert({ where: { name: 'M' }, update: {}, create: { name: 'M' } });
  const sizeL = await prisma.size.upsert({ where: { name: 'L' }, update: {}, create: { name: 'L' } });
  const sizeXL = await prisma.size.upsert({ where: { name: 'XL' }, update: {}, create: { name: 'XL' } });

  const colorBlack = await prisma.color.upsert({ where: { name: 'Black' }, update: {}, create: { name: 'Black', hexCode: '#000000' } });
  const colorWhite = await prisma.color.upsert({ where: { name: 'White' }, update: {}, create: { name: 'White', hexCode: '#FFFFFF' } });
  const colorOlive = await prisma.color.upsert({ where: { name: 'Olive Green' }, update: {}, create: { name: 'Olive Green', hexCode: '#556B2F' } });

  // 5. Create Mock Products
  console.log('📦 Creating products...');
  
  const products = [
    {
      name: 'Essential Premium Tee',
      slug: 'essential-premium-tee',
      category: tshirtsCat.id,
      price: 799,
      comparePrice: 1299,
      desc: 'The perfect everyday t-shirt crafted from 100% premium combed cotton. Features a tailored fit that flatters the physique while offering all-day comfort.',
      isNew: false,
      isBest: true,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Oversized Streetwear Drop',
      slug: 'oversized-streetwear-drop',
      category: oversizedCat.id,
      price: 999,
      comparePrice: 1499,
      desc: 'Drop shoulder oversized fit with heavyweight 240 GSM cotton. Built for the streets with maximum durability and structure.',
      isNew: true,
      isBest: false,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Signature Heavyweight Hoodie',
      slug: 'signature-heavyweight-hoodie',
      category: hoodiesCat.id,
      price: 1899,
      comparePrice: 2499,
      desc: 'Stay warm in style. Our 350 GSM fleece-lined hoodie features a structured hood, dropped shoulders, and a kangaroo pocket. Premium aglets and drawstrings complete the look.',
      isNew: true,
      isBest: true,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Minimalist Crewneck Tee',
      slug: 'minimalist-crewneck-tee',
      category: tshirtsCat.id,
      price: 699,
      comparePrice: null,
      desc: 'A wardrobe staple. Clean, simple, and perfectly cut. Supima cotton blend ensures it stays soft wash after wash.',
      isNew: false,
      isBest: false,
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          categoryId: p.category,
          basePrice: p.price,
          compareAtPrice: p.comparePrice,
          description: p.desc,
          shortDescription: p.desc.substring(0, 50) + '...',
          isNewArrival: p.isNew,
          isBestSeller: p.isBest,
          status: 'ACTIVE',
          metaTitle: p.name,
          metaDescription: p.desc.substring(0, 150),
          metaKeywords: [],
          images: {
            create: [
              { url: p.image, altText: p.name, isPrimary: true, displayOrder: 1 },
              // Dummy secondary image
              { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', altText: p.name + ' Detail', isPrimary: false, displayOrder: 2 }
            ]
          }
        }
      });

      // Create variants (M, L for Black and White)
      const variants = [
        { sizeId: sizeM.id, colorId: colorBlack.id, sku: `${p.slug}-M-BLK` },
        { sizeId: sizeL.id, colorId: colorBlack.id, sku: `${p.slug}-L-BLK` },
        { sizeId: sizeM.id, colorId: colorWhite.id, sku: `${p.slug}-M-WHT` },
      ];

      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sizeId: v.sizeId,
            colorId: v.colorId,
            sku: v.sku,
            price: p.price,
            inventory: {
              create: {
                totalStock: 50,
                lowStockThreshold: 10
              }
            }
          }
        });
      }
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
