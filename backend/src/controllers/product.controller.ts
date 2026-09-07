import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { searchSchema } from '../validation/schemas';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Basic implementation of search/filter
    const query = req.query;
    
    // In a real app we would strictly parse this with searchSchema
    // For now we'll do a basic implementation
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      deletedAt: null,
    };

    if (query.category) {
      where.category = { slug: String(query.category) };
    }
    
    if (query.filter === 'new-arrivals') {
      where.isNewArrival = true;
    }
    
    if (query.filter === 'best-sellers') {
      where.isBestSeller = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            include: { size: true, color: true }
          },
          images: {
            where: { isPrimary: true },
            take: 1
          },
          _count: {
            select: { reviews: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Transform to match frontend ProductCardData
    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      primaryImage: p.images[0]?.url || null,
      category: { name: p.category.name, slug: p.category.slug },
      rating: 4.5, // Mock rating for now
      reviewCount: p._count.reviews,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      variants: p.variants.map(v => ({
        id: v.id,
        size: { name: v.size.name },
        color: { name: v.color.name, hexCode: v.color.hexCode },
        price: Number(v.price),
        available: true // Mock availability
      }))
    }));

    res.status(200).json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug: slug as string, status: 'ACTIVE', deletedAt: null },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: {
          include: { 
            size: true, 
            color: true,
            inventory: true
          }
        },
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, avatar: true } } }
        }
      }
    });

    if (!product) {
      res.status(404).json({ success: false, error: { message: 'Product not found' } });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, categoryId, basePrice, compareAtPrice, description, isNewArrival, isBestSeller, primaryImage } = req.body;
    
    // Auto-generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        basePrice,
        compareAtPrice,
        description,
        shortDescription: description.substring(0, 100),
        isNewArrival: isNewArrival || false,
        isBestSeller: isBestSeller || false,
        status: 'ACTIVE',
        metaKeywords: [],
        images: {
          create: primaryImage ? [{ url: primaryImage, altText: name, isPrimary: true, displayOrder: 1 }] : []
        }
      }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to create product' } });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Instead of hard delete, we set status to ARCHIVED or delete if no relations exist
    // For safety, let's just do a soft delete via status
    await prisma.product.update({
      where: { id: id as string },
      data: { status: 'ARCHIVED' }
    });
    
    res.status(200).json({ success: true, data: { message: 'Product archived successfully' } });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to delete product' } });
  }
};
