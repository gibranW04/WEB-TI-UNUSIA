import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pool from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const SEED_PASSWORD = 'Password123!';
const SEED_ADMIN = 'admin';
const SEED_DOSEN = '0412345678';
const SEED_MAHASISWA = '21102001';

let passed = 0;
let failed = 0;
const failures = [];

const created = {
  submissions: [],
  announcements: [],
  services: [],
  files: [],
};

function section(title) {
  console.log(`\n=== ${title} ===`);
}

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    failures.push(detail ? `${name} — ${detail}` : name);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function api(endpoint, { method = 'GET', token, body, headers = {} } = {}) {
  const isForm = body instanceof FormData;
  const finalHeaders = { Connection: 'close', ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (body && !isForm) finalHeaders['Content-Type'] = 'application/json';

  const response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let json = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    json = await response.json().catch(() => null);
  }

  return { status: response.status, json, headers: response.headers };
}

async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw lastError;
}

async function login(identifier, password = SEED_PASSWORD) {
  return api('/api/auth/login', {
    method: 'POST',
    body: { identifier, password },
  });
}

function buildPdfBlob() {
  return new Blob([Buffer.from('%PDF-1.4\n% uji otomatis portal\n%%EOF')], {
    type: 'application/pdf',
  });
}

function buildFakePdfBlob() {
  return new Blob([Buffer.from('ini bukan pdf sebenarnya')], { type: 'application/pdf' });
}

async function run() {
  section('6.1 Health & Koneksi Database');
  const health = await api('/api/health');
  check('GET /api/health status 200', health.status === 200, `dapat ${health.status}`);
  check('GET /api/health success=true', health.json?.success === true);

  const dbTest = await api('/api/db-test');
  check('GET /api/db-test status 200', dbTest.status === 200, `dapat ${dbTest.status}`);
  check('GET /api/db-test terhubung ke web_ti_unusia', dbTest.json?.database === 'web_ti_unusia', `database=${dbTest.json?.database}`);

  const notFound = await api('/api/rute-tidak-ada');
  check('Rute tidak dikenal mengembalikan 404', notFound.status === 404, `dapat ${notFound.status}`);
  check('Pesan 404 tidak membocorkan detail internal', !/stack|SQL|mysql|at Object/i.test(notFound.json?.message || ''));

  section('6.1 Informasi Publik (announcements & academic-services)');
  const announcements = await api('/api/announcements');
  check('GET /api/announcements status 200', announcements.status === 200, `dapat ${announcements.status}`);
  const annList = announcements.json?.data || [];
  check('Daftar pengumuman berupa array', Array.isArray(annList));
  check('Hanya pengumuman is_published=1 yang tampil', annList.every((a) => a.is_published === 1 || a.is_published === true));

  const seedSlug = 'sosialisasi-pengajuan-judul-skripsi-genap-2026';
  const annDetail = await api(`/api/announcements/${seedSlug}`);
  check('GET detail pengumuman seed status 200', annDetail.status === 200, `dapat ${annDetail.status}`);
  check('Detail pengumuman punya field content', typeof annDetail.json?.data?.content === 'string');

  const annMissing = await api('/api/announcements/slug-tidak-ada');
  check('Slug tidak ada mengembalikan 404', annMissing.status === 404, `dapat ${annMissing.status}`);

  const services = await api('/api/academic-services');
  check('GET /api/academic-services status 200', services.status === 200, `dapat ${services.status}`);
  check('Minimal 3 layanan akademik', (services.json?.data || []).length >= 3);

  const svcDetail = await api('/api/academic-services/skripsi');
  check('GET detail layanan skripsi status 200', svcDetail.status === 200, `dapat ${svcDetail.status}`);

  const svcMissing = await api('/api/academic-services/tidak-ada');
  check('Kode layanan tidak ada mengembalikan 404', svcMissing.status === 404, `dapat ${svcMissing.status}`);

  const injection = await api("/api/academic-services/'%20OR%20'1'='1");
  check('Percobaan SQL injection tidak mengembalikan daftar', injection.status === 404, `dapat ${injection.status}`);

  section('6.1 & 6.2 Autentikasi');
  const adminLogin = await login(SEED_ADMIN);
  check('Login admin berhasil', adminLogin.status === 200 && !!adminLogin.json?.data?.token, `dapat ${adminLogin.status}`);
  const adminToken = adminLogin.json?.data?.token;
  const adminId = adminLogin.json?.data?.user?.id;

  const dosenLogin = await login(SEED_DOSEN);
  check('Login dosen berhasil', dosenLogin.status === 200 && !!dosenLogin.json?.data?.token, `dapat ${dosenLogin.status}`);
  const dosenToken = dosenLogin.json?.data?.token;
  const dosenId = dosenLogin.json?.data?.user?.id;

  const mhsLogin = await login(SEED_MAHASISWA);
  check('Login mahasiswa berhasil', mhsLogin.status === 200 && !!mhsLogin.json?.data?.token, `dapat ${mhsLogin.status}`);
  const mhsToken = mhsLogin.json?.data?.token;
  const mhsId = mhsLogin.json?.data?.user?.id;

  check('Respons login tidak menyertakan password', !('password' in (mhsLogin.json?.data?.user || {})));

  const wrongPass = await login(SEED_MAHASISWA, 'password-salah');
  check('Login password salah mengembalikan 401', wrongPass.status === 401, `dapat ${wrongPass.status}`);
  check('Pesan login gagal tidak menyebut akun mana yang ada', !/tidak ditemukan|tidak terdaftar/i.test(wrongPass.json?.message || ''));

  const meNoToken = await api('/api/auth/me');
  check('GET /api/auth/me tanpa token mengembalikan 401', meNoToken.status === 401, `dapat ${meNoToken.status}`);

  const meToken = await api('/api/auth/me', { token: mhsToken });
  check('GET /api/auth/me dengan token status 200', meToken.status === 200, `dapat ${meToken.status}`);
  check('Profil /me tidak menyertakan password', meToken.json?.data && !('password' in meToken.json.data));

  section('6.1 Otorisasi Per Peran');
  const subNoToken = await api('/api/submissions');
  check('GET /api/submissions tanpa token 401', subNoToken.status === 401, `dapat ${subNoToken.status}`);

  const adminNoToken = await api('/api/admin/stats');
  check('GET /api/admin/stats tanpa token 401', adminNoToken.status === 401, `dapat ${adminNoToken.status}`);

  const adminAsMhs = await api('/api/admin/stats', { token: mhsToken });
  check('Mahasiswa ke /api/admin/stats 403', adminAsMhs.status === 403, `dapat ${adminAsMhs.status}`);

  const adminAsDosen = await api('/api/admin/stats', { token: dosenToken });
  check('Dosen ke /api/admin/stats 403', adminAsDosen.status === 403, `dapat ${adminAsDosen.status}`);

  const adminStats = await api('/api/admin/stats', { token: adminToken });
  check('Admin ke /api/admin/stats 200', adminStats.status === 200, `dapat ${adminStats.status}`);

  const mhsToAdminReview = await api('/api/submissions/1/reviews', {
    method: 'POST',
    token: mhsToken,
    body: { action: 'approved', review_notes: 'coba-coba' },
  });
  check('Mahasiswa tidak boleh meninjau pengajuan 403', mhsToAdminReview.status === 403, `dapat ${mhsToAdminReview.status}`);

  section('6.1 & 6.2 Alur Pengajuan Layanan');
  const [svcRows] = await pool.query("SELECT id FROM academic_services WHERE code = 'skripsi' LIMIT 1");
  const skripsiId = svcRows[0]?.id;

  const createSub = await api('/api/submissions', {
    method: 'POST',
    token: mhsToken,
    body: {
      service_code: 'skripsi',
      title: 'UJI OTOMATIS - Rancang Bangun Sistem Uji',
      agency_name: 'Lab Uji',
      agency_address: 'Jl. Uji No. 1',
      notes: 'Dibuat oleh skrip uji Phase 6',
    },
  });
  check('Mahasiswa dapat membuat pengajuan 201', createSub.status === 201, `dapat ${createSub.status}: ${createSub.json?.message}`);
  const subId = createSub.json?.data?.id;
  if (subId) created.submissions.push(subId);
  check('Nomor pengajuan berformat SUB-XX-YYYY-NNNN', /^SUB-[A-Z]{2}-\d{4}-\d{4}$/.test(createSub.json?.data?.submission_number || ''));

  // Tugaskan dosen seed sebagai reviewer untuk pengujian akses (data uji, bukan seed)
  if (subId && dosenId) {
    await pool.query('UPDATE submissions SET reviewer_id = ? WHERE id = ?', [dosenId, subId]);
  }

  const listMhs = await api('/api/submissions', { token: mhsToken });
  check('Mahasiswa melihat daftar pengajuan miliknya', listMhs.status === 200 && (listMhs.json?.data || []).some((s) => s.id === subId));

  const detailOwner = await api(`/api/submissions/${subId}`, { token: mhsToken });
  check('Pemilik dapat melihat detail pengajuan', detailOwner.status === 200, `dapat ${detailOwner.status}`);

  const listDosen = await api('/api/submissions', { token: dosenToken });
  check('Dosen melihat pengajuan yang ditugaskan', listDosen.status === 200 && (listDosen.json?.data || []).some((s) => s.id === subId));

  const detailDosen = await api(`/api/submissions/${subId}`, { token: dosenToken });
  check('Dosen yang ditugaskan dapat melihat detail', detailDosen.status === 200, `dapat ${detailDosen.status}`);

  // Unggah dokumen
  const uploadForm = new FormData();
  uploadForm.append('document_type', 'proposal');
  uploadForm.append('document', buildPdfBlob(), 'uji-proposal.pdf');
  const uploadOk = await api(`/api/submissions/${subId}/documents`, {
    method: 'POST',
    token: mhsToken,
    body: uploadForm,
  });
  check('Mahasiswa dapat mengunggah dokumen PDF 201', uploadOk.status === 201, `dapat ${uploadOk.status}: ${uploadOk.json?.message}`);

  const [docRows] = await pool.query(
    'SELECT id, file_path FROM submission_documents WHERE submission_id = ? ORDER BY id DESC LIMIT 1',
    [subId]
  );
  const docId = docRows[0]?.id;
  if (docRows[0]?.file_path) created.files.push(docRows[0].file_path);

  const detailWithDoc = await api(`/api/submissions/${subId}`, { token: mhsToken });
  check('Detail pengajuan memuat dokumen terlampir', (detailWithDoc.json?.data?.documents || []).some((d) => d.id === docId));

  const downloadMhs = await api(`/api/submissions/${subId}/documents/${docId}/download`, { token: mhsToken });
  check('Pemilik dapat mengunduh dokumen', downloadMhs.status === 200, `dapat ${downloadMhs.status}`);

  const downloadDosen = await api(`/api/submissions/${subId}/documents/${docId}/download`, { token: dosenToken });
  check('Dosen yang ditugaskan dapat mengunduh dokumen', downloadDosen.status === 200, `dapat ${downloadDosen.status}`);

  // Review oleh dosen yang ditugaskan
  const reviewOk = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'commented', review_notes: 'Menunggu kelengkapan berkas.' },
  });
  check('Dosen yang ditugaskan dapat memberi review 200', reviewOk.status === 200, `dapat ${reviewOk.status}: ${reviewOk.json?.message}`);
  check('Status pengajuan berubah menjadi in_review', reviewOk.json?.data?.status === 'in_review');

  const detailAfterReview = await api(`/api/submissions/${subId}`, { token: mhsToken });
  check('Catatan review muncul di detail pengajuan', (detailAfterReview.json?.data?.reviews || []).length > 0);

  const revisionReq = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'revision_required', review_notes: 'Mohon revisi Bab 2.' },
  });
  check('Dosen dapat meminta revisi 200', revisionReq.status === 200, `dapat ${revisionReq.status}`);
  check('Status pengajuan menjadi revision_required', revisionReq.json?.data?.status === 'revision_required');

  const approved = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'approved', review_notes: 'Revisi diterima, disetujui.' },
  });
  check('Dosen dapat menyetujui pengajuan 200', approved.status === 200, `dapat ${approved.status}`);
  check('Status pengajuan menjadi approved', approved.json?.data?.status === 'approved');

  const rejected = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'rejected', review_notes: 'Pengajuan ditolak.' },
  });
  check('Dosen dapat menolak pengajuan 200', rejected.status === 200, `dapat ${rejected.status}`);
  check('Status pengajuan menjadi rejected', rejected.json?.data?.status === 'rejected');

  const afterTerminalReview = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'commented', review_notes: 'Mencoba setelah final.' },
  });
  check('Pengajuan final (rejected) tidak dapat ditinjau lagi 400', afterTerminalReview.status === 400, `dapat ${afterTerminalReview.status}`);

  section('6.2 Isolasi Data Antar Pengguna');
  // Buat pengajuan uji milik pengguna lain (dosen id) langsung via DB untuk menguji isolasi
  let foreignSubId = null;
  if (skripsiId && dosenId) {
    const [ins] = await pool.query(
      `INSERT INTO submissions (submission_number, service_id, student_id, title, status, current_step)
       VALUES (?, ?, ?, ?, 'submitted', 1)`,
      [`SUB-UI-${Date.now().toString().slice(-6)}`, skripsiId, dosenId, 'UJI OTOMATIS - pengajuan pengguna lain']
    );
    foreignSubId = ins.insertId;
    created.submissions.push(foreignSubId);
  }

  const foreignMhs = await api(`/api/submissions/${foreignSubId}`, { token: mhsToken });
  check('Mahasiswa tidak dapat melihat pengajuan pengguna lain 403', foreignMhs.status === 403, `dapat ${foreignMhs.status}`);

  const foreignDosen = await api(`/api/submissions/${foreignSubId}`, { token: dosenToken });
  check('Dosen tidak dapat melihat pengajuan yang bukan tugasnya 403', foreignDosen.status === 403, `dapat ${foreignDosen.status}`);

  const foreignReview = await api(`/api/submissions/${foreignSubId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'approved', review_notes: 'mencoba' },
  });
  check('Dosen tidak dapat meninjau pengajuan bukan tugasnya 403', foreignReview.status === 403, `dapat ${foreignReview.status}`);

  const adminForeign = await api(`/api/submissions/${foreignSubId}`, { token: adminToken });
  check('Admin dapat melihat semua pengajuan 200', adminForeign.status === 200, `dapat ${adminForeign.status}`);

  section('6.1 & 6.2 Validasi Input');
  const missingTitle = await api('/api/submissions', {
    method: 'POST',
    token: mhsToken,
    body: { service_code: 'skripsi' },
  });
  check('Buat pengajuan tanpa judul 400', missingTitle.status === 400, `dapat ${missingTitle.status}`);

  const unknownService = await api('/api/submissions', {
    method: 'POST',
    token: mhsToken,
    body: { service_code: 'layanan-tidak-ada', title: 'Uji' },
  });
  check('Buat pengajuan layanan tidak dikenal 404', unknownService.status === 404, `dapat ${unknownService.status}`);

  // Layanan ber-syarat tinggi untuk menguji penegakan eligibility
  const highService = await api('/api/admin/services', {
    method: 'POST',
    token: adminToken,
    body: {
      code: 'uji-syarat-tinggi',
      name: 'Layanan Uji Syarat Tinggi',
      short_description: 'Dibuat skrip uji Phase 6',
      min_credits: 200,
      min_semester: 12,
      is_active: 1,
    },
  });
  const highServiceId = highService.json?.data?.id;
  if (highServiceId) created.services.push(highServiceId);

  const ineligible = await api('/api/submissions', {
    method: 'POST',
    token: mhsToken,
    body: { service_code: 'uji-syarat-tinggi', title: 'Uji syarat' },
  });
  check('Pengajuan yang tidak memenuhi syarat SKS/semester 403', ineligible.status === 403, `dapat ${ineligible.status}: ${ineligible.json?.message}`);

  const badDocTypeForm = new FormData();
  badDocTypeForm.append('document_type', 'jenis-ngawur');
  badDocTypeForm.append('document', buildPdfBlob(), 'x.pdf');
  const badDocType = await api(`/api/submissions/${subId}/documents`, {
    method: 'POST',
    token: mhsToken,
    body: badDocTypeForm,
  });
  check('Jenis dokumen tidak valid 400', badDocType.status === 400, `dapat ${badDocType.status}`);

  const noFileForm = new FormData();
  noFileForm.append('document_type', 'proposal');
  const noFile = await api(`/api/submissions/${subId}/documents`, {
    method: 'POST',
    token: mhsToken,
    body: noFileForm,
  });
  check('Unggah tanpa file 400', noFile.status === 400, `dapat ${noFile.status}`);

  const wrongTypeForm = new FormData();
  wrongTypeForm.append('document_type', 'proposal');
  wrongTypeForm.append('document', new Blob([Buffer.from('plain text')], { type: 'text/plain' }), 'x.txt');
  const wrongType = await api(`/api/submissions/${subId}/documents`, {
    method: 'POST',
    token: mhsToken,
    body: wrongTypeForm,
  });
  check('Tipe file tidak diizinkan 400', wrongType.status === 400, `dapat ${wrongType.status}`);

  const fakePdfForm = new FormData();
  fakePdfForm.append('document_type', 'proposal');
  fakePdfForm.append('document', buildFakePdfBlob(), 'palsu.pdf');
  const fakePdf = await api(`/api/submissions/${subId}/documents`, {
    method: 'POST',
    token: mhsToken,
    body: fakePdfForm,
  });
  check('Konten file tidak sesuai magic-byte 400', fakePdf.status === 400, `dapat ${fakePdf.status}`);

  const badAction = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'aksi-ngawur', review_notes: 'catatan' },
  });
  check('Action review tidak valid 400', badAction.status === 400, `dapat ${badAction.status}`);

  const badNotes = await api(`/api/submissions/${subId}/reviews`, {
    method: 'POST',
    token: dosenToken,
    body: { action: 'approved' },
  });
  check('Review tanpa catatan 400', badNotes.status === 400, `dapat ${badNotes.status}`);

  section('6.1 CRUD Admin');
  const adminUsers = await api('/api/admin/users', { token: adminToken });
  check('Admin dapat mengambil daftar pengguna 200', adminUsers.status === 200, `dapat ${adminUsers.status}`);
  const userData = adminUsers.json?.data || [];
  check('Daftar pengguna tidak memuat password', userData.every((u) => !('password' in u)));

  const selfStatus = await api(`/api/admin/users/${adminId}/status`, {
    method: 'PATCH',
    token: adminToken,
    body: { status: 'inactive' },
  });
  check('Admin tidak dapat menonaktifkan akun sendiri 400', selfStatus.status === 400, `dapat ${selfStatus.status}`);

  const createAnn = await api('/api/admin/announcements', {
    method: 'POST',
    token: adminToken,
    body: {
      title: 'UJI OTOMATIS Pengumuman',
      category: 'pengumuman',
      summary: 'Ringkasan uji otomatis',
      content: 'Konten uji otomatis',
      is_published: false,
    },
  });
  check('Admin membuat pengumuman draft 201', createAnn.status === 201, `dapat ${createAnn.status}`);
  const annId = createAnn.json?.data?.id;
  if (annId) created.announcements.push(annId);

  const publicList = await api('/api/announcements');
  check('Pengumuman draft tidak tampil di endpoint publik', !(publicList.json?.data || []).some((a) => a.id === annId));

  const updateAnn = await api(`/api/admin/announcements/${annId}`, {
    method: 'PUT',
    token: adminToken,
    body: {
      title: 'UJI OTOMATIS Pengumuman (diperbarui)',
      category: 'pengumuman',
      summary: 'Ringkasan diperbarui',
      content: 'Konten diperbarui',
    },
  });
  check('Admin memperbarui pengumuman 200', updateAnn.status === 200, `dapat ${updateAnn.status}`);

  section('6.2 Keamanan');
  const [pwRows] = await pool.query("SELECT password FROM users WHERE username = ? LIMIT 1", [SEED_ADMIN]);
  const storedPassword = pwRows[0]?.password || '';
  check('Password tersimpan dalam bentuk hash bcrypt', /^\$2[aby]\$/.test(storedPassword));
  check('Password tidak tersimpan plaintext', storedPassword !== SEED_PASSWORD);

  const corsAllowed = await fetchWithRetry(`${BASE_URL}/api/health`, {
    headers: { Origin: 'http://localhost:5173', Connection: 'close' },
  });
  check('CORS mengizinkan origin frontend', corsAllowed.headers.get('access-control-allow-origin') === 'http://localhost:5173', `dapat ${corsAllowed.headers.get('access-control-allow-origin')}`);

  const corsDenied = await fetchWithRetry(`${BASE_URL}/api/health`, {
    headers: { Origin: 'http://situs-jahat.example.com', Connection: 'close' },
  });
  const deniedHeader = corsDenied.headers.get('access-control-allow-origin');
  check('CORS menolak origin tidak dikenal', deniedHeader !== 'http://situs-jahat.example.com' && deniedHeader !== '*', `dapat ${deniedHeader}`);

  try {
    const tracked = execSync('git ls-files', { cwd: REPO_ROOT }).toString().split('\n').map((l) => l.trim()).filter(Boolean);
    check('Tidak ada file .env yang terlacak Git', !tracked.some((f) => /(^|\/)\.env$/.test(f)));
    check('Contoh konfigurasi .env.example tersedia', tracked.some((f) => f.endsWith('.env.example')));
  } catch (error) {
    check('Pemeriksaan Git berhasil dijalankan', false, error.message);
  }

  section('6.1 Akun Nonaktif');
  const [dosenBefore] = await pool.query('SELECT status FROM users WHERE id = ?', [dosenId]);
  try {
    await api(`/api/admin/users/${dosenId}/status`, {
      method: 'PATCH',
      token: adminToken,
      body: { status: 'inactive' },
    });
    const inactiveLogin = await login(SEED_DOSEN);
    check('Login akun nonaktif ditolak 403', inactiveLogin.status === 403, `dapat ${inactiveLogin.status}`);
  } finally {
    await api(`/api/admin/users/${dosenId}/status`, {
      method: 'PATCH',
      token: adminToken,
      body: { status: dosenBefore[0]?.status || 'active' },
    });
  }

  section('6.2 Rate Limiting Login');
  let hitLimit = false;
  for (let i = 0; i < 12; i += 1) {
    const attempt = await login(SEED_MAHASISWA, 'password-salah');
    if (attempt.status === 429) {
      hitLimit = true;
      break;
    }
  }
  check('Percobaan login berulang menghasilkan 429', hitLimit);
}

async function cleanup() {
  section('Pembersihan Data Uji');
  try {
    for (const id of created.submissions) {
      const [rows] = await pool.query(
        'SELECT file_path FROM submission_documents WHERE submission_id = ?',
        [id]
      );
      for (const row of rows) {
        if (row.file_path) created.files.push(row.file_path);
      }
    }

    for (const filePath of created.files) {
      const absolute = path.resolve(REPO_ROOT, 'backend', filePath.replace(/^\/+/, ''));
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    }

    if (created.submissions.length > 0) {
      await pool.query('DELETE FROM submissions WHERE id IN (?)', [created.submissions]);
    }
    if (created.announcements.length > 0) {
      await pool.query('DELETE FROM announcements WHERE id IN (?)', [created.announcements]);
    }
    if (created.services.length > 0) {
      await pool.query('DELETE FROM academic_services WHERE id IN (?)', [created.services]);
    }
    console.log(`  OK    Menghapus ${created.submissions.length} pengajuan, ${created.announcements.length} pengumuman, ${created.services.length} layanan uji.`);
  } catch (error) {
    console.log(`  WARN  Pembersihan gagal: ${error.message}`);
  }
}

try {
  await run();
} catch (error) {
  failed += 1;
  failures.push(`Eksekusi terhenti: ${error.message}`);
  console.error('\nEksekusi uji terhenti:', error.message);
} finally {
  await cleanup();
  await pool.end();

  console.log('\n========================================');
  console.log(`RINGKASAN: ${passed} PASS / ${failed} FAIL`);
  if (failures.length > 0) {
    console.log('Gagal:');
    failures.forEach((f) => console.log(`  - ${f}`));
  }
  console.log('========================================');
  process.exitCode = failed > 0 ? 1 : 0;
}
