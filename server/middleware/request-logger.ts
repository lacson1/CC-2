import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Request logging configuration
 */
interface LoggerConfig {
  /** Include request body in logs (careful with sensitive data) */
  includeBody?: boolean;
  /** Include response body in logs (careful with large payloads) */
  includeResponse?: boolean;
  /** Maximum body length to log */
  maxBodyLength?: number;
  /** Paths to exclude from logging */
  excludePaths?: string[];
  /** Only log requests slower than this threshold (ms) */
  slowRequestThreshold?: number;
  /** Log level: 'minimal' | 'standard' | 'verbose' */
  level?: 'minimal' | 'standard' | 'verbose';
}

const defaultConfig: LoggerConfig = {
  includeBody: false,
  includeResponse: false,
  maxBodyLength: 1000,
  excludePaths: ['/api/health', '/api/docs'],
  slowRequestThreshold: 0,
  level: 'standard',
};

/**
 * Sanitize sensitive data from objects
 */
function sanitizeData(data: any, maxLength: number = 1000): any {
  if (!data) return data;
  
  const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'cookie', 'apiKey'];
  
  if (typeof data === 'string') {
    return data.length > maxLength ? data.substring(0, maxLength) + '...' : data;
  }
  
  if (typeof data === 'object') {
    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value, maxLength);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  return data;
}

/**
 * Format duration for logging
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

/**
 * Get color code for status
 */
function getStatusColor(status: number): string {
  if (status >= 500) return '\x1b[31m'; // Red
  if (status >= 400) return '\x1b[33m'; // Yellow
  if (status >= 300) return '\x1b[36m'; // Cyan
  return '\x1b[32m'; // Green
}

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

/**
 * Request logging middleware
 * Logs incoming requests and outgoing responses with timing
 */
export function requestLogger(config: LoggerConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip excluded paths
    if (mergedConfig.excludePaths?.some(path => req.path.startsWith(path))) {
      return next();
    }
    
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    // Attach request ID for correlation
    (req as any).requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    
    // Capture response body if needed
    let responseBody: any;
    if (mergedConfig.includeResponse) {
      const originalJson = res.json.bind(res);
      res.json = function(body: any) {
        responseBody = body;
        return originalJson(body);
      };
    }
    
    // Log on response finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      // Skip if below slow request threshold
      if (mergedConfig.slowRequestThreshold && duration < mergedConfig.slowRequestThreshold) {
        return;
      }
      
      const authReq = req as AuthRequest;
      const user = authReq.user;
      const statusColor = getStatusColor(res.statusCode);
      
      // Build log entry
      const logEntry: any = {
        requestId,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
      };
      
      // Add user info if authenticated
      if (user) {
        logEntry.userId = user.id;
        logEntry.username = user.username;
        logEntry.role = user.role;
        logEntry.organizationId = user.organizationId;
      }
      
      // Add query params for standard/verbose
      if (mergedConfig.level !== 'minimal' && Object.keys(req.query).length > 0) {
        logEntry.query = sanitizeData(req.query, mergedConfig.maxBodyLength);
      }
      
      // Add request body for verbose
      if (mergedConfig.level === 'verbose' && mergedConfig.includeBody && req.body) {
        logEntry.requestBody = sanitizeData(req.body, mergedConfig.maxBodyLength);
      }
      
      // Add response body for verbose
      if (mergedConfig.level === 'verbose' && mergedConfig.includeResponse && responseBody) {
        logEntry.responseBody = sanitizeData(responseBody, mergedConfig.maxBodyLength);
      }
      
      // Add IP and user agent for standard/verbose
      if (mergedConfig.level !== 'minimal') {
        logEntry.ip = req.ip || req.socket.remoteAddress;
        logEntry.userAgent = req.get('User-Agent');
      }
      
      // Console output
      const userStr = user ? `${DIM}[${user.username}]${RESET}` : '';
      const durationStr = duration > 1000 ? `${BOLD}${formatDuration(duration)}${RESET}` : `${DIM}${formatDuration(duration)}${RESET}`;
      
      console.log(
        `${DIM}[${logEntry.timestamp.split('T')[1].split('.')[0]}]${RESET} ` +
        `${statusColor}${req.method}${RESET} ${req.path} ` +
        `${statusColor}${res.statusCode}${RESET} ` +
        `${durationStr} ` +
        `${userStr}`
      );
      
      // Log slow requests as warnings
      if (duration > 3000) {
        console.warn(`⚠️  Slow request detected: ${req.method} ${req.path} took ${formatDuration(duration)}`);
      }
      
      // Log errors in detail
      if (res.statusCode >= 500) {
        console.error('❌ Server Error:', JSON.stringify(logEntry, null, 2));
      } else if (res.statusCode >= 400 && mergedConfig.level === 'verbose') {
        console.warn('⚠️  Client Error:', JSON.stringify(logEntry, null, 2));
      }
    });
    
    next();
  };
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Development-friendly logger with colors and formatting
 */
export const devLogger = requestLogger({
  level: 'standard',
  includeBody: false,
  includeResponse: false,
  excludePaths: ['/api/health', '/api/docs', '/_vite'],
});

/**
 * Production logger - minimal output
 */
export const prodLogger = requestLogger({
  level: 'minimal',
  includeBody: false,
  includeResponse: false,
  slowRequestThreshold: 1000, // Only log requests slower than 1s
});

/**
 * Debug logger - verbose output for troubleshooting
 */
export const debugLogger = requestLogger({
  level: 'verbose',
  includeBody: true,
  includeResponse: true,
  maxBodyLength: 2000,
});

export default requestLogger;

