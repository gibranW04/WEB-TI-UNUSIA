import React, { useState } from 'react';

export default function ServiceCards({ onSelectService }) {
  const [activeModal, setActiveModal] = useState(null);

  const services = [
    {
      id: 'magang',
      title: 'Layanan Magang / Kerja Praktik (KP)',
      tag: 'Semester 5+',
      tagColor: 'blue',
      badge: 'Layanan Akademik',
      icon: '💼',
      shortDesc: 'Pengajuan proposal magang instansi, surat pengantar resmi, validasi perusahaan mitra, logbook mingguan, dan pelaporan sidang KP.',
      requirements: [
        'Telah menempuh minimal 90 SKS',
        'Indeks Prestasi Kumulatif (IPK) minimal 2.50',
        'Proposal pengajuan tempat magang / instansi mitra',
        'Surat rekomendasi dosen pembimbing akademik'
      ],
      steps: [
        { no: '1', title: 'Pengajuan & Surat Pengantar', desc: 'Unggah formulir instansi untuk diterbitkan surat pengantar dari prodi.' },
        { no: '2', title: 'Verifikasi Penerimaan', desc: 'Unggah surat bukti diterima dari instansi tempat magang.' },
        { no: '3', title: 'Pelaksanaan & Bimbingan', desc: 'Isi logbook kegiatan berkala dan asistensi dosen pembimbing magang.' },
        { no: '4', title: 'Sidang & Nilai Akhir', desc: 'Unggah laporan akhir magang dan evaluasi penilaian instansi.' }
      ],
      ctaText: 'Ajukan Magang'
    },
    {
      id: 'skripsi',
      title: 'Layanan Skripsi / Tugas Akhir (TA)',
      tag: 'Semester 7+',
      tagColor: 'emerald',
      badge: 'Layanan Utama',
      icon: '🎓',
      shortDesc: 'Pengajuan usulan judul tugas akhir, penetapan pembimbing I & II, seminar proposal (sempro), asistensi berkas, dan pendaftaran sidang sarjana.',
      requirements: [
        'Telah menempuh minimal 120 SKS',
        'Lulus mata kuliah Metodologi Penelitian',
        'Naskah outline / proposal tugas akhir yang relevan',
        'Bebas tunggakan administrasi dan perpustakaan'
      ],
      steps: [
        { no: '1', title: 'Pengajuan Judul & Proposal', desc: 'Unggah draft usulan topik dan rumusan masalah untuk ditinjau koordinator TA.' },
        { no: '2', title: 'Seminar Proposal (Sempro)', desc: 'Ujian kelayakan naskah proposal oleh tim dosen penguji.' },
        { no: '3', title: 'Bimbingan Bab 1 - 5', desc: 'Proses konsultasi berkala dengan pembimbing hingga acc sidang.' },
        { no: '4', title: 'Sidang Skripsi & Yudisium', desc: 'Sidang mempertahankan tugas akhir dan penyelesaian revisi naskah.' }
      ],
      ctaText: 'Ajukan Skripsi'
    },
    {
      id: 'kkn',
      title: 'Layanan Kuliah Kerja Nyata (KKN)',
      tag: 'Semester 6+',
      tagColor: 'amber',
      badge: 'Pengabdian Masyarakat',
      icon: '🤝',
      shortDesc: 'Pendaftaran program KKN terpadu, pemilihan tema pengabdian masyarakat, koordinasi dengan Dosen Pembimbing Lapangan (DPL), dan pelaporan luaran.',
      requirements: [
        'Telah menempuh minimal 100 SKS',
        'Terdaftar aktif pada semester berjalan',
        'Mengikuti pembekalan teknis program KKN',
        'Surat kesediaan mengikuti kegiatan pengabdian di lokasi'
      ],
      steps: [
        { no: '1', title: 'Pendaftaran & Verifikasi', desc: 'Pilih skema KKN (Tematik/Reguler) dan verifikasi berkas administrasi.' },
        { no: '2', title: 'Pembekalan & Plot Lokasi', desc: 'Mengikuti workshop pembekalan dan pembagian kelompok kerja.' },
        { no: '3', title: 'Penerjunan Lapangan', desc: 'Pelaksanaan program kerja teknologi tepat guna bersama masyarakat.' },
        { no: '4', title: 'Laporan Luaran & Penilaian', desc: 'Penyusunan laporan kelompok, publikasi artikel pengabdian, dan nilai akhir.' }
      ],
      ctaText: 'Daftar KKN'
    }
  ];

  const handleOpenDetail = (service) => {
    setActiveModal(service);
  };

  const handleCloseDetail = () => {
    setActiveModal(null);
  };

  return (
    <section id="layanan" className="section-padding service-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>Layanan Akademik Digital</span>
          </div>
          <h2 className="section-title">Pusat Layanan Mahasiswa Terpadu</h2>
          <p className="section-desc">
            Sistem pengajuan daring berbasis service yang transparan. Unggah dokumen, pantau catatan revisi dosen, dan verifikasi status kelulusan secara terintegrasi.
          </p>
        </div>

        {/* 3 Service Cards Grid */}
        <div className="services-grid">
          {services.map((item) => (
            <div key={item.id} className={`service-card service-card-${item.tagColor}`}>
              <div className="service-card-header">
                <div className="service-badge-row">
                  <span className={`service-pill pill-${item.tagColor}`}>{item.tag}</span>
                  <span className="service-type">{item.badge}</span>
                </div>
                <div className="service-icon-box">{item.icon}</div>
                <h3 className="service-title">{item.title}</h3>
                <p className="service-desc">{item.shortDesc}</p>
              </div>

              <div className="service-card-body">
                <div className="req-title">Syarat Utama Pengajuan:</div>
                <ul className="req-list">
                  {item.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx}>
                      <span className="req-check">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="service-card-footer">
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => onSelectService(item)}
                >
                  <span>{item.ctaText}</span>
                  <span className="arrow-icon">→</span>
                </button>
                <button 
                  className="btn btn-ghost btn-sm btn-block mt-2"
                  onClick={() => handleOpenDetail(item)}
                >
                  Lihat Alur & Panduan Lengkap
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Notification Card */}
        <div className="workflow-highlight-banner">
          <div className="workflow-icon">⚡</div>
          <div className="workflow-text">
            <strong>Alur Kerja Tervalidasi Backend:</strong>
            <span>Setiap pengajuan diproses melalui REST API terotentikasi, diverifikasi oleh Dosen Pembimbing, dan disimpan aman di basis data MySQL.</span>
          </div>
          <button 
            className="btn btn-outline btn-sm workflow-btn"
            onClick={() => onSelectService(services[0])}
          >
            Pelajari Prosedur
          </button>
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeModal && (
        <div className="modal-backdrop" onClick={handleCloseDetail}>
          <div className="modal-box modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-icon">{activeModal.icon}</span>
                <div>
                  <h3 className="modal-title">{activeModal.title}</h3>
                  <span className="modal-subtitle">Panduan Prosedur Standar Operasional (SOP)</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDetail} aria-label="Tutup modal">×</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4 className="modal-subheading">Deskripsi Layanan</h4>
                <p className="modal-text">{activeModal.shortDesc}</p>
              </div>

              <div className="modal-section">
                <h4 className="modal-subheading">Persyaratan Berkas & Ketentuan</h4>
                <ul className="modal-checklist">
                  {activeModal.requirements.map((req, i) => (
                    <li key={i}>
                      <span className="check-bullet">📌</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4 className="modal-subheading">Tahapan Alur Pengajuan (Workflow)</h4>
                <div className="modal-steps-grid">
                  {activeModal.steps.map((step) => (
                    <div key={step.no} className="step-card">
                      <div className="step-no-badge">Tahap {step.no}</div>
                      <h5 className="step-card-title">{step.title}</h5>
                      <p className="step-card-desc">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleCloseDetail}>
                Tutup
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const s = activeModal;
                  handleCloseDetail();
                  onSelectService(s);
                }}
              >
                Lanjutkan ke Form Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
