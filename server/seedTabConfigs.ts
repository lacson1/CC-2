import { db } from './db';
import { tabConfigs } from '../shared/schema';
import { eq } from 'drizzle-orm';

export async function seedTabConfigs() {
  console.log('🔧 Seeding tab configurations...');

  // Default system tabs for patient overview
  const systemTabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: 'LayoutGrid',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'PatientOverviewTab' },
      displayOrder: 10,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'visits',
      label: 'Visits',
      icon: 'Calendar',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'VisitsTab' },
      displayOrder: 20,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'lab',
      label: 'Lab Results',
      icon: 'TestTube',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'LabResultsTab' },
      displayOrder: 30,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'medications',
      label: 'Medications',
      icon: 'Pill',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'MedicationsTab' },
      displayOrder: 40,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'vitals',
      label: 'Vitals',
      icon: 'Activity',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'VitalsTab' },
      displayOrder: 50,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'documents',
      label: 'Documents',
      icon: 'FileText',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'DocumentsTab' },
      displayOrder: 60,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: 'CreditCard',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'BillingTab' },
      displayOrder: 70,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'insurance',
      label: 'Insurance',
      icon: 'Shield',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'InsuranceTab' },
      displayOrder: 80,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'appointments',
      label: 'Appointments',
      icon: 'CalendarDays',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'AppointmentsTab' },
      displayOrder: 90,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'history',
      label: 'History',
      icon: 'History',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'HistoryTab' },
      displayOrder: 100,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'med-reviews',
      label: 'Reviews',
      icon: 'FileCheck',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'ReviewsTab' },
      displayOrder: 110,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'communication',
      label: 'Chat',
      icon: 'MessageSquare',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'CommunicationTab' },
      displayOrder: 120,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'vaccinations',
      label: 'Vaccines',
      icon: 'Syringe',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'VaccinationsTab' },
      displayOrder: 130,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'timeline',
      label: 'Timeline',
      icon: 'Clock',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'TimelineTab' },
      displayOrder: 140,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'safety',
      label: 'Safety',
      icon: 'Shield',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'SafetyTab' },
      displayOrder: 150,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
    {
      key: 'consultation',
      label: 'Specialty',
      icon: 'Stethoscope',
      contentType: 'builtin_component' as const,
      settings: { componentName: 'ConsultationTab' },
      displayOrder: 160,
      scope: 'system' as const,
      isSystemDefault: true,
      isVisible: true,
    },
  ];

  try {
    // Check if system tabs already exist
    const existingTabs = await db
      .select()
      .from(tabConfigs)
      .where(eq(tabConfigs.isSystemDefault, true));

    if (existingTabs.length > 0) {
      console.log(`✓ ${existingTabs.length} system tabs already exist`);
      return { message: 'System tabs already seeded', count: existingTabs.length };
    }

    // Insert system tabs
    const inserted = await db.insert(tabConfigs).values(systemTabs).returning();

    console.log(`✓ Successfully seeded ${inserted.length} system tabs`);
    return { message: 'System tabs seeded successfully', count: inserted.length };
  } catch (error) {
    const err = error as any;
    if (err?.code === '42P01') {
      console.log('⚠️  Tab configs seeding skipped - tables not yet created');
      return { message: 'Skipped - tables not created', count: 0 };
    }
    console.error('❌ Error seeding tab configs:', error);
    throw error;
  }
}
