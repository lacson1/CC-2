import { db } from './db';
import { tabPresets, tabPresetItems } from '../shared/schema';
import { eq } from 'drizzle-orm';

export async function seedTabPresets() {
  try {
    console.log('🌱 Seeding tab presets...');

    // Check if presets already exist
    const existing = await db.select().from(tabPresets).where(eq(tabPresets.scope, 'system'));
    if (existing.length > 0) {
      console.log('⏭️  Tab presets already seeded, skipping...');
      return { message: 'Tab presets already exist', count: existing.length };
    }

    // Define system presets
    const presets = [
      {
        name: "Doctor's View",
        description: "Comprehensive view for physicians with all clinical data",
        scope: 'system',
        organizationId: null,
        icon: 'Stethoscope',
        isDefault: true,
        tabs: [
          { tabKey: 'overview', isVisible: true, displayOrder: 10 },
          { tabKey: 'visits', isVisible: true, displayOrder: 20 },
          { tabKey: 'medications', isVisible: true, displayOrder: 30 },
          { tabKey: 'lab', isVisible: true, displayOrder: 40 },
          { tabKey: 'vitals', isVisible: true, displayOrder: 50 }
        ]
      },
      {
        name: "Nurse's View",
        description: "Focused on vitals monitoring and medication management",
        scope: 'system',
        organizationId: null,
        icon: 'Heart',
        isDefault: false,
        tabs: [
          { tabKey: 'vitals', isVisible: true, displayOrder: 10 },
          { tabKey: 'visits', isVisible: true, displayOrder: 20 },
          { tabKey: 'medications', isVisible: true, displayOrder: 30 },
          { tabKey: 'overview', isVisible: true, displayOrder: 40 },
          { tabKey: 'lab', isVisible: false, displayOrder: 50 }
        ]
      },
      {
        name: "Lab Tech View",
        description: "Streamlined view for laboratory staff",
        scope: 'system',
        organizationId: null,
        icon: 'TestTube',
        isDefault: false,
        tabs: [
          { tabKey: 'lab', isVisible: true, displayOrder: 10 },
          { tabKey: 'overview', isVisible: true, displayOrder: 20 },
          { tabKey: 'visits', isVisible: true, displayOrder: 30 },
          { tabKey: 'vitals', isVisible: false, displayOrder: 40 },
          { tabKey: 'medications', isVisible: false, displayOrder: 50 }
        ]
      },
      {
        name: "Minimal View",
        description: "Essential information only",
        scope: 'system',
        organizationId: null,
        icon: 'Minimize2',
        isDefault: false,
        tabs: [
          { tabKey: 'overview', isVisible: true, displayOrder: 10 },
          { tabKey: 'visits', isVisible: true, displayOrder: 20 },
          { tabKey: 'medications', isVisible: false, displayOrder: 30 },
          { tabKey: 'lab', isVisible: false, displayOrder: 40 },
          { tabKey: 'vitals', isVisible: false, displayOrder: 50 }
        ]
      }
    ];

    let totalCreated = 0;

    for (const preset of presets) {
      // Insert preset
      const [createdPreset] = await db
        .insert(tabPresets)
        .values({
          name: preset.name,
          description: preset.description,
          scope: preset.scope,
          organizationId: preset.organizationId,
          icon: preset.icon,
          isDefault: preset.isDefault,
          createdBy: null
        })
        .returning();

      // Insert preset items
      const items = preset.tabs.map(tab => ({
        presetId: createdPreset.id,
        tabKey: tab.tabKey,
        isVisible: tab.isVisible,
        displayOrder: tab.displayOrder,
        customLabel: null,
        customIcon: null,
        customSettings: null
      }));

      await db.insert(tabPresetItems).values(items);

      totalCreated++;
      console.log(`✅ Created preset: ${preset.name} with ${items.length} tabs`);
    }

    console.log(`✨ Successfully seeded ${totalCreated} tab presets`);
    return { message: 'Tab presets seeded successfully', count: totalCreated };
  } catch (error) {
    const err = error as any;
    if (err?.code === '42P01') {
      console.log('⚠️  Tab presets seeding skipped - tables not yet created');
      return { message: 'Skipped - tables not created', count: 0 };
    }
    console.error('❌ Error seeding tab presets:', error);
    throw error;
  }
}
