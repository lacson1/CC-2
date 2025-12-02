import session from 'express-session';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// SECURITY: Session secret from environment variable or generate secure default
let SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  // Generate a secure random secret if not provided
  SESSION_SECRET = crypto.randomBytes(64).toString('base64');
  console.warn('⚠️  WARNING: SESSION_SECRET not set. Generated temporary secret.');
  console.warn('   Sessions will not persist across server restarts.');
  console.warn('   Set SESSION_SECRET environment variable for production.');
}

// Use MemoryStore for development - faster and no DB issues
// In production, you should use a proper store like connect-pg-simple or connect-redis
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

let sessionStore: session.Store | undefined;

if (!isDevelopment && process.env.DATABASE_URL) {
  // Use PostgreSQL session store in production
  try {
    const connectPgSimple = require('connect-pg-simple');
    const PgSession = connectPgSimple(session);
    
    sessionStore = new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'user_sessions',
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15,
      errorLog: (err: Error) => {
        if (!err.message?.includes('already exists')) {
          console.error('Session store error:', err.message);
        }
      },
    });
    console.log('Using PostgreSQL session store');
  } catch (error) {
    console.warn('Failed to initialize PostgreSQL session store, falling back to MemoryStore');
    sessionStore = undefined;
  }
} else {
  console.log('Using in-memory session store (development mode)');
}

// Session configuration with environment-based security
export const sessionConfig = session({
  store: sessionStore, // Uses MemoryStore if sessionStore is undefined
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // SECURITY: Enable secure cookies in production (requires HTTPS)
    secure: isProduction,
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '2592000000', 10), // Default 30 days
    // SECURITY: Strict sameSite in production for CSRF protection
    sameSite: isProduction ? 'strict' : 'lax',
  },
  name: 'clinic.session.id',
});

// Session-based authentication middleware
export interface SessionRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    organizationId?: number;
    currentOrganizationId?: number;
  };
}

export const authenticateSession = (req: SessionRequest, res: Response, next: NextFunction) => {
  // Check for session-based authentication
  const sessionUser = (req.session as any)?.user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  req.user = {
    id: sessionUser.id,
    username: sessionUser.username,
    role: sessionUser.role,
    organizationId: sessionUser.organizationId,
    currentOrganizationId: sessionUser.currentOrganizationId || sessionUser.organizationId
  };
  
  next();
};
