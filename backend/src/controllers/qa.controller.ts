import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get public Q&A for a product
export const getProductQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const questions = await prisma.productQuestion.findMany({
      where: { productId, status: 'ANSWERED' },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

// User asks a question
export const askQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const { question, userName, userEmail } = req.body;
    const userId = (req as any).user?.id || null;

    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId,
        userId,
        userName,
        userEmail,
        question
      }
    });
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to submit question' } });
  }
};

// Admin gets all questions
export const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await prisma.productQuestion.findMany({
      include: {
        product: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch questions' } });
  }
};

// Admin answers a question
export const answerQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { answer } = req.body;

    const question = await prisma.productQuestion.update({
      where: { id },
      data: {
        answer,
        status: answer ? 'ANSWERED' : 'PENDING'
      }
    });
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to answer question' } });
  }
};
