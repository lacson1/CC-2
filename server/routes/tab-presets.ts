import { Express, Request, Response } from 'express';
import { db } from '../db';
import { tabPresets, tabPresetItems, tabConfigs, insertTabPresetSchema, insertTabPresetItemSchema } from '../../shared/schema';
import { eq, and, or, inArray } from 'drizzle-orm';
import { authenticateToken, type AuthRequest } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';

type TabScope = 'system' | 'organization' | 'role' | 'user';

// Combined request type
interface CombinedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    roleId?: number;
    organizationId?: number;
    currentOrganizationId?: number;
  };
  tenant?: {
    id: number;
    name: string;
    type: string;
    logoUrl?: string;
    themeColor: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    isActive: boolean;
  };
}

export function setupTabPresetRoutes(app: Express) {
  // List accessible presets
  app.get('/api/tab-presets', authenticateToken, tenantMiddleware, async (req: CombinedRequest, res: Response) => {
    try {
      const organizationId = req.tenant?.id;
      const userId = req.user?.id;
      
      if (!organizationId) {
        return res.status(403).json({ error: 'Organization context required' });
      }

      // Fetch presets: system + organization-specific
      const presets = await db
        .select()
        .from(tabPresets)
        .where(
          or(
            eq(tabPresets.scope, 'system'),
            and(eq(tabPresets.scope, 'organization'), eq(tabPresets.organizationId, organizationId)),
            userId ? and(eq(tabPresets.scope, 'user'), eq(tabPresets.createdBy, userId)) : undefined
          )
        )
        .orderBy(tabPresets.name);

      res.json(presets);
    } catch (error) {
      console.error('Error fetching presets:', error);
      res.status(500).json({ error: 'Failed to fetch presets' });
    }
  });

  // Preview preset (dry-run showing what would result)
  app.get('/api/tab-presets/:id/preview', authenticateToken, tenantMiddleware, async (req: CombinedRequest, res: Response) => {
    try {
      const presetId = parseInt(req.params.id);
      const { targetScope = 'user' } = req.query;
      const organizationId = req.tenant?.id;
      const userId = req.user?.id;
      const roleId = req.user?.roleId;

      if (!organizationId) {
        return res.status(403).json({ error: 'Organization context required' });
      }

      // Fetch preset and its items
      const [preset] = await db
        .select()
        .from(tabPresets)
        .where(eq(tabPresets.id, presetId));

      if (!preset) {
        return res.status(404).json({ error: 'Preset not found' });
      }

      // SECURITY: Verify preset access - must be system, same org, or owned by user
      const isSystemPreset = preset.scope === 'system';
      const isOrgPreset = preset.scope === 'organization' && preset.organizationId === organizationId;
      const isUserPreset = preset.scope === 'user' && preset.createdBy === userId;

      if (!isSystemPreset && !isOrgPreset && !isUserPreset) {
        return res.status(403).json({ error: 'Access denied to this preset' });
      }

      const presetItems = await db
        .select()
        .from(tabPresetItems)
        .where(eq(tabPresetItems.presetId, presetId))
        .orderBy(tabPresetItems.displayOrder);

      // Fetch current tabs (system + existing overrides)
      const currentTabs = await db
        .select()
        .from(tabConfigs)
        .where(
          or(
            and(eq(tabConfigs.scope, 'system'), eq(tabConfigs.isSystemDefault, true)),
            and(eq(tabConfigs.scope, 'organization'), eq(tabConfigs.organizationId, organizationId)),
            roleId ? and(eq(tabConfigs.scope, 'role'), eq(tabConfigs.roleId, roleId)) : undefined,
            userId ? and(eq(tabConfigs.scope, 'user'), eq(tabConfigs.userId, userId)) : undefined
          )
        );

      // Merge current tabs
      const currentMerged = mergeTabs(currentTabs);

      // Simulate applying preset: replace scope-level overrides with preset items
      const simulatedTabs = [...currentTabs];
      
      // Remove existing overrides at target scope
      const filteredTabs = simulatedTabs.filter(tab => {
        if (tab.scope !== targetScope) return true;
        if (targetScope === 'user' && tab.userId !== userId) return true;
        if (targetScope === 'role' && tab.roleId !== roleId) return true;
        if (targetScope === 'organization' && tab.organizationId !== organizationId) return true;
        return false;
      });

      // Add preset items as new overrides
      const systemTabs = currentTabs.filter(t => t.scope === 'system' && t.isSystemDefault);
      for (const item of presetItems) {
        const systemTab = systemTabs.find(t => t.key === item.tabKey);
        if (systemTab) {
          filteredTabs.push({
            ...systemTab,
            id: -1, // Temporary ID for preview
            scope: targetScope as string,
            organizationId: targetScope === 'organization' ? organizationId : null,
            roleId: targetScope === 'role' ? (roleId || null) : null,
            userId: targetScope === 'user' ? (userId || null) : null,
            isVisible: item.isVisible,
            displayOrder: item.displayOrder,
            label: item.customLabel || systemTab.label,
            icon: item.customIcon || systemTab.icon,
            settings: item.customSettings || systemTab.settings,
            isSystemDefault: false,
            createdBy: userId || null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      // Merge simulated tabs
      const previewMerged = mergeTabs(filteredTabs);

      // Compute diff
      const diff = computeDiff(currentMerged, previewMerged);

      res.json({
        preset: {
          id: preset.id,
          name: preset.name,
          description: preset.description
        },
        current: currentMerged,
        preview: previewMerged,
        diff
      });
    } catch (error) {
      console.error('Error previewing preset:', error);
      res.status(500).json({ error: 'Failed to preview preset' });
    }
  });

  // Apply preset
  app.post('/api/tab-presets/:id/apply', authenticateToken, tenantMiddleware, async (req: CombinedRequest, res: Response) => {
    try {
      const presetId = parseInt(req.params.id);
      const { targetScope = 'user' } = req.body;
      const organizationId = req.tenant?.id;
      const userId = req.user?.id;
      const roleId = req.user?.roleId;

      if (!organizationId) {
        return res.status(403).json({ error: 'Organization context required' });
      }

      // Special handling for virtual superadmin user (ID 999) who doesn't exist in database
      // This user is a fallback superadmin that bypasses database authentication
      if (userId === 999 && targetScope === 'user') {
        return res.json({
          message: 'Tab preferences are not persisted for system superadmin. Changes will reset on logout.',
          preset: 'N/A',
          tabs: []
        });
      }

      // Authorization checks
      if (targetScope === 'organization' && req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
        return res.status(403).json({ error: 'Only admins can apply organization-wide presets' });
      }
      if (targetScope === 'role' && !roleId) {
        return res.status(400).json({ error: 'Cannot apply role preset without role assignment' });
      }

      // Fetch preset and items
      const [preset] = await db
        .select()
        .from(tabPresets)
        .where(eq(tabPresets.id, presetId));

      if (!preset) {
        return res.status(404).json({ error: 'Preset not found' });
      }

      // SECURITY: Verify preset access - must be system, same org, or owned by user
      const isSystemPreset = preset.scope === 'system';
      const isOrgPreset = preset.scope === 'organization' && preset.organizationId === organizationId;
      const isUserPreset = preset.scope === 'user' && preset.createdBy === userId;

      if (!isSystemPreset && !isOrgPreset && !isUserPreset) {
        return res.status(403).json({ error: 'Access denied to this preset' });
      }

      const presetItems = await db
        .select()
        .from(tabPresetItems)
        .where(eq(tabPresetItems.presetId, presetId))
        .orderBy(tabPresetItems.displayOrder);

      // Fetch system tabs to use as base
      const systemTabs = await db
        .select()
        .from(tabConfigs)
        .where(and(
          eq(tabConfigs.scope, 'system'),
          eq(tabConfigs.isSystemDefault, true)
        ));

      // Begin transaction: delete existing overrides + insert new ones
      await db.transaction(async (tx) => {
        // Delete existing overrides at target scope
        if (targetScope === 'user' && userId) {
          await tx.delete(tabConfigs)
            .where(and(
              eq(tabConfigs.scope, 'user'),
              eq(tabConfigs.userId, userId),
              eq(tabConfigs.isSystemDefault, false)
            ));
        } else if (targetScope === 'role' && roleId) {
          await tx.delete(tabConfigs)
            .where(and(
              eq(tabConfigs.scope, 'role'),
              eq(tabConfigs.roleId, roleId),
              eq(tabConfigs.isSystemDefault, false)
            ));
        } else if (targetScope === 'organization' && organizationId) {
          await tx.delete(tabConfigs)
            .where(and(
              eq(tabConfigs.scope, 'organization'),
              eq(tabConfigs.organizationId, organizationId),
              eq(tabConfigs.isSystemDefault, false)
            ));
        }

        // Insert new overrides from preset
        const newOverrides = presetItems.map(item => {
          const systemTab = systemTabs.find(t => t.key === item.tabKey);
          if (!systemTab) return null;

          return {
            key: item.tabKey,
            label: item.customLabel || systemTab.label,
            icon: item.customIcon || systemTab.icon,
            contentType: systemTab.contentType,
            settings: item.customSettings || systemTab.settings,
            scope: targetScope,
            organizationId: targetScope === 'organization' ? organizationId : null,
            roleId: targetScope === 'role' ? roleId : null,
            userId: targetScope === 'user' ? userId : null,
            isVisible: item.isVisible,
            isSystemDefault: false,
            isMandatory: false,
            category: systemTab.category,
            displayOrder: item.displayOrder,
            createdBy: userId
          };
        }).filter(Boolean);

        if (newOverrides.length > 0) {
          await tx.insert(tabConfigs).values(newOverrides as any);
        }
      });

      // Fetch and return new merged state
      const updatedTabs = await db
        .select()
        .from(tabConfigs)
        .where(
          or(
            and(eq(tabConfigs.scope, 'system'), eq(tabConfigs.isSystemDefault, true)),
            and(eq(tabConfigs.scope, 'organization'), eq(tabConfigs.organizationId, organizationId)),
            roleId ? and(eq(tabConfigs.scope, 'role'), eq(tabConfigs.roleId, roleId)) : undefined,
            userId ? and(eq(tabConfigs.scope, 'user'), eq(tabConfigs.userId, userId)) : undefined
          )
        );

      const mergedTabs = mergeTabs(updatedTabs);

      res.json({
        message: 'Preset applied successfully',
        preset: preset.name,
        tabs: mergedTabs
      });
    } catch (error) {
      console.error('Error applying preset:', error);
      res.status(500).json({ error: 'Failed to apply preset' });
    }
  });
}

// Helper: Merge tabs by key with scope priority
function mergeTabs(tabs: any[]) {
  const tabMap = new Map();
  const scopePriority: Record<TabScope, number> = { system: 1, organization: 2, role: 3, user: 4 };

  for (const tab of tabs) {
    const existing = tabMap.get(tab.key);
    const tabScope = tab.scope as TabScope;
    const existingScope = existing?.scope as TabScope;
    
    if (!existing || scopePriority[tabScope] > scopePriority[existingScope]) {
      tabMap.set(tab.key, tab);
    }
  }

  return Array.from(tabMap.values())
    .filter(tab => tab.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// Helper: Compute diff between current and preview
function computeDiff(current: any[], preview: any[]) {
  const currentMap = new Map(current.map(t => [t.key, t]));
  const previewMap = new Map(preview.map(t => [t.key, t]));

  const added = preview.filter(t => !currentMap.has(t.key));
  const removed = current.filter(t => !previewMap.has(t.key));
  const modified = preview.filter(t => {
    const cur = currentMap.get(t.key);
    return cur && (
      cur.label !== t.label ||
      cur.icon !== t.icon ||
      cur.displayOrder !== t.displayOrder ||
      cur.isVisible !== t.isVisible
    );
  });

  return { added, removed, modified };
}
