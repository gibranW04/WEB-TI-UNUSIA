import React, { useState } from 'react';

export default function ProgramOverview() {
  const [activeTab, setActiveTab] = useState('visi-misi');

  const specializations = [
    {
      id: 'se',
      icon: '💻',
      title: 'Software Engineering & Web Technologies',
      desc: 'Fokus pada metodologi pengembangan perangkat lunak modern, arsitektur microservices, aplikasi web responsif, mobile development, serta penjaminan kualitas perangkat lunak.',
      careers: ['Fullstack Developer', 'Mobile Application Engineer', 'DevOps / Cloud Specialist', 'Software Quality Assurance']
    },
    {
      id: 'ai',
      icon: '🧠',
      title: 'Data Science & Artificial Intelligence',
      desc: 'Kajian mendalam pengolahan big data, pemodelan machine learning, natural language processing, visualisasi data, dan pemanfaatan kecerdasan artifisial untuk solusi industri.',
      careers: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'Business Intelligence Analyst']
    },
    {
      id: 'net',
      icon: '🔒',
      title: 'Cyber Security & Network Infrastructure',
      desc: 'Penguasaan arsitektur jaringan komputer enterprise, administrasi server Linux/Cloud, mitigasi ancaman keamanan siber, kriptografi terapan, dan audit sistem informasi.',
      careers: ['Security Analyst', 'Network Engineer', 'Cloud Infrastructure Architect', 'Information Security Officer']
    }
  ];

  return (
    <section id="profil" className="section-padding program-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <span>Profil Program Studi</span>
          </div>
          <h2 className="section-title">Teknik Informatika UNUSIA</h2>
          <p className="section-desc">
            Mempersiapkan sarjana informatika berdaya saing global yang menguasai keahlian rekayasa komputasi mutakhir dengan dilandasi integritas nilai-nilai Ahlussunnah wal Jama'ah.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="profile-tabs-wrapper">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'visi-misi' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('visi-misi')}
            >
              Visi & Misi
            </button>
            <button 
              className={`tab-btn ${activeTab === 'konsentrasi' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('konsentrasi')}
            >
              Bidang Peminatan & Karir
            </button>
            <button 
              className={`tab-btn ${activeTab === 'keunggulan' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('keunggulan')}
            >
              Keunggulan Akademik
            </button>
          </div>
        </div>

        {/* Tab Content: Visi Misi */}
        {activeTab === 'visi-misi' && (
          <div className="tab-pane-fade">
            <div className="vision-mission-grid">
              <div className="vision-card">
                <div className="card-badge-accent">Visi Keilmuan</div>
                <h3 className="vision-title">Visi Program Studi S1 Teknik Informatika</h3>
                <blockquote className="vision-quote">
                  "Menjadi program studi teknik informatika yang unggul, berdaya saing di tingkat nasional maupun global, adaptif terhadap inovasi teknologi digital, serta berkarakter luhur berlandaskan nilai-nilai Ahlussunnah wal Jama'ah."
                </blockquote>
                <div className="official-note">
                  <span className="info-icon">ℹ️</span>
                  <span>Catatan: Mengacu pada ketetapan rencana strategis institusional Fakultas Teknik UNUSIA.</span>
                </div>
              </div>

              <div className="mission-card">
                <div className="card-badge-accent">Misi Utama</div>
                <h3 className="mission-title">4 Pilar Misi Pembelajaran & Riset</h3>
                <ul className="mission-list">
                  <li>
                    <span className="list-number">01</span>
                    <div>
                      <strong>Pendidikan Berkualitas:</strong> Menyelenggarakan proses pembelajaran berstandar OBE (Outcome-Based Education) yang adaptif terhadap perkembangan sains komputasi.
                    </div>
                  </li>
                  <li>
                    <span className="list-number">02</span>
                    <div>
                      <strong>Riset & Inovasi:</strong> Mengembangkan penelitian terapan di bidang rekayasa perangkat lunak, sains data, dan kecerdasan artifisial yang bermanfaat bagi masyarakat.
                    </div>
                  </li>
                  <li>
                    <span className="list-number">03</span>
                    <div>
                      <strong>Pengabdian Masyarakat:</strong> Mengimplementasikan solusi teknologi digital untuk pemberdayaan masyarakat, UMKM, dan institusi keumatan.
                    </div>
                  </li>
                  <li>
                    <span className="list-number">04</span>
                    <div>
                      <strong>Kolaborasi Industri:</strong> Membangun jejaring kemitraan strategis dengan dunia usaha dan industri (DUDI) untuk magang dan serapan kerja lulusan.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Konsentrasi */}
        {activeTab === 'konsentrasi' && (
          <div className="tab-pane-fade">
            <div className="specialization-grid">
              {specializations.map((item) => (
                <div key={item.id} className="specialization-card">
                  <div className="spec-icon-circle">{item.icon}</div>
                  <h3 className="spec-title">{item.title}</h3>
                  <p className="spec-desc">{item.desc}</p>
                  
                  <div className="careers-box">
                    <span className="careers-label">Peluang Karir Lulusan:</span>
                    <ul className="careers-list">
                      {item.careers.map((career, idx) => (
                        <li key={idx}>✓ {career}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Keunggulan */}
        {activeTab === 'keunggulan' && (
          <div className="tab-pane-fade">
            <div className="strengths-grid">
              <div className="strength-card">
                <div className="strength-icon">🏛️</div>
                <h4>Fasilitas Laboratorium Komputer Terpadu</h4>
                <p>Dilengkapi sarana praktikum pemrograman, jaringan komputer, dan rekayasa data untuk mengasah keterampilan praktis mahasiswa.</p>
              </div>
              <div className="strength-card">
                <div className="strength-icon">🤝</div>
                <h4>Ekosistem Magang & Kemitraan Kampus</h4>
                <p>Didukung oleh jejaring institusi mitra untuk memberikan pengalaman kerja nyata sebelum mahasiswa menyelesaikan studi.</p>
              </div>
              <div className="strength-card">
                <div className="strength-icon">🌱</div>
                <h4>Pembinaan Karakter Aswaja</h4>
                <p>Menyeimbangkan kemampuan teknikal dengan etika profesi, empati sosial, dan komitmen kebangsaan yang kokoh.</p>
              </div>
              <div className="strength-card">
                <div className="strength-icon">🚀</div>
                <h4>Layanan Akademik Digital Modern</h4>
                <p>Portal digital berbasis service yang memudahkan mahasiswa mengakses bimbingan dan pelaporan akademik secara efisien.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
