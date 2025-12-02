#!/usr/bin/env tsx

/**
 * Debug script to check application health and identify issues
 */

import { db } from './db';
import { organizations, users, patients } from '../shared/schema';
import { eq } from 'drizzle-orm';

interface DebugResult {
    check: string;
    status: '✅ PASS' | '❌ FAIL' | '⚠️  WARN';
    message: string;
    details?: any;
}

const results: DebugResult[] = [];

function addResult(check: string, status: '✅ PASS' | '❌ FAIL' | '⚠️  WARN', message: string, details?: any) {
    results.push({ check, status, message, details });
    console.log(`${status} ${check}: ${message}`);
    if (details) {
        console.log(`   Details:`, details);
    }
}

async function checkEnvironmentVariables() {
    console.log('\n🔍 Checking Environment Variables...\n');

    const required = ['DATABASE_URL'];
    const optional = ['SESSION_SECRET', 'JWT_SECRET', 'ANTHROPIC_API_KEY'];

    for (const key of required) {
        if (process.env[key]) {
            addResult(
                `Environment: ${key}`,
                '✅ PASS',
                'Set',
                { length: process.env[key]!.length, preview: process.env[key]!.substring(0, 20) + '...' }
            );
        } else {
            addResult(
                `Environment: ${key}`,
                '❌ FAIL',
                'NOT SET - This will cause the application to fail',
                { required: true }
            );
        }
    }

    for (const key of optional) {
        if (process.env[key]) {
            addResult(`Environment: ${key}`, '✅ PASS', 'Set');
        } else {
            addResult(`Environment: ${key}`, '⚠️  WARN', 'Not set (optional)');
        }
    }
}

async function checkDatabaseConnection() {
    console.log('\n🔍 Checking Database Connection...\n');

    try {
        // Test basic connection
        await db.select().from(organizations).limit(1);
        addResult('Database Connection', '✅ PASS', 'Successfully connected to database');

        // Check if tables exist
        try {
            const orgCount = await db.select().from(organizations).limit(1);
            addResult('Organizations Table', '✅ PASS', 'Table exists and accessible');
        } catch (error: any) {
            addResult('Organizations Table', '❌ FAIL', 'Table does not exist or not accessible', { error: error.message });
        }

        try {
            const userCount = await db.select().from(users).limit(1);
            addResult('Users Table', '✅ PASS', 'Table exists and accessible');
        } catch (error: any) {
            addResult('Users Table', '❌ FAIL', 'Table does not exist or not accessible', { error: error.message });
        }

        try {
            const patientCount = await db.select().from(patients).limit(1);
            addResult('Patients Table', '✅ PASS', 'Table exists and accessible');
        } catch (error: any) {
            addResult('Patients Table', '❌ FAIL', 'Table does not exist or not accessible', { error: error.message });
        }

    } catch (error: any) {
        addResult('Database Connection', '❌ FAIL', 'Failed to connect to database', {
            error: error.message,
            hint: 'Check DATABASE_URL and ensure database is accessible'
        });
    }
}

async function checkExistingData() {
    console.log('\n🔍 Checking Existing Data...\n');

    try {
        const orgs = await db.select().from(organizations);
        addResult('Organizations Count', '✅ PASS', `Found ${orgs.length} organization(s)`);
        if (orgs.length > 0) {
            orgs.forEach(org => {
                console.log(`   - ${org.name} (ID: ${org.id}, Type: ${org.type})`);
            });
        }

        const staff = await db.select().from(users);
        addResult('Staff/Users Count', '✅ PASS', `Found ${staff.length} user(s)`);
        if (staff.length > 0) {
            staff.slice(0, 5).forEach(user => {
                console.log(`   - ${user.username} (${user.role}) - ${user.firstName} ${user.lastName}`);
            });
            if (staff.length > 5) {
                console.log(`   ... and ${staff.length - 5} more`);
            }
        }

        const patientList = await db.select().from(patients);
        addResult('Patients Count', '✅ PASS', `Found ${patientList.length} patient(s)`);
        if (patientList.length > 0) {
            patientList.slice(0, 5).forEach(patient => {
                console.log(`   - ${patient.firstName} ${patient.lastName} (Phone: ${patient.phone})`);
            });
            if (patientList.length > 5) {
                console.log(`   ... and ${patientList.length - 5} more`);
            }
        }

    } catch (error: any) {
        addResult('Data Check', '❌ FAIL', 'Failed to query data', { error: error.message });
    }
}

async function checkSeedData() {
    console.log('\n🔍 Checking Seed Data Requirements...\n');

    try {
        // Check for Demo Clinic organization
        const [demoClinic] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.name, 'Demo Clinic'))
            .limit(1);

        if (demoClinic) {
            addResult('Demo Clinic Organization', '✅ PASS', `Exists (ID: ${demoClinic.id})`);

            // Check for mock patients
            const mockPatients = await db
                .select()
                .from(patients)
                .where(eq(patients.organizationId, demoClinic.id))
                .limit(2);

            if (mockPatients.length >= 2) {
                addResult('Mock Patients', '✅ PASS', `Found ${mockPatients.length} patient(s)`);
            } else {
                addResult('Mock Patients', '⚠️  WARN', `Only ${mockPatients.length}/2 patients found. Run: npm run seed:mock`);
            }

            // Check for mock staff
            const mockStaff = await db
                .select()
                .from(users)
                .where(eq(users.organizationId, demoClinic.id))
                .limit(2);

            if (mockStaff.length >= 2) {
                addResult('Mock Staff', '✅ PASS', `Found ${mockStaff.length} staff member(s)`);
            } else {
                addResult('Mock Staff', '⚠️  WARN', `Only ${mockStaff.length}/2 staff found. Run: npm run seed:mock`);
            }
        } else {
            addResult('Demo Clinic Organization', '⚠️  WARN', 'Not found. Will be created on next seed run.');
        }

    } catch (error: any) {
        addResult('Seed Data Check', '❌ FAIL', 'Failed to check seed data', { error: error.message });
    }
}

async function main() {
    console.log('🔧 ClinicConnect Application Debug Tool\n');
    console.log('='.repeat(60));

    await checkEnvironmentVariables();
    await checkDatabaseConnection();
    await checkExistingData();
    await checkSeedData();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Summary:\n');

    const passed = results.filter(r => r.status === '✅ PASS').length;
    const failed = results.filter(r => r.status === '❌ FAIL').length;
    const warnings = results.filter(r => r.status === '⚠️  WARN').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);

    if (failed > 0) {
        console.log('\n❌ Critical Issues Found:');
        results
            .filter(r => r.status === '❌ FAIL')
            .forEach(r => {
                console.log(`   - ${r.check}: ${r.message}`);
            });
        console.log('\n💡 Fix these issues before starting the application.');
        process.exit(1);
    } else if (warnings > 0) {
        console.log('\n⚠️  Warnings (non-critical):');
        results
            .filter(r => r.status === '⚠️  WARN')
            .forEach(r => {
                console.log(`   - ${r.check}: ${r.message}`);
            });
        console.log('\n✅ Application should start, but consider addressing warnings.');
        process.exit(0);
    } else {
        console.log('\n✅ All checks passed! Application is ready to start.');
        process.exit(0);
    }
}

main().catch(error => {
    console.error('\n❌ Fatal error during debug:', error);
    process.exit(1);
});

