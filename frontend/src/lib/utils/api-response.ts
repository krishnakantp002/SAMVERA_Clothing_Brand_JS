// ============================================
// SAMVERA — API Response Helpers
// ============================================

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  AppError,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type PaginationMeta,
} from '@/types/api';

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: PaginationMeta
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };
  return NextResponse.json(body, { status });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  return NextResponse.json(body, { status });
}

/**
 * Handle any error and return appropriate API response
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Known application errors
  if (error instanceof AppError) {
    return errorResponse(
      error.message,
      error.statusCode,
      error.code,
      error.details
    );
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const field = issue.path.join('.');
      if (!details[field]) details[field] = [];
      details[field].push(issue.message);
    }
    return errorResponse(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      details
    );
  }

  // Prisma known errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] ?? 'field';
      return errorResponse(
        `A record with this ${field} already exists`,
        409,
        'CONFLICT'
      );
    }
    if (prismaError.code === 'P2025') {
      return errorResponse('Record not found', 404, 'NOT_FOUND');
    }
  }

  // Unknown errors — don't leak details in production
  console.error('[API Error]', error);
  return errorResponse(
    process.env.NODE_ENV === 'development'
      ? String(error)
      : 'An unexpected error occurred',
    500,
    'INTERNAL_ERROR'
  );
}

/**
 * Build pagination meta from query results
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
