import { Express } from 'express';
import { db } from '../db';
import { labTests, labDepartments, labPanels } from '../../shared/schema';
import { sql } from 'drizzle-orm';
import { seedLabCatalog } from '../seedLabCatalog';
import { authenticateToken, type AuthRequest } from '../middleware/auth';

export function setupLabSeedRoutes(app: Express) {
  app.post('/api/lab/seed', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userRole = req.user?.role;
      const isAdmin = ['admin', 'super_admin', 'superadmin'].includes(userRole || '');

      if (!isAdmin) {
        return res.status(403).json({ 
          message: "Admin privileges required to seed lab catalog" 
        });
      }

      const force = req.body?.force === true || req.query?.force === 'true';

      const testCount = await db.select({ count: sql<number>`count(*)` })
        .from(labTests);
      const deptCount = await db.select({ count: sql<number>`count(*)` })
        .from(labDepartments);
      const panelCount = await db.select({ count: sql<number>`count(*)` })
        .from(labPanels);

      const totalRecords = 
        (testCount[0]?.count || 0) + 
        (deptCount[0]?.count || 0) + 
        (panelCount[0]?.count || 0);

      if (totalRecords > 0 && !force) {
        return res.status(400).json({ 
          message: "Lab catalog already contains data. Use force=true to reseed.",
          currentCounts: {
            departments: deptCount[0]?.count || 0,
            tests: testCount[0]?.count || 0,
            panels: panelCount[0]?.count || 0
          }
        });
      }

      console.log('Starting lab catalog seeding...');
      const result = await seedLabCatalog();
      console.log('Lab catalog seeding completed successfully!', result);

      res.status(200).json({
        message: "Lab catalog seeded successfully",
        counts: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error seeding lab catalog:", error);
      res.status(500).json({ 
        message: "Failed to seed lab catalog",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}
