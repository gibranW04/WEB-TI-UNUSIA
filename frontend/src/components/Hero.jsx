import React from 'react';

export default function Hero({ apiStatus, onOpenLogin }) {
  const statusClassName = apiStatus.connected ? 'is-online' : 'is-standby';
  const statusLabel = apiStatus.connected ? 'Online (HTTP 200)' : 'Menunggu Server...';

  return (
    <section id="hero" className="hero-section">
      <div className="hero-background-pattern"></div>
      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left Column: Hero Text */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Portal Akademik Resmi S1 Teknik Informatika UNUSIA</span>
            </div>

            <h1 className="hero-title">
              Perancangan & Pengembangan Portal Digital <span className="highlight-text">Teknik Informatika</span> Berbasis Service
            </h1>

            <p className="hero-lead">
              Pusat sistem informasi akademik dan layanan terpadu bagi civitas akademika Teknik Informatika UNUSIA. Memudahkan pengajuan magang, skripsi, dan KKN secara transparan, terstruktur, serta terintegrasi dengan REST API.
            </p>

            <div className="hero-cta-group">
              <a href="#layanan" className="btn btn-primary btn-lg">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Akses Layanan Digital</span>
              </a>

              <a href="#profil" className="btn btn-outline btn-lg">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Profil Program Studi</span>
              </a>
            </div>

            {/* Quick Live Health Status Bar */}
            <div className="hero-api-check">
              <div className="api-check-header">
                <span className="api-check-title">Konektivitas Service REST API:</span>
                <span className={`api-check-tag ${statusClassName}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="api-check-message">
                {apiStatus.message || 'Memeriksa endpoint GET /api/health...'}
              </p>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="hero-visual">
            <div className="portal-preview-card">
              <div className="portal-card-topbar">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="window-title">portal.ti.unusia.ac.id/api</span>
              </div>

              <div className="portal-card-body">
                <div className="service-quick-badge">Arsitektur Multi-Tier Berbasis Service</div>
                
                <div className="tech-stack-list">
                  <div className="tech-stack-item">
                    <span className="tech-icon-box react-box">⚛️</span>
                    <div>
                      <strong>Frontend Client</strong>
                      <span>React + Vite (Modern Responsive SPA)</span>
                    </div>
                  </div>

                  <div className="tech-arrow">↓ REST API (JSON / HTTP)</div>

                  <div className="tech-stack-item">
                    <span className="tech-icon-box express-box">⚡</span>
                    <div>
                      <strong>Backend Service</strong>
                      <span>Node.js + Express REST API</span>
                    </div>
                  </div>

                  <div className="tech-arrow">↓ Parameterized Queries</div>

                  <div className="tech-stack-item">
                    <span className="tech-icon-box mysql-box">🗄️</span>
                    <div>
                      <strong>Database Engine</strong>
                      <span>MySQL Server (Integritas Data Terjamin)</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer-cta">
                  <span>3 Hak Akses Peran: Mahasiswa • Dosen • Admin</span>
                  <button className="btn-card-login" onClick={onOpenLogin}>
                    Masuk Akun →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Features Bar */}
        <div className="hero-features-bar">
          <div className="feature-item">
            <div className="feature-icon">🎓</div>
            <div className="feature-info">
              <h4>Kurikulum Berbasis OBE</h4>
              <p>Berorientasi capaian kompetensi dan kebutuhan industri digital.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📑</div>
            <div className="feature-info">
              <h4>3 Layanan Digital Utama</h4>
              <p>Pengajuan Magang, Skripsi, dan KKN tersistem secara daring.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <div className="feature-info">
              <h4>Transparan & Terpantau</h4>
              <p>Pelacakan status berkas dan catatan revisi dosen secara real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
