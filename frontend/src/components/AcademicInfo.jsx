import React, { useState } from 'react';

export default function AcademicInfo() {
  const [downloadModal, setDownloadModal] = useState(null);

  const academicSchedule = [
    { period: '15 - 28 Feb 2026', event: 'Masa Pengisian & Revisi KRS Online (SIAKAD)', status: 'Selesai', color: 'gray' },
    { period: '02 Mar 2026', event: 'Awal Perkuliahan Efektif Semester Genap 2025/2026', status: 'Berjalan', color: 'emerald' },
    { period: '20 - 30 Apr 2026', event: 'Ujian Tengah Semester (UTS) Genap', status: 'Mendatang', color: 'blue' },
    { period: '01 - 15 Mei 2026', event: 'Batas Pendaftaran Sidang Seminar Proposal (Sempro)', status: 'Mendatang', color: 'blue' },
    { period: '22 Jun - 04 Jul 2026', event: 'Ujian Akhir Semester (UAS) Genap', status: 'Mendatang', color: 'amber' },
    { period: '10 - 25 Jul 2026', event: 'Sidang Tugas Akhir / Skripsi & Verifikasi Yudisium', status: 'Mendatang', color: 'amber' }
  ];

  const guideDocuments = [
    {
      id: 'doc-skripsi',
      title: 'Buku Panduan Penulisan Skripsi & Tugas Akhir',
      size: '2.4 MB (PDF)',
      code: 'PED-TI-01',
      desc: 'Format penulisan baku, sistematika bab, kaidah sitasi IEEE, dan pedoman pengujian perangkat lunak.'
    },
    {
      id: 'doc-magang',
      title: 'Pedoman Pelaksanaan Kerja Praktik / Magang Industri',
      size: '1.8 MB (PDF)',
      code: 'PED-TI-02',
      desc: 'Tata cara permohonan instansi, pengisian logbook mingguan, dan format laporan akhir kerja praktik.'
    },
    {
      id: 'doc-kkn',
      title: 'Petunjuk Teknis Kuliah Kerja Nyata (KKN) Tematik',
      size: '3.1 MB (PDF)',
      code: 'PED-TI-03',
      desc: 'Panduan pembentukan kelompok, penyusunan program kerja teknologi informasi, dan laporan pengabdian.'
    },
    {
      id: 'doc-form',
      title: 'Kumpulan Template Surat & Formulir Bimbingan',
      size: '1.2 MB (ZIP)',
      code: 'TMP-TI-04',
      desc: 'Lembar persetujuan pembimbing, formulir revisi ujian, dan surat permohonan riset instansi.'
    }
  ];

  const handleDownload = (doc) => {
    setDownloadModal(doc);
  };

  return (
    <section id="akademik" className="section-padding academic-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>Informasi Akademik</span>
          </div>
          <h2 className="section-title">Kalender & Pedoman Akademik</h2>
          <p className="section-desc">
            Informasi penting jadwal perkuliahan, rentang waktu layanan pengajuan, dan berkas panduan resmi Program Studi Teknik Informatika.
          </p>
        </div>

        <div className="academic-grid">
          {/* Left Column: Calendar & Timeline */}
          <div className="academic-card calendar-card">
            <div className="academic-card-header">
              <div className="card-header-icon">📅</div>
              <div>
                <h3 className="card-header-title">Agenda Akademik Semester Aktif</h3>
                <span className="card-header-sub">Tahun Akademik 2025/2026 (Genap)</span>
              </div>
            </div>

            <div className="timeline-list">
              {academicSchedule.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-period">{item.period}</span>
                      <span className={`status-badge badge-${item.color}`}>{item.status}</span>
                    </div>
                    <p className="timeline-event">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="calendar-footer-note">
              <span className="info-icon">ℹ️</span>
              <span>Jadwal dapat disesuaikan dengan kalender akademik resmi universitas.</span>
            </div>
          </div>

          {/* Right Column: Downloadable Documents & Guidelines */}
          <div className="academic-card docs-card">
            <div className="academic-card-header">
              <div className="card-header-icon">📚</div>
              <div>
                <h3 className="card-header-title">Pedoman & Template Dokumen</h3>
                <span className="card-header-sub">Unduh berkas resmi untuk pengajuan layanan</span>
              </div>
            </div>

            <div className="docs-list">
              {guideDocuments.map((doc) => (
                <div key={doc.id} className="doc-item">
                  <div className="doc-icon-wrap">
                    <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="doc-details">
                    <div className="doc-meta">
                      <span className="doc-code">{doc.code}</span>
                      <span className="doc-size">{doc.size}</span>
                    </div>
                    <h4 className="doc-title">{doc.title}</h4>
                    <p className="doc-desc">{doc.desc}</p>
                    <button 
                      className="doc-download-link"
                      onClick={() => handleDownload(doc)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Unduh Berkas Panduan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert Modal */}
      {downloadModal && (
        <div className="modal-backdrop" onClick={() => setDownloadModal(null)}>
          <div className="modal-box modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Unduh Dokumen Akademik</h3>
              <button className="modal-close-btn" onClick={() => setDownloadModal(null)}>×</button>
            </div>
            <div className="modal-body text-center py-4">
              <div className="doc-modal-icon">📄</div>
              <h4 className="mt-2 font-bold">{downloadModal.title}</h4>
              <p className="text-muted mt-1">Kode: {downloadModal.code} • Ukuran: {downloadModal.size}</p>
              <div className="doc-modal-notice mt-4">
                Dokumen resmi ini disiapkan oleh Program Studi Teknik Informatika UNUSIA. Berkas digital dapat diakses dan digunakan oleh seluruh mahasiswa aktif.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDownloadModal(null)}>Tutup</button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  alert(`Memulai pengunduhan berkas: ${downloadModal.title}`);
                  setDownloadModal(null);
                }}
              >
                Konfirmasi Unduh ({downloadModal.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
