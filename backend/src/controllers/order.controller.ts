import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCheckoutOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    let userId = (req as any).user?.id;
    
    if (!userId) {
      let user = await prisma.user.findFirst({ where: { email: shippingAddress.email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            password: 'GUEST_USER',
          }
        });
      }
      userId = user.id;
    }

    let subtotal = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });
      
      if (!variant) {
        res.status(400).json({ success: false, error: { message: `Variant not found: ${item.variantId}` } });
        return;
      }
      
      const itemPrice = Number(variant.price);
      const totalItemPrice = itemPrice * item.quantity;
      subtotal += totalItemPrice;
      
      orderItemsData.push({
        variantId: variant.id,
        productId: variant.productId,
        productName: variant.product.name,
        variantName: variant.sku, // using sku as variant name fallback
        sku: variant.sku,
        quantity: item.quantity,
        price: itemPrice,
        total: totalItemPrice
      });
    }

    const shippingCost = subtotal > 999 ? 0 : 99;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'PENDING',
        subtotal,
        shippingCost,
        total,
        items: {
          create: orderItemsData
        },
        addresses: {
          create: {
            type: 'SHIPPING',
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            phone: shippingAddress.phone,
            addressLine1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.pincode,
            country: 'India'
          }
        },
        payment: {
          create: {
            method: paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'CARD',
            status: 'PENDING',
            amount: total,
            idempotencyKey: `IDMP-${Date.now()}`
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.total,
      }
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error during checkout' } });
  }
};
