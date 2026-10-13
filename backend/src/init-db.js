import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractQueries(sqlContent) {
  // Hapus komentar single-line (-- ...) dan block comments (/* ... */)
  const cleanSql = sqlContent
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  return cleanSql
    .split(';')
    .map((q) => q.trim())
    .filter((q) => q.length > 0);
}

async function initDatabase() {
  console.log('--- INISIALISASI BASIS DATA PORTAL DIGITAL TI UNUSIA ---');
  console.log(`Target Database: ${process.env.DB_NAME || 'web_ti_unusia'}`);

  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✓ Berhasil terhubung ke server MySQL.');

    // 1. Eksekusi schema.sql
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Membaca skema tabel dari database/schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const queries = extractQueries(schemaSql);

      for (const query of queries) {
        if (query.toUpperCase().includes('CREATE TABLE')) {
          await connection.query(query);
        }
      }
      console.log(`✓ ${queries.length} definisi tabel berhasil diproses.`);
    }

    // 2. Eksekusi seed.sql
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Memasukkan data awal (seed) dari database/seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      const seedQueries = extractQueries(seedSql);

      for (const query of seedQueries) {
        if (query.toUpperCase().includes('INSERT')) {
          await connection.query(query);
        }
      }
      console.log(`✓ ${seedQueries.length} blok data awal berhasil dimasukkan.`);
    }

    // 3. Verifikasi daftar tabel
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map((t) => Object.values(t)[0]);
    console.log('\n--- DAFTAR TABEL TERDAFTAR DI BASIS DATA ---');
    tableNames.forEach((name, idx) => {
      console.log(`${idx + 1}. ${name}`);
    });

    // 4. Verifikasi jumlah data
    const [userCount] = await connection.query('SELECT COUNT(*) as cnt FROM users');
    const [serviceCount] = await connection.query('SELECT COUNT(*) as cnt FROM academic_services');
    const [announcementCount] = await connection.query('SELECT COUNT(*) as cnt FROM announcements');
    const [submissionCount] = await connection.query('SELECT COUNT(*) as cnt FROM submissions');

    console.log(`\nStatistik Data Aktual:`);
    console.log(`- Pengguna (users):              ${userCount[0].cnt} data`);
    console.log(`- Layanan (academic_services):   ${serviceCount[0].cnt} data`);
    console.log(`- Pengumuman (announcements):    ${announcementCount[0].cnt} data`);
    console.log(`- Pengajuan (submissions):       ${submissionCount[0].cnt} data`);

    console.log('\n✓ INISIALISASI DATABASE SELESAI DENGAN SUKSES.');
  } catch (err) {
    console.error('❌ Gagal menginisialisasi database:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }
}

initDatabase();
