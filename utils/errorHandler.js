/**
 * Error Handler Utility
 * Centralized error handling untuk consistency
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Supabase errors
 */
export function handleSupabaseError(error) {
  console.error('[Supabase Error]', error);

  if (error.code === 'PGRST116') {
    return new AppError('Data tidak ditemukan', 404);
  }

  if (error.code === '23505') {
    return new AppError('Data sudah ada (duplicate)', 409);
  }

  if (error.code === '42501') {
    return new AppError('Akses ditolak', 403);
  }

  return new AppError(error.message || 'Terjadi kesalahan pada database', 500);
}

/**
 * Handle API errors
 */
export function handleApiError(error) {
  console.error('[API Error]', error);

  if (error.name === 'ValidationError') {
    return new AppError('Data tidak valid', 400);
  }

  if (error.name === 'UnauthorizedError') {
    return new AppError('Unauthorized', 401);
  }

  return new AppError(error.message || 'Terjadi kesalahan', 500);
}

/**
 * Format error untuk user
 */
export function formatErrorMessage(error) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak terduga';
}

/**
 * Log error untuk monitoring
 */
export function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
  };

  console.error('[Error Log]', errorLog);

  // Bisa dikirim ke service monitoring seperti Sentry
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  }
}

/**
 * Async error wrapper
 */
export function asyncHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { function: fn.name, args });
      throw handleApiError(error);
    }
  };
}
