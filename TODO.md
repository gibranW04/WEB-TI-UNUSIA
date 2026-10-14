# TODO.md

# Development Roadmap — Portal Digital TI UNUSIA

Status project: Development
Project: Perancangan dan Pengembangan Portal Digital Teknik Informatika UNUSIA Berbasis Service

## Status Legend

- [ ] Belum dikerjakan
- [x] Sudah selesai dan diverifikasi
- [ ] Jangan tandai selesai sebelum implementasi diperiksa dan diuji

---

## PHASE 1 — Project Foundation

### 1.1 Environment and Structure

- [x] Membuat project root WEB-TI-UNUSIA
- [x] Membuat frontend menggunakan React + Vite
- [x] Menginstal dependensi frontend
- [x] Membuat backend Node.js + Express
- [x] Menginstal express, cors, dotenv, dan mysql2
- [x] Mengatur backend menggunakan ES Modules
- [x] Menginstal dan menjalankan MySQL Server secara mandiri
- [x] Membuat database web_ti_unusia
- [x] Menjalankan backend pada port 3000
- [x] Membuat endpoint GET /api/health
- [x] Membuat endpoint GET /api/db-test
- [x] Memverifikasi komunikasi React ke REST API

Catatan: status di atas berdasarkan progres awal yang sudah dilaporkan. Periksa kondisi aktual sebelum mengubah status.

### 1.2 Project Documentation

- [x] Membuat AGENTS.md
- [x] Membuat TODO.md
- [x] Membuat README.md
- [x] Membuat .gitignore
- [x] Membuat backend/.env.example
- [x] Memastikan file .env tidak masuk Git
- [x] Mendokumentasikan cara menjalankan frontend dan backend

### 1.3 Code Quality

- [x] Memeriksa struktur dan dependensi frontend
- [x] Memeriksa struktur dan dependensi backend
- [x] Menetapkan format response API yang konsisten
- [x] Menetapkan penanganan error yang konsisten
- [x] Memastikan konfigurasi tidak menyimpan secret di source code

---

## PHASE 2 — Frontend Public Portal

### 2.1 UI Foundation

- [x] Menentukan design system
- [x] Menentukan warna, typography, spacing, dan border radius
- [x] Membuat layout utama
- [x] Membuat navbar responsif
- [x] Membuat footer
- [x] Membuat komponen tombol
- [x] Membuat komponen card
- [x] Membuat komponen badge status
- [x] Membuat loading, error, dan empty states

### 2.2 Homepage

- [x] Membuat hero section
- [x] Membuat bagian pengenalan program studi
- [x] Membuat bagian keunggulan atau informasi akademik
- [x] Membuat bagian berita dan pengumuman
- [x] Membuat kartu layanan akademik
- [x] Membuat bagian ajakan untuk mengakses layanan
- [x] Membuat footer dengan informasi institusi
- [x] Menguji tampilan desktop
- [x] Menguji tampilan tablet
- [x] Menguji tampilan ponsel

### 2.3 Public Information Pages

- [ ] Halaman profil program studi
- [ ] Halaman kurikulum
- [ ] Halaman informasi mata kuliah
- [ ] Halaman informasi dosen
- [ ] Halaman berita dan pengumuman
- [ ] Halaman detail berita
- [ ] Halaman informasi magang
- [ ] Halaman informasi skripsi
- [ ] Halaman informasi KKN

Catatan: gunakan data placeholder yang jelas jika data resmi belum tersedia.

---

## PHASE 3 — Database Design

### 3.1 Schema Planning

- [x] Menentukan kebutuhan dan relasi data
- [x] Membuat rancangan ERD
- [x] Menentukan primary key dan foreign key
- [x] Menentukan constraint dan index
- [x] Menentukan aturan status pengajuan

### 3.2 Initial Tables

- [x] users
- [x] announcements
- [x] academic_services
- [x] submissions
- [x] submission_documents
- [x] submission_reviews

Tabel tambahan seperti courses, lecturer_profiles, student_profiles, dan activity_logs hanya dibuat jika dibutuhkan oleh fitur yang disepakati.

### 3.3 Database Implementation

- [x] Membuat skrip SQL pembuatan database dan tabel
- [x] Memeriksa tipe data dan relasi
- [x] Menambahkan index yang diperlukan
- [x] Menguji koneksi dari backend
- [x] Menguji insert, select, update, dan delete pada data uji
- [x] Mendokumentasikan cara menyiapkan database

Peringatan: jangan menghapus atau mereset database yang sudah ada tanpa persetujuan.

---

## PHASE 4 — Backend and REST API

### 4.1 Backend Structure

- [x] Menyusun struktur routes
- [x] Menyusun controllers
- [x] Menyusun middleware
- [x] Menyusun konfigurasi database
- [x] Menyusun validasi input
- [x] Menyusun penanganan error
- [x] Menentukan format response JSON

### 4.2 Public Information API

- [x] GET /api/announcements
- [x] GET /api/announcements/:slug
- [x] GET /api/academic-services
- [x] GET /api/academic-services/:code
- [ ] Endpoint informasi profil program studi
- [ ] Endpoint informasi kurikulum jika diperlukan

Catatan: berdasarkan keputusan pengguna, informasi profil program studi, kurikulum, dan dosen disajikan sebagai placeholder statis di frontend (mudah diganti) tanpa penambahan tabel database. Item di atas tidak dibuat sebagai endpoint pada tahap ini.

### 4.3 Authentication and Authorization

- [x] Menentukan mekanisme autentikasi
- [x] Membuat endpoint registrasi jika diperlukan
- [x] Membuat endpoint login
- [x] Melakukan hashing password
- [x] Membuat middleware autentikasi
- [x] Membuat middleware role authorization
- [x] Membuat endpoint profil pengguna
- [x] Menguji akses untuk setiap peran
- [x] Menangani token kedaluwarsa dan akses tidak sah

Catatan: berdasarkan keputusan pengguna, registrasi mandiri tidak diaktifkan. Akun mahasiswa, dosen, dan admin dikelola oleh admin untuk menghindari pendaftaran publik yang berisiko; item registrasi ditandai selesai karena keputusan telah diambil (tidak diperlukan).

Gunakan JWT atau mekanisme lain yang dipilih secara sadar setelah menilai kebutuhan. Jangan menyimpan password dalam plaintext.

### 4.4 Academic Services API

- [x] Endpoint pengajuan magang
- [x] Endpoint pengajuan skripsi
- [x] Endpoint pengajuan KKN
- [x] Endpoint daftar pengajuan milik mahasiswa
- [x] Endpoint detail pengajuan
- [x] Endpoint unggah dokumen
- [x] Endpoint unduh dokumen (terautentikasi, cek kepemilikan/peran)
- [x] Endpoint status dan catatan revisi
- [x] Endpoint peninjauan oleh dosen
- [x] Endpoint persetujuan atau penolakan
- [x] Validasi akses terhadap setiap pengajuan
- [x] Validasi file yang diunggah

Catatan: validasi unggahan mencakup batas tipe (PDF/DOC/DOCX/JPG/JPEG/PNG), batas ukuran 5MB, serta pemeriksaan magic-byte isi berkas. Dokumen disajikan melalui endpoint terautentikasi, bukan folder statis publik, untuk mencegah kebocoran berkas.

### 4.5 Admin API

- [x] CRUD berita dan pengumuman
- [x] CRUD informasi layanan
- [x] Pengelolaan pengguna
- [x] Pengelolaan peran pengguna
- [x] Pemantauan pengajuan
- [x] Validasi hak akses admin

Catatan: seluruh endpoint berada di bawah `/api/admin`, dilindungi `authenticateToken` + `authorizeRoles('admin')`. Penghapusan pengguna tidak disediakan (menggunakan perubahan status) untuk menjaga integritas data pengajuan. Pengujian: login admin, CRUD berita/layanan, perubahan status & peran, pemantauan pengajuan, serta respons 401 (tanpa token) dan 403 (mahasiswa) telah berhasil.

---

## PHASE 5 — Frontend Integration

### 5.1 API Integration

- [ ] Membuat konfigurasi base URL API
- [ ] Menghubungkan halaman berita ke API
- [ ] Menghubungkan halaman layanan ke API
- [ ] Menangani loading state
- [ ] Menangani error state
- [ ] Menangani empty state
- [ ] Memastikan data tidak hanya berasal dari hardcoded mock data

### 5.2 Authentication UI

- [ ] Membuat halaman login
- [ ] Membuat form validasi
- [ ] Menghubungkan login ke API
- [ ] Membuat logout
- [ ] Menangani sesi atau token
- [ ] Melindungi halaman privat
- [ ] Mengarahkan pengguna berdasarkan peran

### 5.3 Student Dashboard

- [ ] Ringkasan pengajuan
- [ ] Daftar pengajuan
- [ ] Form pengajuan magang
- [ ] Form pengajuan skripsi
- [ ] Form pengajuan KKN
- [ ] Unggah dokumen
- [ ] Tampilan status pengajuan
- [ ] Tampilan catatan revisi
- [ ] Pengelolaan profil sendiri

### 5.4 Lecturer Dashboard

- [ ] Ringkasan pengajuan yang perlu ditinjau
- [ ] Daftar pengajuan yang menjadi tanggung jawab dosen
- [ ] Detail pengajuan
- [ ] Pemeriksaan dokumen
- [ ] Form catatan revisi
- [ ] Persetujuan atau penolakan
- [ ] Pengelolaan profil sendiri

### 5.5 Admin Dashboard

- [ ] Ringkasan sistem
- [ ] Pengelolaan berita
- [ ] Pengelolaan pengumuman
- [ ] Pengelolaan informasi layanan
- [ ] Pengelolaan pengguna
- [ ] Pengelolaan peran
- [ ] Pemantauan pengajuan
- [ ] Konfirmasi untuk tindakan penting

---

## PHASE 6 — Testing and Security

### 6.1 Functional Testing

- [x] Menguji endpoint health
- [x] Menguji koneksi database
- [x] Menguji CRUD informasi publik
- [ ] Menguji login dan logout
- [x] Menguji akses mahasiswa
- [x] Menguji akses dosen
- [x] Menguji akses admin
- [x] Menguji alur pengajuan layanan
- [x] Menguji alur revisi dan persetujuan
- [x] Menguji validasi input

Catatan: pengujian fungsional otomatis tersedia di `backend/tests/run-tests.js` (jalankan `npm test` dari folder backend; server harus aktif dan database sudah di-seed). Hasil terakhir: 79 PASS / 0 FAIL. Item login sudah diuji, namun logout belum diuji karena logout bersifat sisi-klien dan belum ada endpoint logout di backend.

### 6.2 Security Checks

- [x] Memastikan password di-hash
- [x] Memastikan query menggunakan parameter
- [x] Memastikan endpoint privat membutuhkan autentikasi
- [x] Memastikan otorisasi diperiksa di backend
- [x] Memastikan pengguna tidak dapat melihat data pengguna lain tanpa izin
- [x] Memvalidasi tipe dan ukuran file
- [x] Memeriksa CORS
- [x] Memastikan secret tidak terunggah ke GitHub
- [x] Memeriksa pesan error agar tidak membocorkan detail internal

Catatan audit dan perbaikan: otorisasi dosen diperketat (hanya pengajuan dengan `reviewer_id` miliknya), syarat akademik (SKS/semester) ditegakkan saat pengajuan, rate limiting login ditambahkan (`middleware/rateLimit.js`), nomor pengajuan memakai retry anti-tabrakan, transisi status review divalidasi, dan berkas unggahan yang gagal diproses kini dibersihkan (mencegah berkas yatim). Catatan keamanan: password default seed `Password123!` beserta hash-nya berada di `database/seed.sql`; wajib diganti sebelum penggunaan produksi.

### 6.3 Quality Checks

- [ ] Memeriksa console browser
- [x] Memeriksa log backend
- [x] Memastikan tidak ada import yang rusak
- [x] Menjalankan build frontend
- [x] Menjalankan tes backend yang tersedia
- [ ] Menguji tampilan responsif
- [x] Memperbaiki bug prioritas tinggi

Catatan: `npm run build` dan `npm run lint` (oxlint) di frontend berhasil. Pemeriksaan console browser dan pengujian tampilan responsif ditunda ke Phase 5 agar tidak diuji dua kali setelah integrasi frontend.

Catatan tindak lanjut: belum ada mekanisme penugasan reviewer (endpoint admin untuk menetapkan `reviewer_id` atau aksi "ambil tugas" oleh dosen). Karena dosen kini hanya mengakses pengajuan yang ditugaskan, mekanisme ini perlu dibuat sebelum dashboard dosen pada Phase 5.

---

## PHASE 7 — GitHub and Documentation

### 7.1 Git

- [x] Menginisialisasi atau memeriksa repository Git
- [x] Memeriksa .gitignore
- [x] Memastikan .env tidak terlacak
- [x] Membuat commit berdasarkan fitur
- [x] Menyinkronkan repository dengan GitHub
- [x] Memeriksa repository sebelum dibagikan

### 7.2 Documentation

- [ ] Memperbarui README.md
- [ ] Mendokumentasikan arsitektur sistem
- [ ] Mendokumentasikan endpoint API
- [ ] Mendokumentasikan skema database
- [ ] Menyediakan contoh environment configuration
- [ ] Menyediakan instruksi instalasi
- [ ] Menyediakan instruksi menjalankan aplikasi
- [ ] Mendokumentasikan pengujian

### 7.3 Academic Deliverables

- [ ] Menyelesaikan flowchart sistem
- [ ] Menyelesaikan use case diagram
- [ ] Menyelesaikan ERD
- [ ] Menyelesaikan diagram arsitektur service
- [ ] Menyusun laporan PDF
- [ ] Menyiapkan demo aplikasi
- [ ] Menyiapkan penjelasan frontend, backend, API, dan database

---

## PHASE 8 — Final Verification

- [ ] Frontend dapat dijalankan secara lokal
- [ ] Backend dapat dijalankan secara lokal
- [ ] MySQL dapat diakses oleh backend
- [ ] Frontend berhasil mengambil data dari API
- [ ] Fitur inti sudah diuji
- [ ] Hak akses setiap peran sudah diuji
- [ ] Tidak ada secret yang masuk repository
- [ ] Dokumentasi sesuai implementasi aktual
- [ ] TODO.md mencerminkan status pekerjaan sebenarnya
- [ ] Aplikasi siap didemonstrasikan

---

## Rules for Updating This File

1. Tandai [x] hanya jika pekerjaan sudah benar-benar selesai dan diverifikasi.
2. Jangan menandai seluruh fase selesai hanya karena file atau komponen telah dibuat.
3. Jika hanya sebagian selesai, biarkan checklist sisanya tetap [ ].
4. Tambahkan catatan jika ada hambatan, keputusan, atau dependensi.
5. Jangan menghapus tugas yang belum selesai tanpa persetujuan.
6. Prioritaskan tugas yang menjadi dependensi fitur berikutnya.
7. Setelah setiap sesi coding, laporkan checklist yang berubah.
