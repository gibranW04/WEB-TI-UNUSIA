-- ============================================================================
-- PORTAL DIGITAL TEKNIK INFORMATIKA UNUSIA
-- Database Initial Seed Data
-- ============================================================================

-- 1. Seed Academic Services
INSERT IGNORE INTO `academic_services` (`id`, `code`, `name`, `short_description`, `min_credits`, `min_semester`, `is_active`) VALUES
(1, 'magang', 'Layanan Magang / Kerja Praktik (KP)', 'Pengajuan proposal instansi, penerbitan surat pengantar, monitoring logbook berkala, dan seminar magang industri.', 90, 5, 1),
(2, 'skripsi', 'Layanan Skripsi / Tugas Akhir (TA)', 'Pengajuan usulan judul, penetapan dosen pembimbing, seminar proposal (sempro), dan pendaftaran sidang skripsi sarjana.', 120, 7, 1),
(3, 'kkn', 'Layanan Kuliah Kerja Nyata (KKN)', 'Pendaftaran program pengabdian masyarakat, penentuan DPL, pembekalan tematik, dan pelaporan luaran program.', 100, 6, 1);

-- 2. Seed Initial Users (Password default awal: Password123!)
-- Hash: $2b$10$gtPO2Oh9CJIT.3.LMZqm1eYGgtYygkefauZN98GDxX/6dk2L344XG
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `role`, `phone`, `status`) VALUES
(1, 'admin', 'admin@unusia.ac.id', '$2b$10$gtPO2Oh9CJIT.3.LMZqm1eYGgtYygkefauZN98GDxX/6dk2L344XG', 'Administrator TI UNUSIA', 'admin', '081299990001', 'active'),
(2, '0412345678', 'ahmad.baiquni@unusia.ac.id', '$2b$10$gtPO2Oh9CJIT.3.LMZqm1eYGgtYygkefauZN98GDxX/6dk2L344XG', 'Dr. Ir. Ahmad Baiquni, M.Kom.', 'dosen', '081299990002', 'active'),
(3, '21102001', 'm.farhan@student.unusia.ac.id', '$2b$10$gtPO2Oh9CJIT.3.LMZqm1eYGgtYygkefauZN98GDxX/6dk2L344XG', 'Muhammad Farhan', 'mahasiswa', '081299990003', 'active');

-- 3. Seed User Profiles
INSERT IGNORE INTO `user_profiles` (`id`, `user_id`, `identity_number`, `study_program`, `faculty`, `batch_year`, `semester`, `total_credits`, `gpa`, `specialization`, `academic_advisor_id`) VALUES
(1, 2, '0412345678', 'S1 Teknik Informatika', 'Fakultas Teknik', NULL, NULL, 0, 0.00, 'Software Architecture & Cloud Systems', NULL),
(2, 3, '21102001', 'S1 Teknik Informatika', 'Fakultas Teknik', 2021, 7, 126, 3.65, 'Software Engineering', 2);

-- 4. Seed Announcements
INSERT IGNORE INTO `announcements` (`id`, `author_id`, `title`, `slug`, `category`, `summary`, `content`, `is_published`) VALUES
(1, 1, 'Sosialisasi Tata Cara Pengajuan Judul Skripsi & Pembagian Dosen Pembimbing Semester Genap', 'sosialisasi-pengajuan-judul-skripsi-genap-2026', 'pengumuman', 'Program Studi Teknik Informatika mengundang seluruh mahasiswa semester 6 dan 7 untuk menghadiri sesi sosialisasi alur pengajuan skripsi berbasis portal digital baru.', 'Seluruh proses pendaftaran outline judul, verifikasi dokumen, dan penetapan pembimbing dialihkan melalui Portal Digital TI UNUSIA. Mahasiswa yang memenuhi syarat diwajibkan menyiapkan berkas naskah usulan proposal.', 1),
(2, 1, 'Mahasiswa TI UNUSIA Raih Juara 2 Kategori UI/UX Design Tingkat Nasional', 'prestasi-mahasiswa-ti-juara-2-uiux-nasional-2026', 'kegiatan', 'Tim mahasiswa perwakilan Himpunan Mahasiswa Teknik Informatika berhasil menorehkan prestasi membanggakan pada ajang kompetisi inovasi digital antar perguruan tinggi.', 'Karya yang diusung bertajuk inovasi platform pelayanan publik berbasis human-centered design. Keberhasilan ini membuktikan daya saing dan kreativitas mahasiswa TI UNUSIA di kancah nasional.', 1),
(3, 1, 'Kuliah Tamu: Praktik Terbaik Rekayasa Cloud & Microservices di Industri Startup Unicorn', 'kuliah-tamu-rekayasa-cloud-microservices-2026', 'workshop', 'Menghadirkan Lead Cloud Architect dari salah satu tech unicorn Jakarta, membedah implementasi arsitektur cloud terdistribusi, containerization, dan CI/CD pipeline.', 'Laboratorium Rekayasa Perangkat Lunak & Jaringan TI UNUSIA menyelenggarakan Kuliah Tamu Praktisi Industri dengan topik Building Resilient Cloud Microservices at Scale. Diikuti lebih dari 150 peserta.', 1),
(4, 1, 'Panduan Pendaftaran Magang Industri Bersertifikat (MBKM & Mandiri)', 'panduan-pendaftaran-magang-industri-2026', 'pengumuman', 'Daftar perusahaan mitra industri dan lembaga rintisan yang membuka kuota penempatan magang bagi mahasiswa aktif Teknik Informatika.', 'Bagi mahasiswa yang berencana memprogramkan Magang Kerja Praktik semester ini, Program Studi telah merilis katalog instansi mitra yang siap menerima mahasiswa TI UNUSIA.', 1);

-- 5. Seed Initial Test Submission
INSERT IGNORE INTO `submissions` (`id`, `submission_number`, `service_id`, `student_id`, `reviewer_id`, `title`, `agency_name`, `agency_address`, `status`, `current_step`, `notes`) VALUES
(1, 'SUB-SK-2026-001', 2, 3, 2, 'Rancang Bangun Sistem Informasi Pelayanan Akademik Terpadu Berbasis Service Oriented Architecture', 'Fakultas Teknik UNUSIA', 'Jl. Kramat Raya No. 164, Jakarta Pusat', 'in_review', 2, 'Usulan outline telah diverifikasi, menunggu jadwal seminar proposal.');
