import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase direct connection
const connectionString = 'postgres://postgres:pD7ZhyHFpnttSgfW@db.hrduplvhuglxukyiwmez.supabase.co:5432/postgres';

async function main() {
  console.log('🚀 Setting up NKEY Architects Database...\n');

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected!\n');

    // Read and run schema
    console.log('Creating tables...');
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split and run each statement
    const statements = schema.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await client.query(stmt);
        } catch (e) {
          if (!e.message.includes('already exists')) {
            console.log(`  Warning: ${e.message.substring(0, 50)}`);
          }
        }
      }
    }
    console.log('✓ Tables created!\n');

    // Read and run seed data
    console.log('Seeding data...');
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');

    const seedStatements = seed.split(';').filter(s => s.trim());
    for (const stmt of seedStatements) {
      if (stmt.trim()) {
        try {
          await client.query(stmt);
        } catch (e) {
          if (!e.message.includes('duplicate') && !e.message.includes('already exists')) {
            console.log(`  Warning: ${e.message.substring(0, 50)}`);
          }
        }
      }
    }
    console.log('✓ Data seeded!\n');

    console.log('✅ Database setup complete!\n');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@nkeyarchitects.com');
    console.log('   Password: NkeyAdmin2025!');
    console.log('\n🌐 Dashboard: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

main();
