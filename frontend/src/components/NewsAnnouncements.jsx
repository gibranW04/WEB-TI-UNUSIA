import React, { useState } from 'react';

export default function NewsAnnouncements() {
  const [activeCategory, setActiveCategory] = useState('semua');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 'news-1',
      category: 'pengumuman',
      categoryLabel: 'Pengumuman Resmi',
      badgeColor: 'blue',
      date: '10 Maret 2026',
      title: 'Sosialisasi Tata Cara Pengajuan Judul Skripsi & Pembagian Dosen Pembimbing Semester Genap',
      summary: 'Program Studi Teknik Informatika mengundang seluruh mahasiswa semester 6 dan 7 untuk menghadiri sesi sosialisasi alur pengajuan skripsi berbasis portal digital baru.',
      author: 'Koordinator Skripsi TI',
      content: `Yth. Mahasiswa Teknik Informatika UNUSIA,

Sehubungan dengan dimulainya periode pengajuan usulan skripsi untuk Tahun Akademik 2025/2026, Program Studi Teknik Informatika mengumumkan hal-hal sebagai berikut:

1. Seluruh proses pendaftaran outline judul, verifikasi dokumen, dan penetapan pembimbing dialihkan melalui Portal Digital TI UNUSIA.
2. Mahasiswa yang memenuhi syarat (telah lulus Metodologi Penelitian dan minimal 120 SKS) diwajibkan menyiapkan berkas naskah usulan.
3. Sosialisasi daring via Zoom Meeting akan dilaksanakan pada Sabtu, 21 Maret 2026 pukul 09.30 WIB. Tautan meeting akan didistribusikan melalui portal dan grup angkatan.

Demikian pengumuman ini disampaikan untuk menjadi perhatian civitas akademika.`
    },
    {
      id: 'news-2',
      category: 'kegiatan',
      categoryLabel: 'Kegiatan & Prestasi',
      badgeColor: 'emerald',
      date: '04 Maret 2026',
      title: 'Mahasiswa TI UNUSIA Raih Juara 2 Kategori UI/UX Design Tingkat Nasional',
      summary: 'Tim mahasiswa perwakilan Himpunan Mahasiswa Teknik Informatika berhasil menorehkan prestasi membanggakan pada ajang kompetisi inovasi digital antar perguruan tinggi.',
      author: 'HIMATIF UNUSIA',
      content: `Selamat dan apresiasi setinggi-tingginya kepada delegasi mahasiswa S1 Teknik Informatika UNUSIA yang telah berhasil meraih predikat Juara 2 dalam ajang National Technology Fair 2026.

Karya yang diusung bertajuk inovasi platform pelayanan publik berbasis human-centered design. Keberhasilan ini membuktikan daya saing dan kreativitas mahasiswa TI UNUSIA di kancah nasional.

Program studi senantiasa berkomitmen memfasilitasi dan mendukung keikutsertaan mahasiswa dalam berbagai kompetisi ilmiah dan teknologi.`
    },
    {
      id: 'news-3',
      category: 'workshop',
      categoryLabel: 'Workshop & Kuliah Tamu',
      badgeColor: 'amber',
      date: '24 Februari 2026',
      title: 'Kuliah Tamu: Praktik Terbaik Rekayasa Cloud & Microservices di Industri Startup Unicorn',
      summary: 'Menghadirkan Lead Cloud Architect dari salah satu tech unicorn Jakarta, membedah implementasi arsitektur cloud terdistribusi, containerization, dan CI/CD pipeline.',
      author: 'Lab Komputer TI UNUSIA',
      content: `Laboratorium Rekayasa Perangkat Lunak & Jaringan TI UNUSIA menyelenggarakan Kuliah Tamu Praktisi Industri dengan topik "Building Resilient Cloud Microservices at Scale".

Narasumber membagikan wawasan nyata seputar tantangan migrasi monolitik ke microservices, orkestrasi Kubernetes, serta standar keamanan API di lingkungan produksi komersial.

Kegiatan ini diikuti oleh lebih dari 150 peserta mahasiswa dan dosen secara hybrid di Auditorium UNUSIA.`
    },
    {
      id: 'news-4',
      category: 'pengumuman',
      categoryLabel: 'Pengumuman Resmi',
      badgeColor: 'blue',
      date: '18 Februari 2026',
      title: 'Panduan Pendaftaran Magang Industri Bersertifikat (MBKM & Mandiri)',
      summary: 'Daftar perusahaan mitra industri dan lembaga rintisan yang membuka kuota penempatan magang bagi mahasiswa aktif Teknik Informatika.',
      author: 'Unit Kerjasama Prodi',
      content: `Bagi mahasiswa yang berencana memprogramkan Magang Kerja Praktik semester ini, Program Studi telah merilis katalog instansi mitra yang siap menerima mahasiswa TI UNUSIA.

Area penempatan mencakup:
- Web Development & Mobile Engineering
- IT Support & System Administrator
- Data Management & Analytics

Silakan akses formulir pendaftaran melalui Layanan Digital Magang pada portal ini.`
    }
  ];

  const filteredArticles = activeCategory === 'semua'
    ? articles
    : articles.filter(item => item.category === activeCategory);

  return (
    <section id="berita" className="section-padding news-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>Berita & Pengumuman</span>
          </div>
          <h2 className="section-title">Informasi & Kabar Terkini Prodi</h2>
          <p className="section-desc">
            Ikuti informasi pengumuman akademik resmi, liputan kegiatan civitas, prestasi mahasiswa, dan agenda workshop teknologi.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="news-filter-wrapper">
          <div className="news-filters">
            <button 
              className={`filter-btn ${activeCategory === 'semua' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('semua')}
            >
              Semua Berita
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'pengumuman' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('pengumuman')}
            >
              Pengumuman Resmi
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'kegiatan' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('kegiatan')}
            >
              Kegiatan & Prestasi
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'workshop' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('workshop')}
            >
              Workshop & Seminar
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div className="news-grid">
          {filteredArticles.map((article) => (
            <article key={article.id} className="news-card">
              <div className="news-card-header">
                <span className={`news-category-badge badge-${article.badgeColor}`}>
                  {article.categoryLabel}
                </span>
                <span className="news-date">{article.date}</span>
              </div>

              <div className="news-card-body">
                <h3 className="news-title">
                  <a href="#berita" onClick={(e) => { e.preventDefault(); setSelectedArticle(article); }}>
                    {article.title}
                  </a>
                </h3>
                <p className="news-summary">{article.summary}</p>
              </div>

              <div className="news-card-footer">
                <span className="news-author">Oleh: {article.author}</span>
                <button 
                  className="btn-read-more"
                  onClick={() => setSelectedArticle(article)}
                >
                  <span>Selengkapnya</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="modal-box modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className={`news-category-badge badge-${selectedArticle.badgeColor}`}>
                  {selectedArticle.categoryLabel}
                </span>
                <span className="modal-date-text">{selectedArticle.date}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>×</button>
            </div>

            <div className="modal-body">
              <h2 className="article-modal-title">{selectedArticle.title}</h2>
              <div className="article-meta-bar">
                <span>Dipublikasikan oleh: <strong>{selectedArticle.author}</strong></span>
                <span>•</span>
                <span>Program Studi Teknik Informatika UNUSIA</span>
              </div>

              <div className="article-content-body">
                {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="article-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedArticle(null)}>
                Tutup Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
