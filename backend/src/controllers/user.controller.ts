import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/users — paginated + searchable customer list (ADMIN only)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const q = String(req.query.q || '').trim();

    const where = {
      roles: { none: { role: { name: 'ADMIN' } } },
      ...(q && {
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
        ],
      }),
    };

    const [users, total, orderAgg] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
      prisma.order.groupBy({
        by: ['userId'],
        _count: true,
        _sum: { total: true },
      }),
    ]);

    const aggByUser = new Map(
      orderAgg.map((o) => [o.userId, { orders: o._count, spent: Number(o._sum.total || 0) }])
    );

    const data = users.map((u) => ({
      ...u,
      orders: aggByUser.get(u.id)?.orders || 0,
      spent: aggByUser.get(u.id)?.spent || 0,
    }));

    res.json({
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch customers' } });
  }
};
