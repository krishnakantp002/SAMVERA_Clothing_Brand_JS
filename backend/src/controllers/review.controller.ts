import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const reviews = await prisma.review.findMany({
      where: { productId, isHidden: false, isApproved: true }, // Usually we only show approved/visible reviews
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

// Create a review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const { rating, title, comment, images } = req.body;
    const userId = (req as any).user?.id; // from auth middleware

    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    // Verify if the user has purchased the item
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED' // Only allow reviews if they actually received it
        }
      }
    });

    const isVerified = !!hasPurchased;

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        title,
        comment,
        images: images || [],
        isVerified,
        isApproved: true, // For demo purposes, auto-approve reviews so user can see them immediately
        isHidden: false
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Failed to submit review' } });
  }
};
