# AGENTS.md
# AI Coding Instructions — Portal Digital TI UNUSIA

## 1. Project Overview

Nama project: Perancangan dan Pengembangan Portal Digital Teknik Informatika UNUSIA Berbasis Service.

Project ini merupakan portal digital untuk menyampaikan informasi program studi dan menyediakan layanan akademik bagi mahasiswa, dosen, dan admin.

Tujuan pengembangan:
- Menyediakan informasi program studi Teknik Informatika UNUSIA.
- Menampilkan berita, pengumuman, kegiatan, dan informasi akademik.
- Menyediakan layanan pengajuan magang, skripsi, dan KKN.
- Mengimplementasikan komunikasi frontend dan backend melalui REST API.
- Menyimpan dan mengelola data menggunakan MySQL.
- Menerapkan hak akses berdasarkan peran pengguna.

## 2. Mandatory Technology Stack

Frontend:
- React
- Vite
- JavaScript
- HTML
- CSS

Backend:
- Node.js
- Express.js
- JavaScript ES Modules
- REST API

Database:
- MySQL Server
- mysql2/promise untuk koneksi database

Development tools:
- Visual Studio Code
- OpenCode
- Antigravity
- Git dan GitHub

## 3. Restrictions

WAJIB mematuhi aturan berikut:
- DILARANG menggunakan PHP.
- DILARANG menggunakan Laravel.
- DILARANG menjadikan Laragon sebagai kebutuhan project.
- Gunakan MySQL Server yang sudah terpasang secara mandiri.
- Jangan mengganti teknologi utama tanpa persetujuan pengguna.
- Jangan membuat ulang project dari nol jika struktur yang ada masih bisa digunakan.
- Jangan menghapus file, konfigurasi, atau kode yang sudah berfungsi tanpa alasan yang jelas.
- Jangan menjalankan perintah yang menghapus database, tabel, data, atau file secara massal tanpa persetujuan eksplisit.
- Jangan menjalankan perintah destruktif seperti DROP DATABASE, DROP TABLE, atau reset database tanpa persetujuan.
- Jangan pernah menampilkan password, token, atau secret ke log, dokumentasi, Git, maupun output yang tidak diperlukan.
- Jangan menimpa file .env yang sudah ada.
- Jangan mengubah package.json secara sembarangan hingga merusak dependensi yang sudah terpasang.

## 4. Existing Project State

Project root:
WEB-TI-UNUSIA/

Folder frontend:
- Dibuat menggunakan React + Vite.
- Dependensi sudah dipasang.
- Frontend pernah berhasil dijalankan menggunakan npm run dev.
- Endpoint backend sudah pernah berhasil diakses dari frontend.

Folder backend:
- Menggunakan Node.js dan Express.
- Dependensi express, cors, dotenv, dan mysql2 sudah dipasang.
- package.json menggunakan "type": "module".
- Script dev menggunakan node --watch src/server.js.
- Script start menggunakan node src/server.js.
- Endpoint GET /api/health sudah dibuat.
- Endpoint GET /api/db-test sudah dibuat untuk menguji koneksi database.

Database:
- Nama database: portal_ti_unusia.
- MySQL Server berjalan sebagai service Windows.
- Kredensial harus dibaca dari environment variables.

Status di atas merupakan kondisi awal yang diketahui. Periksa file aktual sebelum melakukan perubahan karena implementasi dapat berkembang.

## 5. Architecture

Gunakan arsitektur berikut:

User
  -> React Frontend
  -> REST API
  -> Express Backend
  -> MySQL Database

Alur data:
1. Pengguna berinteraksi dengan frontend.
2. Frontend mengirim HTTP request ke REST API.
3. Backend memvalidasi request.
4. Backend menjalankan business logic.
5. Backend berkomunikasi dengan MySQL jika diperlukan.
6. Backend mengembalikan response JSON.
7. Frontend menampilkan hasil kepada pengguna.

Aturan:
- Frontend tidak boleh mengakses MySQL secara langsung.
- Kredensial database hanya boleh berada di backend.
- Business logic dan validasi penting dilakukan di backend.
- Gunakan status HTTP yang sesuai.
- Format response API harus konsisten.
- Jangan mengirim password atau data sensitif dalam response.
- Pisahkan route, controller, dan akses database secara bertahap ketika project berkembang.

## 6. User Roles

### Mahasiswa
- Melihat informasi program studi.
- Melihat berita dan pengumuman.
- Mengajukan magang.
- Mengajukan skripsi.
- Mendaftar atau mengajukan layanan KKN.
- Mengunggah dokumen sesuai ketentuan.
- Melihat status pengajuan.
- Memperbaiki dokumen jika diminta revisi.
- Mengelola profil sendiri.

### Dosen
- Melihat informasi program studi.
- Melihat pengajuan yang menjadi tanggung jawabnya.
- Meninjau dokumen mahasiswa.
- Memberikan persetujuan, penolakan, atau permintaan revisi.
- Memberikan catatan terhadap pengajuan.
- Mengelola profil sendiri.

### Admin
- Mengelola informasi program studi.
- Mengelola berita dan pengumuman.
- Mengelola informasi layanan akademik.
- Mengelola pengguna dan peran.
- Memantau pengajuan layanan.
- Mengelola dokumen dan konfigurasi portal sesuai hak akses.

Hak akses harus diperiksa oleh backend, bukan hanya dengan menyembunyikan tombol di frontend.

## 7. UI/UX Guidelines

Buat tampilan portal akademik yang modern, profesional, bersih, dan responsif.

Arah desain:
- Gaya website institusi pendidikan modern.
- Warna dasar putih, biru tua, dan abu-abu netral.
- Gunakan warna aksen secara konsisten.
- Typography mudah dibaca.
- Hierarki visual yang jelas.
- Spacing konsisten.
- Card dengan border atau shadow yang halus.
- Navbar jelas dan mudah digunakan.
- Tombol, input, tabel, badge status, dan modal memiliki desain konsisten.
- Animasi sederhana dan tidak mengganggu.
- Responsif pada desktop, tablet, dan ponsel.
- Perhatikan aksesibilitas, kontras warna, label input, dan navigasi keyboard.

Halaman publik perlu memiliki:
- Navbar.
- Hero section.
- Profil singkat program studi.
- Informasi akademik.
- Berita dan pengumuman.
- Kartu layanan magang, skripsi, dan KKN.
- Footer dengan informasi institusi.

Dashboard setelah login harus menyesuaikan peran pengguna.

Jangan mengarang logo resmi, data dosen, alamat, akreditasi, atau informasi institusi yang belum diverifikasi. Gunakan placeholder yang mudah diganti jika data resmi belum tersedia.

Hindari tampilan template bawaan Vite pada hasil akhir.

## 8. Coding Standards

- Gunakan JavaScript yang jelas dan konsisten.
- Gunakan nama variabel, fungsi, dan komponen yang deskriptif.
- Gunakan React functional components dan hooks jika diperlukan.
- Pecah komponen yang terlalu besar menjadi komponen yang dapat digunakan ulang.
- Hindari duplikasi kode.
- Hindari penggunaan library tambahan tanpa kebutuhan yang jelas.
- Hindari penggunaan `any` atau pola dinamis yang menyulitkan debugging jika tidak diperlukan.
- Tangani loading, error, dan empty state pada UI yang mengambil data API.
- Jangan menyimpan secret di frontend.
- Gunakan async/await untuk operasi asynchronous jika sesuai.
- Jangan menelan error tanpa penanganan atau pencatatan yang aman.

## 9. Backend and API Standards

- Gunakan Express Router untuk mengorganisasi endpoint saat jumlah endpoint bertambah.
- Validasi input pada backend.
- Gunakan parameterized queries untuk query SQL.
- Jangan membangun query SQL dengan menggabungkan input pengguna secara langsung.
- Gunakan try/catch pada operasi asynchronous yang berpotensi gagal.
- Kembalikan HTTP status yang sesuai.
- Jangan mengirim stack trace atau detail internal database kepada pengguna.
- Gunakan middleware untuk autentikasi, otorisasi, dan validasi jika diperlukan.
- Gunakan password hashing yang aman ketika autentikasi dibuat.
- Terapkan autentikasi dan otorisasi sebelum fitur privat digunakan.
- File upload harus dibatasi tipe, ukuran, dan aksesnya.
- Jangan menganggap data dari frontend sebagai data yang tepercaya.

Contoh format response sukses:
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": []
}

Contoh format response error:
{
  "success": false,
  "message": "Permintaan tidak dapat diproses"
}

Sesuaikan bentuk response dengan kebutuhan endpoint, tetapi jaga konsistensi.

## 10. Database Standards

- Gunakan database portal_ti_unusia.
- Gunakan InnoDB dan foreign key jika sesuai.
- Tentukan primary key untuk setiap tabel.
- Tentukan relasi antar tabel secara jelas.
- Gunakan created_at dan updated_at jika dibutuhkan.
- Gunakan constraint untuk menjaga integritas data.
- Jangan menyimpan password dalam bentuk plaintext.
- Hindari menyimpan data yang sama berulang kali tanpa kebutuhan.
- Gunakan migration atau skrip SQL yang terdokumentasi untuk perubahan skema.
- Jangan menjalankan migration yang menghapus data tanpa persetujuan.
- Sediakan skrip pembuatan skema yang dapat ditinjau sebelum dijalankan.

Rencanakan tabel sesuai kebutuhan aktual, seperti users, announcements, academic_services, submissions, submission_documents, dan submission_reviews. Jangan membuat semua tabel sekaligus tanpa memeriksa kebutuhan dan relasinya.

## 11. Environment and Secrets

Gunakan file .env lokal untuk konfigurasi backend.

Contoh variabel:
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portal_ti_unusia

Nilai di atas merupakan contoh konfigurasi, bukan kredensial yang harus digunakan secara literal.

Sediakan .env.example tanpa password atau secret asli.
Pastikan .env masuk ke .gitignore.
Jangan meminta pengguna mengirim password ke chat atau menyimpan password asli di dokumentasi.

## 12. Workflow for AI Agents

Sebelum coding:
1. Periksa AGENTS.md dan TODO.md.
2. Periksa struktur folder dan file yang relevan.
3. Baca package.json frontend dan backend.
4. Pahami kode yang sudah ada.
5. Identifikasi kebutuhan, dependensi, dan risiko.
6. Buat rencana singkat sebelum perubahan besar.

Saat coding:
1. Kerjakan satu fitur atau satu tahap dalam satu waktu.
2. Gunakan kembali kode yang sudah berfungsi.
3. Hindari perubahan di luar cakupan tugas.
4. Jangan membuat data palsu seolah-olah merupakan data resmi.
5. Jangan menjalankan perintah destruktif tanpa izin.
6. Jika menemukan keputusan desain atau arsitektur yang belum jelas, jelaskan dan minta persetujuan sebelum perubahan besar.

Setelah coding:
1. Periksa syntax dan import.
2. Jalankan pemeriksaan atau build yang tersedia.
3. Jalankan tes yang relevan.
4. Periksa dampak terhadap frontend, backend, dan database.
5. Perbarui TODO.md sesuai pekerjaan yang benar-benar selesai.
6. Jelaskan file yang diubah.
7. Jelaskan cara menjalankan dan menguji fitur.
8. Laporkan error atau pekerjaan yang belum selesai secara jujur.

## 13. Definition of Done

Sebuah fitur dianggap selesai apabila:
- Implementasi sesuai kebutuhan.
- Tidak merusak fitur yang sudah ada.
- Validasi input diterapkan sesuai kebutuhan.
- Loading, error, dan empty state ditangani jika relevan.
- Hak akses diterapkan untuk data privat.
- Tes atau pemeriksaan yang relevan berhasil.
- Dokumentasi diperbarui jika diperlukan.
- TODO.md diperbarui berdasarkan hasil aktual.

## 14. Priority

Prioritas pengembangan:
1. Fondasi frontend, backend, dan database.
2. UI portal publik.
3. Desain skema database.
4. API informasi publik.
5. Autentikasi dan hak akses.
6. Dashboard per peran.
7. Layanan magang, skripsi, dan KKN.
8. Panel admin.
9. Pengujian, keamanan, dokumentasi, dan GitHub.

Jangan mengimplementasikan seluruh sistem sekaligus. Kerjakan bertahap, stabil, dan dapat diuji.