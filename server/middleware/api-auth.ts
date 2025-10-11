import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { apiKeys } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export interface ApiAuthRequest extends Request {
  apiKey?: {
    id: number;
    organizationId: number;
    permissions: string[];
    rateLimit: number;
  };
}

// Rate limiting cache (in production, use Redis)
const rateLimitCache = new Map<number, { count: number; resetAt: Date }>();

export async function authenticateApiKey(
  req: ApiAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKeyHeader = req.headers['x-api-key'] as string;

    if (!apiKeyHeader) {
      return res.status(401).json({
        error: "API key required",
        message: "Please provide an API key in the X-API-Key header"
      });
    }

    // Hash the provided key to compare with stored hash
    const hashedKey = crypto
      .createHash('sha256')
      .update(apiKeyHeader)
      .digest('hex');

    // Find API key in database
    const [apiKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, hashedKey))
      .limit(1);

    if (!apiKey) {
      return res.status(401).json({
        error: "Invalid API key",
        message: "The provided API key is not valid"
      });
    }

    // Check if key is active
    if (!apiKey.isActive) {
      return res.status(401).json({
        error: "Inactive API key",
        message: "This API key has been deactivated"
      });
    }

    // Check if key has expired
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      return res.status(401).json({
        error: "Expired API key",
        message: "This API key has expired"
      });
    }

    // Rate limiting
    const now = new Date();
    const rateLimit = rateLimitCache.get(apiKey.id);

    if (rateLimit) {
      if (now > rateLimit.resetAt) {
        // Reset the counter
        rateLimitCache.set(apiKey.id, {
          count: 1,
          resetAt: new Date(now.getTime() + 60 * 60 * 1000) // 1 hour
        });
      } else {
        // Increment counter
        rateLimit.count++;
        if (rateLimit.count > (apiKey.rateLimit || 1000)) {
          return res.status(429).json({
            error: "Rate limit exceeded",
            message: `You have exceeded the rate limit of ${apiKey.rateLimit} requests per hour`,
            resetAt: rateLimit.resetAt
          });
        }
      }
    } else {
      // Initialize rate limit
      rateLimitCache.set(apiKey.id, {
        count: 1,
        resetAt: new Date(now.getTime() + 60 * 60 * 1000)
      });
    }

    // Update last used timestamp (async, don't wait)
    db.update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, apiKey.id))
      .execute()
      .catch(err => console.error('Failed to update last used:', err));

    // Attach API key info to request
    req.apiKey = {
      id: apiKey.id,
      organizationId: apiKey.organizationId,
      permissions: (apiKey.permissions as string[]) || [],
      rateLimit: apiKey.rateLimit || 1000
    };

    next();
  } catch (error) {
    console.error('API authentication error:', error);
    return res.status(500).json({
      error: "Authentication error",
      message: "Failed to authenticate API key"
    });
  }
}

// Helper middleware to check specific permissions
export function requireApiPermission(...requiredPermissions: string[]) {
  return (req: ApiAuthRequest, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(401).json({
        error: "Not authenticated",
        message: "API key authentication required"
      });
    }

    const { permissions } = req.apiKey;

    // If permissions array is empty or contains '*', allow all
    if (permissions.length === 0 || permissions.includes('*')) {
      return next();
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(perm => 
      permissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: "Insufficient permissions",
        message: `This API key does not have the required permissions: ${requiredPermissions.join(', ')}`
      });
    }

    next();
  };
}
