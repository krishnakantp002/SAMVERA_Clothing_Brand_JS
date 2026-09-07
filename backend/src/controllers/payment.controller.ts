import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

    if (!order || !order.payment) {
      res.status(404).json({ success: false, error: { message: 'Order or payment not found' } });
      return;
    }

    if (order.payment.status === 'SUCCESS') {
      res.status(400).json({ success: false, error: { message: 'Order is already paid' } });
      return;
    }

    const amount = Number(order.total) * 100;

    const rpOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_order_${order.id.slice(-8)}`,
      payment_capture: true,
    });

    await prisma.payment.update({
      where: { id: order.payment.id },
      data: { gatewayOrderId: rpOrder.id }
    });

    res.status(200).json({
      success: true,
      data: {
        id: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
      }
    });
  } catch (error: any) {
    console.error('Razorpay Order creation failed:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to create payment order' } });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      res.status(400).json({ success: false, error: { message: 'Invalid payment signature' } });
      return;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
    
    if (order && order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'SUCCESS',
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature
        }
      });
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' }
      });
    }

    res.status(200).json({ success: true, data: { message: 'Payment verified successfully' } });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error during verification' } });
  }
};
