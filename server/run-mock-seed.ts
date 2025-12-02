import { seedMockData } from './seedMockData';

async function main() {
    console.log('Starting mock data seeding...');
    try {
        const result = await seedMockData();
        console.log('\n✅ Mock data seeded successfully!');
        console.log('Results:', result);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding mock data:', error);
        process.exit(1);
    }
}

main();

