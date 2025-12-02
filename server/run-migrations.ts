import 'dotenv/config';
import { pool } from './db';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure migrations run in order

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      console.log(`📝 Running migration: ${file}`);
      await pool.query(sql);
      console.log(`✅ Completed: ${file}\n`);
    } catch (error: any) {
      // Ignore "already exists" errors for idempotent migrations
      if (error.message?.includes('already exists')) {
        console.log(`⏭️  Skipped (already exists): ${file}\n`);
      } else {
        console.error(`❌ Failed: ${file}`);
        console.error(error);
        throw error;
      }
    }
  }
  
  console.log('✅ All migrations completed successfully!\n');
  await pool.end();
}

runMigrations()
  .then(() => {
    console.log('Migration process finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

