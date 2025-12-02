import 'dotenv/config';
import { seedMedications } from './seedMedications';

async function main() {
  console.log('🚀 Starting medications database seeding...\n');
  try {
    const result = await seedMedications();
    console.log('\n✅ Medications seeded successfully!');
    console.log(`📊 Total medications: ${result.count}`);
    console.log('\n📋 Sample medications added:');
    result.medications?.slice(0, 10).forEach((med: string, i: number) => {
      console.log(`   ${i + 1}. ${med}`);
    });
    if (result.count > 10) {
      console.log(`   ... and ${result.count - 10} more`);
    }
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding medications:', error);
    process.exit(1);
  }
}

main();

