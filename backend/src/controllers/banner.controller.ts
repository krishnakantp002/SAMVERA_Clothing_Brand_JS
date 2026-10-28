import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch banners' } });
  }
};

export const createOrUpdateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { position, imageUrl, title, subtitle } = req.body;
    
    // UPSERT pattern based on position since usually there's 1 hero, 1 promo, etc.
    // Or we can just use create if we support multiple. We'll support multiple and findFirst for edits or just create.
    
    // For simplicity, let's just find the first one for this position and update it, or create if it doesn't exist
    const existing = await prisma.banner.findFirst({ where: { position } });
    
    let banner;
    if (existing) {
      banner = await prisma.banner.update({
        where: { id: existing.id },
        data: { imageUrl, title, subtitle }
      });
    } else {
      banner = await prisma.banner.create({
        data: { position, imageUrl, title: title || 'Banner', subtitle }
      });
    }
    
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to save banner' } });
  }
};
