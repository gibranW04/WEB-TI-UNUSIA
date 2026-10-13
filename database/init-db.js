import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env dari backend/.env
const envPath = path.resolve(__dirname, '../backend/.env');
dotenv.config({ path: envPath });

async function initDatabase() {
  console.log('--- INISIALISASI BASIS DATA PORTAL DIGITAL TI UNUSIA ---');
  console.log(`Target Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  console.log(`Database:    ${process.env.DB_NAME || 'web_ti_unusia'}`);
  console.log(`User:        ${process.env.DB_USER || 'root'}`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'web_ti_unusia',
      multipleStatements: true,
    });

    console.log('✓ Berhasil terhubung ke server MySQL.');

    // 1. Jalankan schema.sql
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Mengeksekusi skema tabel dari database/schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✓ Seluruh tabel berhasil dibuat / diverifikasi.');
    }

    // 2. Jalankan seed.sql
    const seedPath = path.resolve(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Memasukkan data awal (seed) dari database/seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✓ Data awal berhasil dimasukkan.');
    }

    // 3. Verifikasi daftar tabel yang telah dibuat
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map((t) => Object.values(t)[0]);
    console.log('\n--- DAFTAR TABEL TERDAFTAR DI BASIS DATA ---');
    tableNames.forEach((name, idx) => {
      console.log(`${idx + 1}. ${name}`);
    });

    // 4. Hitung jumlah data awal
    const [userCount] = await connection.query('SELECT COUNT(*) as cnt FROM users');
    const [serviceCount] = await connection.query('SELECT COUNT(*) as cnt FROM academic_services');
    const [announcementCount] = await connection.query('SELECT COUNT(*) as cnt FROM announcements');
    console.log(`\nStatistik Data: ${userCount[0].cnt} Pengguna, ${serviceCount[0].cnt} Layanan, ${announcementCount[0].cnt} Pengumuman.`);

    console.log('\n✓ INISIALISASI DATABASE SELESAI DENGAN SUKSES.');
  } catch (err) {
    console.error('❌ Gagal menginisialisasi database:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
