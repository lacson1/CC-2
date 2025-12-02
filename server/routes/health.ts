import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { sendSuccess, sendError, ApiError } from '../lib/api-response';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  services: {
    database: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      responseTime: number;
      message?: string;
    };
    memory: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * GET /api/health
 * Basic health check - returns 200 if server is running
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with database status and memory info
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        status: 'healthy',
        responseTime: 0,
      },
      memory: {
        status: 'healthy',
        used: 0,
        total: 0,
        percentage: 0,
      },
    },
  };

  // Check database connection
  try {
    const dbStartTime = Date.now();
    await db.execute(sql`SELECT 1`);
    health.services.database.responseTime = Date.now() - dbStartTime;
    
    if (health.services.database.responseTime > 1000) {
      health.services.database.status = 'degraded';
      health.services.database.message = 'Slow database response';
    }
  } catch (error) {
    health.services.database.status = 'unhealthy';
    health.services.database.message = 'Database connection failed';
    health.status = 'unhealthy';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const memoryPercentage = (usedMemory / totalMemory) * 100;
  
  health.services.memory = {
    status: memoryPercentage > 90 ? 'degraded' : 'healthy',
    used: Math.round(usedMemory / 1024 / 1024), // MB
    total: Math.round(totalMemory / 1024 / 1024), // MB
    percentage: Math.round(memoryPercentage),
  };

  if (memoryPercentage > 95) {
    health.services.memory.status = 'unhealthy';
    health.status = health.status === 'unhealthy' ? 'unhealthy' : 'degraded';
  }

  // Determine overall status
  if (health.services.database.status === 'unhealthy') {
    health.status = 'unhealthy';
  } else if (
    health.services.database.status === 'degraded' ||
    health.services.memory.status === 'degraded'
  ) {
    health.status = health.status === 'unhealthy' ? 'unhealthy' : 'degraded';
  }

  // Return appropriate status code
  const statusCode = health.status === 'unhealthy' ? 503 : 200;
  res.status(statusCode).json(health);
});

/**
 * GET /api/health/ready
 * Readiness probe - checks if app is ready to receive traffic
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check database is ready
    await db.execute(sql`SELECT 1`);
    
    res.json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      reason: 'Database not ready',
    });
  }
});

/**
 * GET /api/health/live
 * Liveness probe - checks if app is alive
 */
router.get('/live', (req: Request, res: Response) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /api/health/metrics
 * Basic metrics endpoint (for monitoring systems)
 */
router.get('/metrics', async (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  // Get database stats
  let dbStats = { userCount: 0 };
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    dbStats.userCount = Number(result[0]?.count || 0);
  } catch (error) {
    // Ignore errors for metrics
  }

  const metrics = {
    timestamp: new Date().toISOString(),
    process: {
      uptime: process.uptime(),
      pid: process.pid,
      nodeVersion: process.version,
    },
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    database: dbStats,
  };

  res.json(metrics);
});

export default router;

/**
 * Setup function for backwards compatibility
 */
export function setupHealthRoutes(app: any): void {
  app.use('/api/health', router);
}

