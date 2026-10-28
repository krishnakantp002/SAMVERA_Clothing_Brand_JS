import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/stats/top-products — best sellers by units sold (ADMIN only)
export const getTopProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const take = Math.min(10, Number(req.query.limit) || 5);

    const grouped = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      where: { order: { status: { not: 'CANCELLED' } } },
      orderBy: { _sum: { quantity: 'desc' } },
      take,
    });

    const products = await prisma.product.findMany({
      where: { id: { in: grouped.map((g) => g.productId) }, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
    });

    const productById = new Map(products.map((p) => [p.id, p]));

    const data = grouped
      .filter((g) => productById.has(g.productId))
      .map((g) => {
        const product = productById.get(g.productId)!;
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url || null,
          unitsSold: Number(g._sum.quantity || 0),
        };
      });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch top products' } });
  }
};
