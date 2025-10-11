import { Router } from "express";
import { db } from "../db";
import { apiKeys, insertApiKeySchema } from "@shared/schema";
import { authenticateSession, type SessionRequest } from "../middleware/session";
import { requireAnyRole } from "../middleware/auth";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod";

const router = Router();

// All routes require authentication
router.use(authenticateSession);

// Generate a new API key
router.post('/generate', requireAnyRole(['admin', 'super_admin']), async (req: SessionRequest, res) => {
  try {
    const schema = insertApiKeySchema.extend({
      name: z.string().min(1).max(100)
    }).pick({
      name: true,
      permissions: true,
      rateLimit: true,
      expiresAt: true
    });

    const data = schema.parse(req.body);

    if (!req.session.user?.organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Generate a random API key (this is what the user will see once)
    const rawKey = crypto.randomBytes(32).toString('hex');
    
    // Hash the key for storage
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    // Create the API key record
    const [newKey] = await db
      .insert(apiKeys)
      .values({
        key: hashedKey,
        name: data.name,
        organizationId: req.session.user.organizationId,
        userId: req.session.user.id,
        permissions: data.permissions || [],
        rateLimit: data.rateLimit || 1000,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: true
      })
      .returning();

    // Return the raw key (only shown once!)
    res.json({
      message: 'API key created successfully. Save this key, it will only be shown once!',
      apiKey: rawKey,
      keyInfo: {
        id: newKey.id,
        name: newKey.name,
        permissions: newKey.permissions,
        rateLimit: newKey.rateLimit,
        expiresAt: newKey.expiresAt,
        createdAt: newKey.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// List all API keys for the organization
router.get('/list', requireAnyRole(['admin', 'super_admin']), async (req: SessionRequest, res) => {
  try {
    if (!req.session.user?.organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPreview: apiKeys.key, // We'll mask this
        permissions: apiKeys.permissions,
        rateLimit: apiKeys.rateLimit,
        isActive: apiKeys.isActive,
        lastUsedAt: apiKeys.lastUsedAt,
        expiresAt: apiKeys.expiresAt,
        createdAt: apiKeys.createdAt
      })
      .from(apiKeys)
      .where(eq(apiKeys.organizationId, req.session.user.organizationId))
      .orderBy(apiKeys.createdAt);

    // Mask the keys
    const maskedKeys = keys.map(key => ({
      ...key,
      keyPreview: `${key.keyPreview.substring(0, 8)}...${key.keyPreview.substring(key.keyPreview.length - 4)}`
    }));

    res.json({ data: maskedKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Deactivate an API key
router.patch('/:id/deactivate', requireAnyRole(['admin', 'super_admin']), async (req: SessionRequest, res) => {
  try {
    const { id } = req.params;
    
    if (!req.session.user?.organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const [updated] = await db
      .update(apiKeys)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(
        eq(apiKeys.id, Number(id)),
        eq(apiKeys.organizationId, req.session.user.organizationId)
      ))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key deactivated successfully', data: updated });
  } catch (error) {
    console.error('Error deactivating API key:', error);
    res.status(500).json({ error: 'Failed to deactivate API key' });
  }
});

// Activate an API key
router.patch('/:id/activate', requireAnyRole(['admin', 'super_admin']), async (req: SessionRequest, res) => {
  try {
    const { id } = req.params;
    
    if (!req.session.user?.organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const [updated] = await db
      .update(apiKeys)
      .set({ isActive: true, updatedAt: new Date() })
      .where(and(
        eq(apiKeys.id, Number(id)),
        eq(apiKeys.organizationId, req.session.user.organizationId)
      ))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key activated successfully', data: updated });
  } catch (error) {
    console.error('Error activating API key:', error);
    res.status(500).json({ error: 'Failed to activate API key' });
  }
});

// Delete an API key
router.delete('/:id', requireAnyRole(['admin', 'super_admin']), async (req: SessionRequest, res) => {
  try {
    const { id } = req.params;
    
    if (!req.session.user?.organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const [deleted] = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.id, Number(id)),
        eq(apiKeys.organizationId, req.session.user.organizationId)
      ))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

export default router;
