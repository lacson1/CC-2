import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError, sendError, ErrorCodes } from '../lib/api-response';

/**
 * Global error handling middleware
 * Catches all errors and sends consistent API responses
 */

/**
 * Not Found handler - for routes that don't exist
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = ApiError.notFound(`Route ${req.method} ${req.path}`);
  sendError(res, error);
}

/**
 * Global error handler
 * Must have 4 parameters to be recognized as error middleware by Express
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err: Error | ApiError | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Global Error Handler:', {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    body: req.body,
    user: (req as any).user?.id,
  });

  // Already sent response - don't try to send another
  if (res.headersSent) {
    return next(err);
  }

  // Handle specific error types
  if (err instanceof ApiError) {
    sendError(res, err);
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.') || 'value';
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    }
    sendError(res, ApiError.validationError(formattedErrors));
    return;
  }

  // Handle database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        sendError(res, ApiError.conflict('A record with this value already exists'));
        return;
      case '23503': // Foreign key violation
        sendError(res, ApiError.badRequest('Referenced record does not exist'));
        return;
      case '23502': // Not null violation
        sendError(res, ApiError.badRequest(`Missing required field: ${err.column || 'unknown'}`));
        return;
      case '22P02': // Invalid text representation
        sendError(res, ApiError.badRequest('Invalid data format'));
        return;
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
        sendError(res, new ApiError(503, 'SERVICE_UNAVAILABLE', 'Database connection failed'));
        return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, ApiError.unauthorized('Invalid token'));
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, ApiError.unauthorized('Token expired'));
    return;
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, ApiError.badRequest('Invalid JSON in request body'));
    return;
  }

  // Handle payload too large
  if (err.type === 'entity.too.large') {
    sendError(res, new ApiError(413, 'BAD_REQUEST', 'Request payload too large'));
    return;
  }

  // Default to internal server error
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message || 'Unknown error';
  
  sendError(res, ApiError.internal(message));
};

/**
 * Async handler wrapper that automatically catches errors
 * and passes them to the error middleware
 */
export function asyncErrorHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: T, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Wrap all route handlers to catch async errors
 */
export function wrapAsync(fn: Function) {
  return function(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  notFoundHandler,
  globalErrorHandler,
  asyncErrorHandler,
  wrapAsync,
};

