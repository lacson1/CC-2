import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  passwordMinLength: number;
  requireSpecialChars: boolean;
  sessionTimeout: number; // in minutes
}

const config: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  passwordMinLength: 8,
  requireSpecialChars: true,
  sessionTimeout: 60
};

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export class SecurityManager {
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < config.passwordMinLength) {
      return { 
        valid: false, 
        message: `Password must be at least ${config.passwordMinLength} characters long` 
      };
    }

    if (config.requireSpecialChars) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return {
          valid: false,
          message: 'Password must contain uppercase, lowercase, numbers, and special characters'
        };
      }
    }

    return { valid: true };
  }

  static checkLoginAttempts(identifier: string): { allowed: boolean; message?: string } {
    const attempts = loginAttempts.get(identifier);
    
    if (!attempts) {
      return { allowed: true };
    }

    const now = new Date();
    const timeSinceLastAttempt = (now.getTime() - attempts.lastAttempt.getTime()) / (1000 * 60);

    // Reset attempts after lockout duration
    if (timeSinceLastAttempt > config.lockoutDuration) {
      loginAttempts.delete(identifier);
      return { allowed: true };
    }

    if (attempts.count >= config.maxLoginAttempts) {
      const remainingTime = Math.ceil(config.lockoutDuration - timeSinceLastAttempt);
      return {
        allowed: false,
        message: `Account locked. Try again in ${remainingTime} minutes.`
      };
    }

    return { allowed: true };
  }

  static recordLoginAttempt(identifier: string, success: boolean) {
    if (success) {
      loginAttempts.delete(identifier);
      return;
    }

    const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: new Date() };
    attempts.count += 1;
    attempts.lastAttempt = new Date();
    loginAttempts.set(identifier, attempts);
  }

  static async updateLastLogin(userId: number) {
    try {
      await db.update(users)
        .set({ 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  static generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static isSessionExpired(lastActivity: Date): boolean {
    const now = new Date();
    const timeSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    return timeSinceActivity > config.sessionTimeout;
  }
}

// Middleware to check session timeout
export const checkSessionTimeout = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.lastActivity) {
    const lastActivity = new Date(req.session.lastActivity);
    
    if (SecurityManager.isSessionExpired(lastActivity)) {
      req.session.destroy((err) => {
        if (err) console.error('Session destruction error:', err);
      });
      return res.status(401).json({ 
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }
  }

  // Update last activity
  if (req.session) {
    req.session.lastActivity = new Date();
  }

  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

export { config as securityConfig };