import React, { useState } from 'react';

export default function Navbar({ apiStatus, currentUser, onOpenLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      {/* Top Banner Notice */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <span className="top-badge">Pengumuman</span>
            <span className="top-text">Pendaftaran Layanan Magang, Skripsi & KKN Semester Aktif Dibuka Secara Online</span>
          </div>
          <div className="top-bar-right">
            <span className="top-info">Call Center Prodi: (021) 390-8888</span>
            <span className="top-divider">|</span>
            <span className="top-info">ti@unusia.ac.id</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" aria-label="Navigasi Utama">
        <div className="container navbar-container">
          {/* Logo & Brand */}
          <a href="#hero" className="navbar-brand" onClick={closeMenu}>
            <div className="brand-logo-circle">
              <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">Teknik Informatika</span>
              <span className="brand-subtitle">Universitas Nahdlatul Ulama Indonesia</span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div className="navbar-links">
            <a href="#hero" className="nav-link">Beranda</a>
            <a href="#profil" className="nav-link">Profil Prodi</a>
            <a href="#layanan" className="nav-link">Layanan Digital</a>
            <a href="#akademik" className="nav-link">Akademik</a>
            <a href="#berita" className="nav-link">Berita</a>
            <a href="#kontak" className="nav-link">Kontak</a>
          </div>

          {/* Right Action & API Status Indicator */}
          <div className="navbar-actions">
            <div 
              className={`api-status-pill ${apiStatus.connected ? 'is-connected' : 'is-disconnected'}`}
              title={apiStatus.connected ? 'REST API Backend terhubung dengan normal' : 'Menghubungkan ke REST API backend'}
            >
              <span className="status-dot"></span>
              <span className="status-text">{apiStatus.connected ? 'API Online' : 'API Standby'}</span>
            </div>

            {currentUser ? (
              <button 
                className="user-header-pill"
                onClick={() => onOpenLogin()}
                title="Lihat profil sesi Anda"
              >
                <span className="user-pill-avatar">
                  {currentUser.role === 'mahasiswa' ? '👨‍🎓' : currentUser.role === 'dosen' ? '👨‍🏫' : '⚙️'}
                </span>
                <span className="user-pill-name">{currentUser.full_name}</span>
                <span className={`user-pill-role role-tag-${currentUser.role}`}>{currentUser.role}</span>
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-portal"
                onClick={() => onOpenLogin()}
                aria-label="Masuk ke Portal Akademik"
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Masuk Portal</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              className={`hamburger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-links">
              <a href="#hero" className="mobile-link" onClick={closeMenu}>Beranda</a>
              <a href="#profil" className="mobile-link" onClick={closeMenu}>Profil Prodi</a>
              <a href="#layanan" className="mobile-link" onClick={closeMenu}>Layanan Digital</a>
              <a href="#akademik" className="mobile-link" onClick={closeMenu}>Akademik</a>
              <a href="#berita" className="mobile-link" onClick={closeMenu}>Berita & Pengumuman</a>
              <a href="#kontak" className="mobile-link" onClick={closeMenu}>Kontak</a>
            </div>
            <div className="mobile-action-bar">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => { closeMenu(); onOpenLogin(); }}
              >
                {currentUser ? `Profil (${currentUser.full_name})` : 'Masuk ke Portal Digital'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
