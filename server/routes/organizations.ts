import { Router } from 'express';
import { db } from '../db';
import { userOrganizations, organizations, users } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, type AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's organizations (with full org details)
router.get('/user-organizations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userOrgs = await db
      .select({
        organizationId: userOrganizations.organizationId,
        isDefault: userOrganizations.isDefault,
        organization: {
          id: organizations.id,
          name: organizations.name,
          type: organizations.type,
          themeColor: organizations.themeColor
        }
      })
      .from(userOrganizations)
      .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
      .where(eq(userOrganizations.userId, req.user.id))
      .orderBy(userOrganizations.isDefault);

    // Transform to match expected format
    const formattedOrgs = userOrgs.map(uo => ({
      organizationId: uo.organizationId,
      isDefault: uo.isDefault,
      organization: {
        id: uo.organization.id,
        name: uo.organization.name,
        type: uo.organization.type || 'clinic',
        themeColor: uo.organization.themeColor || '#3B82F6'
      }
    }));

    res.json(formattedOrgs);
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    res.status(500).json({ message: 'Failed to fetch organizations' });
  }
});

// Get user's organizations (legacy endpoint with flat structure)
router.get('/my-organizations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userOrgs = await db
      .select({
        id: userOrganizations.id,
        organizationId: userOrganizations.organizationId,
        organizationName: organizations.name,
        organizationType: organizations.type,
        organizationLogo: organizations.logoUrl,
        roleId: userOrganizations.roleId,
        isDefault: userOrganizations.isDefault,
        joinedAt: userOrganizations.joinedAt
      })
      .from(userOrganizations)
      .innerJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
      .where(eq(userOrganizations.userId, req.user.id))
      .orderBy(userOrganizations.isDefault);

    res.json(userOrgs);
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    res.status(500).json({ message: 'Failed to fetch organizations' });
  }
});

// Get current organization
router.get('/current', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const currentOrgId = req.user.currentOrganizationId;
    if (!currentOrgId) {
      return res.status(404).json({ message: 'No organization selected' });
    }

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, currentOrgId));

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(org);
  } catch (error) {
    console.error('Error fetching current organization:', error);
    res.status(500).json({ message: 'Failed to fetch organization' });
  }
});

// Switch organization (POST with body)
router.post('/switch', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.session) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { organizationId } = req.body;

    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }

    // Verify user has access to this organization
    const [userOrg] = await db
      .select()
      .from(userOrganizations)
      .where(
        and(
          eq(userOrganizations.userId, req.user.id),
          eq(userOrganizations.organizationId, organizationId)
        )
      );

    if (!userOrg) {
      return res.status(403).json({ message: 'You do not have access to this organization' });
    }

    // Update session with new organization
    if (req.session.user) {
      req.session.user.currentOrganizationId = organizationId;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Failed to switch organization' });
        }
        res.json({ 
          message: 'Organization switched successfully',
          organizationId
        });
      });
    } else {
      res.status(401).json({ message: 'Session not found' });
    }
  } catch (error) {
    console.error('Error switching organization:', error);
    res.status(500).json({ message: 'Failed to switch organization' });
  }
});

// Switch organization (legacy URL param version)
router.post('/switch/:organizationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.session) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const organizationId = parseInt(req.params.organizationId);

    // Verify user has access to this organization
    const [userOrg] = await db
      .select()
      .from(userOrganizations)
      .where(
        and(
          eq(userOrganizations.userId, req.user.id),
          eq(userOrganizations.organizationId, organizationId)
        )
      );

    if (!userOrg) {
      return res.status(403).json({ message: 'You do not have access to this organization' });
    }

    // Update session with new organization
    if (req.session.user) {
      req.session.user.currentOrganizationId = organizationId;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Failed to switch organization' });
        }
        res.json({ 
          message: 'Organization switched successfully',
          organizationId
        });
      });
    } else {
      res.status(401).json({ message: 'Session not found' });
    }
  } catch (error) {
    console.error('Error switching organization:', error);
    res.status(500).json({ message: 'Failed to switch organization' });
  }
});

// Set default organization
router.post('/set-default/:organizationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const organizationId = parseInt(req.params.organizationId);

    // Verify user has access to this organization
    const [userOrg] = await db
      .select()
      .from(userOrganizations)
      .where(
        and(
          eq(userOrganizations.userId, req.user.id),
          eq(userOrganizations.organizationId, organizationId)
        )
      );

    if (!userOrg) {
      return res.status(403).json({ message: 'You do not have access to this organization' });
    }

    // Remove default from all user's organizations
    await db
      .update(userOrganizations)
      .set({ isDefault: false })
      .where(eq(userOrganizations.userId, req.user.id));

    // Set new default
    await db
      .update(userOrganizations)
      .set({ isDefault: true })
      .where(
        and(
          eq(userOrganizations.userId, req.user.id),
          eq(userOrganizations.organizationId, organizationId)
        )
      );

    res.json({ message: 'Default organization updated successfully' });
  } catch (error) {
    console.error('Error setting default organization:', error);
    res.status(500).json({ message: 'Failed to set default organization' });
  }
});

export default router;
