import { db } from './db';
import { patients, users, organizations, type InsertPatient } from '../shared/schema';
import { hashPassword } from './middleware/auth';
import { eq } from 'drizzle-orm';

/**
 * Seed mock data: 2 patients and 2 staff members
 * Creates a default organization if none exists
 */
export async function seedMockData() {
  try {
    console.log('🌱 Seeding mock data (2 patients, 2 staff)...');

    // Get or create a default organization
    let [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.name, 'Demo Clinic'))
      .limit(1);

    if (!organization) {
      console.log('Creating default organization...');
      [organization] = await db
        .insert(organizations)
        .values({
          name: 'Demo Clinic',
          type: 'clinic',
          themeColor: '#3B82F6',
          address: '123 Healthcare Street, Lagos, Nigeria',
          phone: '+234-801-234-5678',
          email: 'info@democlinic.ng',
          isActive: true
        })
        .returning();
      console.log(`✅ Created organization: ${organization.name} (ID: ${organization.id})`);
    } else {
      console.log(`✅ Using existing organization: ${organization.name} (ID: ${organization.id})`);
    }

    const orgId = organization.id;

    // Check if patients already exist
    const existingPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.organizationId, orgId))
      .limit(10);

    // Check for specific mock patients by phone number
    const johnDoe = existingPatients.find(p => p.phone === '+234-802-111-2222');
    const maryJohnson = existingPatients.find(p => p.phone === '+234-803-333-4444');

    if (johnDoe && maryJohnson) {
      console.log('⏭️  Mock patients already exist, skipping patient creation...');
    } else {
      // Create missing mock patients
      const mockPatients: InsertPatient[] = [];
      
      if (!johnDoe) {
        mockPatients.push({
          title: 'Mr.',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-05-15',
          gender: 'Male',
          phone: '+234-802-111-2222',
          email: 'john.doe@example.com',
          address: '45 Victoria Island, Lagos, Nigeria',
          allergies: 'Penicillin, Shellfish',
          medicalHistory: 'Hypertension, Type 2 Diabetes',
          organizationId: orgId
        });
      }
      
      if (!maryJohnson) {
        mockPatients.push({
          title: 'Mrs.',
          firstName: 'Mary',
          lastName: 'Johnson',
          dateOfBirth: '1990-08-22',
          gender: 'Female',
          phone: '+234-803-333-4444',
          email: 'mary.johnson@example.com',
          address: '12 Ikeja, Lagos, Nigeria',
          allergies: 'Latex',
          medicalHistory: 'Asthma',
          organizationId: orgId
        });
      }

      if (mockPatients.length > 0) {
        const createdPatients = await db
          .insert(patients)
          .values(mockPatients)
          .returning();

        console.log(`✅ Created ${createdPatients.length} patient(s):`);
        createdPatients.forEach(patient => {
          console.log(`   - ${patient.firstName} ${patient.lastName} (ID: ${patient.id})`);
        });
      }
    }

    // Check if staff already exist by username
    const existingStaff = await db
      .select()
      .from(users)
      .limit(50);

    // Define all demo users that need to exist for login
    const demoUsers = [
      { username: 'superadmin', password: 'super123', role: 'superadmin', title: 'Admin', firstName: 'Super', lastName: 'Admin', email: 'superadmin@democlinic.ng', phone: '+234-800-000-0000' },
      { username: 'admin', password: 'admin123', role: 'admin', title: 'Mr.', firstName: 'Admin', lastName: 'User', email: 'admin@democlinic.ng', phone: '+234-800-000-0001' },
      { username: 'ade', password: 'doctor123', role: 'doctor', title: 'Dr.', firstName: 'Ade', lastName: 'Ogundimu', email: 'ade@democlinic.ng', phone: '+234-801-111-1111' },
      { username: 'syb', password: 'nurse123', role: 'nurse', title: 'Ms.', firstName: 'Sybil', lastName: 'Adeyemi', email: 'syb@democlinic.ng', phone: '+234-802-222-2222' },
      { username: 'akin', password: 'pharmacist123', role: 'pharmacist', title: 'Mr.', firstName: 'Akin', lastName: 'Balogun', email: 'akin@democlinic.ng', phone: '+234-803-333-3333' },
      { username: 'seye', password: 'physio123', role: 'physiotherapist', title: 'Mr.', firstName: 'Seye', lastName: 'Okoro', email: 'seye@democlinic.ng', phone: '+234-804-444-4444' },
      { username: 'receptionist', password: 'receptionist123', role: 'receptionist', title: 'Ms.', firstName: 'Funke', lastName: 'Adeleke', email: 'funke@democlinic.ng', phone: '+234-805-555-5555' },
      { username: 'doctor.smith', password: 'staff123', role: 'doctor', title: 'Dr.', firstName: 'James', lastName: 'Smith', email: 'james.smith@democlinic.ng', phone: '+234-804-555-6666' },
      { username: 'nurse.williams', password: 'staff123', role: 'nurse', title: 'Ms.', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@democlinic.ng', phone: '+234-805-777-8888' }
    ];

    const existingUsernames = existingStaff.map(u => u.username);
    const missingUsers = demoUsers.filter(u => !existingUsernames.includes(u.username));

    if (missingUsers.length === 0) {
      console.log('⏭️  All demo users already exist, skipping staff creation...');
    } else {
      console.log(`Creating ${missingUsers.length} missing demo users...`);
      
      for (const user of missingUsers) {
        try {
          const hashedPassword = await hashPassword(user.password);
          const [created] = await db
            .insert(users)
            .values({
              username: user.username,
              password: hashedPassword,
              role: user.role,
              title: user.title,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              organizationId: orgId,
              isActive: true,
              createdAt: new Date()
            })
            .returning();
          
          console.log(`   ✅ Created ${created.username} (${created.role}) - ID: ${created.id}`);
        } catch (err: any) {
          // Skip if user already exists (unique constraint)
          if (err.code === '23505') {
            console.log(`   ⏭️  ${user.username} already exists, skipping...`);
          } else {
            console.error(`   ❌ Error creating ${user.username}:`, err.message);
          }
        }
      }
    }

    console.log('✨ Mock data seeding completed successfully!');
    return {
      message: 'Mock data seeded successfully',
      organizationId: orgId,
      organizationName: organization.name
    };
  } catch (error) {
    console.error('❌ Error seeding mock data:', error);
    throw error;
  }
}

