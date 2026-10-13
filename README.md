# Portal Digital Teknik Informatika UNUSIA

Portal Digital Teknik Informatika UNUSIA merupakan aplikasi berbasis service untuk menyajikan informasi program studi dan menyediakan layanan akademik secara digital.

## Tujuan

- Menyediakan informasi program studi, berita, dan pengumuman.
- Mendukung layanan pengajuan magang, skripsi, dan KKN.
- Menerapkan komunikasi frontend dan backend melalui REST API.
- Menggunakan MySQL sebagai penyimpanan data.
- Menerapkan akses sesuai peran mahasiswa, dosen, dan admin.

## Technology Stack

| Komponen | Teknologi |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Service | REST API |
| Database | MySQL |
| Database Driver | mysql2 |
| Version Control | Git + GitHub |

PHP dan Laravel tidak digunakan dalam project ini.

## Project Structure

```text
WEB-TI-UNUSIA/
├── AGENTS.md
├── TODO.md
├── README.md
├── .gitignore
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/
    ├── src/
    │   ├── server.js
    │   └── db.js
    ├── .env
    ├── .env.example
    └── package.json
```

Struktur di atas merupakan struktur target. Sesuaikan dengan file aktual saat pengembangan.

## Prerequisites

- Node.js dan npm.
- MySQL Server.
- Visual Studio Code.
- Git.

## Database Setup

1. Pastikan service MySQL berjalan.
2. Buat database bernama `portal_ti_unusia`.
3. Atur kredensial database melalui `backend/.env`.
4. Jalankan skrip pembuatan tabel setelah skema database tersedia.

Jangan menyimpan password asli di README.

## Backend Setup

Buka terminal pertama:

```bash
cd backend
npm install
npm run dev
```

Backend berjalan pada:

`http://localhost:3000`

Endpoint pengujian:

- `GET /api/health`
- `GET /api/db-test`

Endpoint database membutuhkan konfigurasi `.env` yang benar.

## Frontend Setup

Buka terminal kedua:

```bash
cd frontend
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya:

`http://localhost:5173`

Frontend dan backend harus berjalan bersamaan saat pengujian lokal.

## Environment Variables

Konfigurasi backend disimpan pada `backend/.env`.

Lihat `backend/.env.example` sebagai referensi. Jangan mengunggah `.env` berisi kredensial asli ke repository.

## Architecture

User → React Frontend → REST API → Express Backend → MySQL Database

Frontend berkomunikasi dengan backend melalui HTTP. Akses database hanya dilakukan dari backend.

## User Roles

- Mahasiswa: melihat informasi dan mengelola pengajuan akademik miliknya.
- Dosen: meninjau pengajuan sesuai tanggung jawab dan memberikan keputusan atau catatan.
- Admin: mengelola informasi portal, pengguna, dan pengajuan sesuai kewenangan.

## Development Guidelines

Baca `AGENTS.md` sebelum melakukan perubahan besar.

Gunakan `TODO.md` untuk melihat prioritas pekerjaan. Perbarui checklist setelah implementasi benar-benar diuji.

## Project Status

Development in progress. Periksa `TODO.md` untuk daftar pekerjaan terbaru.

## License

Lisensi project ditentukan oleh tim pengembang sesuai kebutuhan akademik dan ketentuan repository.