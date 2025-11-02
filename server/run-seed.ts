import { seedLabCatalog } from './seedLabCatalog';

async function main() {
  console.log('Starting lab catalog seeding...');
  try {
    const result = await seedLabCatalog();
    console.log('\n✅ Lab catalog seeded successfully!');
    console.log('Results:', result);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding lab catalog:', error);
    process.exit(1);
  }
}

main();
