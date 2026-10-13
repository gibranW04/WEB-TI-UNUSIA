import React from 'react';

export default function Footer({ onOpenLogin }) {
  return (
    <footer id="kontak" className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Column 1: Institutional Identity */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <div className="footer-logo-box">
                <svg className="footer-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="footer-brand-title">Teknik Informatika UNUSIA</h3>
                <p className="footer-brand-subtitle">Fakultas Teknik • Universitas Nahdlatul Ulama Indonesia</p>
              </div>
            </div>

            <p className="footer-about-text">
              Portal digital resmi untuk mendukung transparansi perkuliahan, riset keilmuan komputer, serta pelayanan pengajuan magang, skripsi, dan KKN berbasis arsitektur REST API & MySQL.
            </p>

            <div className="footer-social-links">
              <span className="social-pill">Portal Akademik</span>
              <span className="social-pill">SIAKAD</span>
              <span className="social-pill">E-Learning</span>
              <span className="social-pill">Jurnal TI</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigasi Portal</h4>
            <ul className="footer-links">
              <li><a href="#hero">Beranda</a></li>
              <li><a href="#profil">Profil Program Studi</a></li>
              <li><a href="#layanan">Layanan Digital Mahasiswa</a></li>
              <li><a href="#akademik">Kalender & Panduan Akademik</a></li>
              <li><a href="#berita">Berita & Pengumuman</a></li>
              <li><button className="footer-link-btn" onClick={onOpenLogin}>Masuk Akun Pengguna</button></li>
            </ul>
          </div>

          {/* Column 3: Academic Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Layanan Terpadu</h4>
            <ul className="footer-links">
              <li><a href="#layanan">Pengajuan Magang / Kerja Praktik</a></li>
              <li><a href="#layanan">Pendaftaran Judul Skripsi</a></li>
              <li><a href="#layanan">Bimbingan Seminar Proposal</a></li>
              <li><a href="#layanan">Pendaftaran Sidang Sarjana</a></li>
              <li><a href="#layanan">Program KKN Tematik</a></li>
              <li><a href="#akademik">Unduh Berkas Panduan (SOP)</a></li>
            </ul>
          </div>

          {/* Column 4: Campus Address & Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Kampus & Sekretariat</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Kampus A (Rektorat):</strong>
                  <p>Jl. Kramat Raya No. 164, Senen, Jakarta Pusat, DKI Jakarta 10430</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">🏛️</span>
                <div>
                  <strong>Kampus B (Fakultas Teknik):</strong>
                  <p>Jl. Parung Panjang, Bogor, Jawa Barat</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email Resmi Prodi:</strong>
                  <p>teknikinformatika@unusia.ac.id</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <strong>Jam Layanan Akademik:</strong>
                  <p>Senin – Jumat: 08.30 – 16.30 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© 2026 Program Studi S1 Teknik Informatika UNUSIA. Seluruh Hak Cipta Dilindungi.</p>
            <p className="tech-badge-footer">Dikembangkan menggunakan React + Vite, Node.js + Express REST API, dan MySQL Server.</p>
          </div>
          <div className="footer-bottom-right">
            <span className="footer-tag">Standar Mutu Pendidikan Tinggi</span>
            <span className="footer-tag">Sistem Informasi Terintegrasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
