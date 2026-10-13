-- ============================================================================
-- PORTAL DIGITAL TEKNIK INFORMATIKA UNUSIA
-- Database Schema Script (MySQL / InnoDB)
-- Version: 1.0.0
-- ============================================================================

-- Pastikan menggunakan karakter set utf8mb4
-- CREATE DATABASE IF NOT EXISTS `web_ti_unusia` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `web_ti_unusia`;

-- ----------------------------------------------------------------------------
-- 1. Tabel: users
-- Menyimpan kredensial dan data akun untuk Mahasiswa, Dosen, dan Admin
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'NIM / NIDN / username',
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('mahasiswa', 'dosen', 'admin') NOT NULL DEFAULT 'mahasiswa',
  `phone` VARCHAR(25) NULL,
  `avatar` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Tabel: user_profiles
-- Detail profil spesifik untuk mahasiswa (NIM, semester, SKS) & dosen (NIDN, keahlian)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `identity_number` VARCHAR(30) NULL COMMENT 'NIM atau NIDN/NIP',
  `study_program` VARCHAR(50) DEFAULT 'S1 Teknik Informatika',
  `faculty` VARCHAR(50) DEFAULT 'Fakultas Teknik',
  `batch_year` INT NULL COMMENT 'Tahun angkatan mahasiswa',
  `semester` INT NULL COMMENT 'Semester berjalan mahasiswa',
  `total_credits` INT DEFAULT 0 COMMENT 'Jumlah SKS kumulatif yang telah ditempuh',
  `gpa` DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Indeks Prestasi Kumulatif',
  `specialization` VARCHAR(100) NULL COMMENT 'Konsentrasi minat: RPL, Data Science, Jaringan',
  `academic_advisor_id` INT NULL COMMENT 'Dosen Pembimbing Akademik',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_profile_advisor` FOREIGN KEY (`academic_advisor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_profile_advisor` (`academic_advisor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Tabel: academic_services
-- Master katalog layanan akademik: Magang (KP), Skripsi (TA), KKN
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `academic_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(30) NOT NULL UNIQUE COMMENT 'magang, skripsi, kkn',
  `name` VARCHAR(100) NOT NULL,
  `short_description` TEXT NULL,
  `min_credits` INT DEFAULT 0 COMMENT 'Syarat minimal SKS tempuh',
  `min_semester` INT DEFAULT 1 COMMENT 'Syarat minimal semester',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Tabel: submissions
-- Pengajuan berkas layanan oleh mahasiswa
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Format: SUB-MG-2026-001',
  `service_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `reviewer_id` INT NULL COMMENT 'Dosen Pembimbing / Penguji',
  `title` VARCHAR(255) NOT NULL COMMENT 'Judul Skripsi / Topik Magang / Tema KKN',
  `agency_name` VARCHAR(150) NULL COMMENT 'Nama instansi mitra / perusahaan / lokasi',
  `agency_address` TEXT NULL,
  `status` ENUM('draft', 'submitted', 'in_review', 'revision_required', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'submitted',
  `current_step` INT DEFAULT 1 COMMENT 'Tahap proses alur SOP (1 s/d 4)',
  `notes` TEXT NULL COMMENT 'Catatan tambahan pengaju',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_submission_service` FOREIGN KEY (`service_id`) REFERENCES `academic_services` (`id`),
  CONSTRAINT `fk_submission_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submission_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_sub_student` (`student_id`),
  INDEX `idx_sub_reviewer` (`reviewer_id`),
  INDEX `idx_sub_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Tabel: submission_documents
-- Dokumen lampiran pengajuan (Proposal, Surat Pengantar, Bukti ACC, Laporan)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submission_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `document_type` VARCHAR(50) NOT NULL COMMENT 'proposal, surat_pengantar, logbook, laporan',
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` INT NOT NULL COMMENT 'Ukuran dalam bytes',
  `mime_type` VARCHAR(100) NOT NULL,
  `version` INT DEFAULT 1,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_doc_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  INDEX `idx_doc_submission` (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Tabel: submission_reviews
-- Riwayat tinjauan dan catatan revisi oleh Dosen atau Admin
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submission_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL,
  `action` ENUM('approved', 'revision_required', 'rejected', 'commented') NOT NULL,
  `review_notes` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  INDEX `idx_review_submission` (`submission_id`),
  INDEX `idx_review_reviewer` (`reviewer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Tabel: announcements
-- Informasi publik, berita, dan pengumuman akademik
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` ENUM('pengumuman', 'kegiatan', 'workshop', 'akademik') NOT NULL DEFAULT 'pengumuman',
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `is_published` BOOLEAN DEFAULT TRUE,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_announcement_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  INDEX `idx_ann_category` (`category`),
  INDEX `idx_ann_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
