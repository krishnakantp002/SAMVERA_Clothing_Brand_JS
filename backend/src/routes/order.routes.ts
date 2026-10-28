import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all orders for logged-in user
router.get('/my-orders', authenticate, async (req: any, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
      }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch user orders' } });
  }
});

// Get single order for logged-in user
router.get('/my-orders/:id', authenticate, async (req: any, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { 
        id: req.params.id as string,
        userId: req.user.id 
      },
      include: {
        items: true,
        addresses: true,
        payment: true,
      }
    });
    if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch order' } });
  }
});

// Get all orders for admin
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        payment: true,
      }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch orders' } });
  }
});

// Get single order for admin
router.get('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        items: true,
        addresses: true,
        payment: true,
      }
    });
    if (!order) return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch order' } });
  }
});

// Update order status
router.patch('/:id/status', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status }
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to update order status' } });
  }
});

export default router;
