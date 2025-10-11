import { Router } from 'express';
import { db } from '../db';
import { roles, permissions, rolePermissions, users, auditLogs } from '@shared/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { authenticateToken, type AuthRequest } from '../middleware/auth';

const router = Router();

// Get all roles with permissions and user counts
router.get('/roles', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const rolesWithDetails = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
        userCount: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE role_id = ${roles.id})`
      })
      .from(roles)
      .orderBy(roles.name);

    // Get permissions for each role
    for (const role of rolesWithDetails) {
      const rolePermissionsList = await db
        .select({
          id: permissions.id,
          name: permissions.name,
          description: permissions.description
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, role.id))
        .orderBy(permissions.name);

      (role as any).permissions = rolePermissionsList;
    }

    res.json(rolesWithDetails);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

// Get all permissions grouped by category
router.get('/permissions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const allPermissions = await db
      .select()
      .from(permissions)
      .orderBy(permissions.name);

    // Group permissions by category (prefix before dot)
    const grouped = allPermissions.reduce((acc: any, perm) => {
      const category = perm.name.split('.')[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(perm);
      return acc;
    }, {});

    res.json({ all: allPermissions, grouped });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
});

// Create new role with permissions
router.post('/roles', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, permissionIds } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has permission to manage roles
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Create the role
    const [newRole] = await db
      .insert(roles)
      .values({
        name,
        description,
        createdAt: new Date()
      })
      .returning();

    // Add role permissions
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissionValues = permissionIds.map((permissionId: number) => ({
        roleId: newRole.id,
        permissionId
      }));

      await db.insert(rolePermissions).values(rolePermissionValues);
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      action: 'CREATE_ROLE',
      entityType: 'role',
      entityId: newRole.id,
      details: JSON.stringify({ name, permissionIds }),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
});

// Update role permissions
router.put('/roles/:id/permissions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const roleId = parseInt(req.params.id);
    const { permissionIds } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has permission to manage roles
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Delete existing role permissions
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    // Add new permissions
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissionValues = permissionIds.map((permissionId: number) => ({
        roleId,
        permissionId
      }));

      await db.insert(rolePermissions).values(rolePermissionValues);
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      action: 'UPDATE_ROLE_PERMISSIONS',
      entityType: 'role',
      entityId: roleId,
      details: JSON.stringify({ permissionIds }),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ message: 'Role permissions updated successfully' });
  } catch (error) {
    console.error("Error updating role permissions:", error);
    res.status(500).json({ message: "Failed to update role permissions" });
  }
});

// Delete role
router.delete('/roles/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const roleId = parseInt(req.params.id);

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has permission to manage roles
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Check if role is in use
    const [usageCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.roleId, roleId));

    if (usageCount.count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete role: ${usageCount.count} user(s) currently assigned to this role` 
      });
    }

    // Delete role permissions first
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    // Delete the role
    await db.delete(roles).where(eq(roles.id, roleId));

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      action: 'DELETE_ROLE',
      entityType: 'role',
      entityId: roleId,
      details: JSON.stringify({ roleId }),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Failed to delete role" });
  }
});

// Assign role to user
router.put('/users/:userId/role', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { roleId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has permission to manage users
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Update user's role
    const [updatedUser] = await db
      .update(users)
      .set({
        roleId: roleId || null,
        updatedAt: new Date()
      })
      .where(
        req.user.role === 'superadmin' || req.user.role === 'super_admin' 
          ? eq(users.id, userId)
          : and(eq(users.id, userId), eq(users.organizationId, req.user.organizationId!))
      )
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or access denied" });
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      action: 'ASSIGN_ROLE',
      entityType: 'user',
      entityId: userId,
      details: JSON.stringify({ roleId, targetUserId: userId }),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Failed to assign role" });
  }
});

// Get user's permissions
router.get('/users/:userId/permissions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get user
    const [user] = await db
      .select({ roleId: users.roleId, role: users.role })
      .from(users)
      .where(
        req.user.role === 'superadmin' || req.user.role === 'super_admin'
          ? eq(users.id, userId)
          : and(eq(users.id, userId), eq(users.organizationId, req.user.organizationId!))
      );

    if (!user) {
      return res.status(404).json({ message: "User not found or access denied" });
    }

    // For backward compatibility with admin roles
    if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'super_admin') {
      const allPermissions = await db.select().from(permissions).orderBy(permissions.name);
      return res.json(allPermissions);
    }

    // Get permissions through RBAC system
    if (user.roleId) {
      const userPermissions = await db
        .select({
          id: permissions.id,
          name: permissions.name,
          description: permissions.description
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, user.roleId))
        .orderBy(permissions.name);

      return res.json(userPermissions);
    }

    res.json([]);
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res.status(500).json({ message: "Failed to fetch user permissions" });
  }
});

// Get staff members with their roles and permissions (organization-scoped)
router.get('/staff', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const staffMembers = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        role: users.role,
        roleId: users.roleId,
        isActive: users.isActive,
        photoUrl: users.photoUrl,
        title: users.title,
        organizationId: users.organizationId,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .where(
        req.user.role === 'superadmin' || req.user.role === 'super_admin'
          ? sql`1=1` // Superadmin sees all
          : eq(users.organizationId, req.user.organizationId!)
      )
      .orderBy(users.firstName, users.lastName);

    // Get role details and permissions for each staff member
    for (const staff of staffMembers) {
      if (staff.roleId) {
        const [roleDetails] = await db
          .select({
            id: roles.id,
            name: roles.name,
            description: roles.description
          })
          .from(roles)
          .where(eq(roles.id, staff.roleId));

        if (roleDetails) {
          const rolePerms = await db
            .select({
              id: permissions.id,
              name: permissions.name,
              description: permissions.description
            })
            .from(rolePermissions)
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
            .where(eq(rolePermissions.roleId, staff.roleId));

          (staff as any).roleDetails = {
            ...roleDetails,
            permissions: rolePerms
          };
        }
      }
    }

    res.json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Failed to fetch staff" });
  }
});

// Bulk assign roles to multiple users
router.post('/bulk-assign-roles', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userIds, roleId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has permission to manage users
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    // Update users' roles
    const updatedUsers = await db
      .update(users)
      .set({
        roleId: roleId || null,
        updatedAt: new Date()
      })
      .where(
        req.user.role === 'superadmin' || req.user.role === 'super_admin'
          ? inArray(users.id, userIds)
          : and(
              inArray(users.id, userIds),
              eq(users.organizationId, req.user.organizationId!)
            )
      )
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      action: 'BULK_ASSIGN_ROLES',
      entityType: 'user',
      entityId: req.user.id,
      details: JSON.stringify({ userIds, roleId, count: updatedUsers.length }),
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ 
      message: `Successfully assigned role to ${updatedUsers.length} user(s)`,
      updatedUsers 
    });
  } catch (error) {
    console.error("Error bulk assigning roles:", error);
    res.status(500).json({ message: "Failed to bulk assign roles" });
  }
});

export default router;
