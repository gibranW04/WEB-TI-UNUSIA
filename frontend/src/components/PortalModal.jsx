import React, { useState } from 'react';

export default function PortalModal({ 
  isOpen, 
  onClose, 
  selectedService, 
  apiStatus, 
  currentUser, 
  onLoginSuccess, 
  onLogout 
}) {
  const [role, setRole] = useState('mahasiswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  if (!isOpen) return null;

  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    setSubmissionFeedback(null);
    if (targetRole === 'mahasiswa') {
      setIdentifier('21102001');
      setPassword('Password123!');
    } else if (targetRole === 'dosen') {
      setIdentifier('0412345678');
      setPassword('Password123!');
    } else if (targetRole === 'admin') {
      setIdentifier('admin');
      setPassword('Password123!');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Mohon masukkan nomor identitas (NIM/NIDN/Username) dan kata sandi.'
      });
      return;
    }

    setLoading(true);
    setSubmissionFeedback(null);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionFeedback({
          type: 'info',
          message: `Login Berhasil! Selamat datang, ${result.data.user.full_name} (${result.data.user.role.toUpperCase()}).`
        });
        if (onLoginSuccess) {
          onLoginSuccess(result.data.user, result.data.token);
        }
      } else {
        setSubmissionFeedback({
          type: 'error',
          message: result.message || 'Kombinasi identitas atau kata sandi tidak valid.'
        });
      }
    } catch {
      setSubmissionFeedback({
        type: 'error',
        message: 'Tidak dapat terhubung ke REST API backend. Pastikan server aktif di port 3000.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {currentUser 
                ? 'Profil Sesi Pengguna Aktif' 
                : selectedService 
                  ? `Akses ${selectedService.title}` 
                  : 'Masuk Portal Digital TI UNUSIA'}
            </h3>
            <span className="modal-subtitle">
              Sistem Otentikasi & Layanan Akademik Terpadu
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup modal">×</button>
        </div>

        <div className="modal-body">
          {currentUser ? (
            /* Logged in state view */
            <div className="user-session-card">
              <div className="session-avatar-circle">
                {currentUser.role === 'mahasiswa' ? '👨‍🎓' : currentUser.role === 'dosen' ? '👨‍🏫' : '⚙️'}
              </div>
              <h4 className="session-user-name">{currentUser.full_name}</h4>
              <p className="session-user-meta">
                ID: <strong>{currentUser.username}</strong> • Email: {currentUser.email}
              </p>
              <span className={`session-role-badge badge-${currentUser.role}`}>
                Peran: {currentUser.role.toUpperCase()}
              </span>

              {currentUser.profile && (
                <div className="profile-details-box mt-3">
                  <div><strong>Program Studi:</strong> {currentUser.profile.study_program}</div>
                  {currentUser.profile.semester && (
                    <div><strong>Semester / SKS:</strong> Semester {currentUser.profile.semester} ({currentUser.profile.total_credits} SKS)</div>
                  )}
                  {currentUser.profile.specialization && (
                    <div><strong>Konsentrasi:</strong> {currentUser.profile.specialization}</div>
                  )}
                </div>
              )}

              <div className="session-actions mt-4">
                <button className="btn btn-outline btn-block" onClick={onClose}>
                  Tutup Dialog
                </button>
                <button className="btn btn-danger btn-block mt-2" onClick={onLogout}>
                  Keluar dari Akun (Logout)
                </button>
              </div>
            </div>
          ) : (
            /* Login Form View */
            <>
              {selectedService && (
                <div className="modal-service-notice">
                  <span className="notice-icon">{selectedService.icon}</span>
                  <div>
                    <strong>Layanan Terpilih: {selectedService.title}</strong>
                    <p>Silakan masuk menggunakan akun civitas akademik Anda untuk memulai pengisian berkas dan pengunggahan dokumen.</p>
                  </div>
                </div>
              )}

              {/* Role Selector Tabs */}
              <div className="role-selector">
                <span className="role-label">Pilih Peran Pengguna:</span>
                <div className="role-buttons">
                  <button 
                    type="button"
                    className={`role-btn ${role === 'mahasiswa' ? 'is-selected' : ''}`}
                    onClick={() => { setRole('mahasiswa'); setSubmissionFeedback(null); }}
                  >
                    👨‍🎓 Mahasiswa
                  </button>
                  <button 
                    type="button"
                    className={`role-btn ${role === 'dosen' ? 'is-selected' : ''}`}
                    onClick={() => { setRole('dosen'); setSubmissionFeedback(null); }}
                  >
                    👨‍🏫 Dosen
                  </button>
                  <button 
                    type="button"
                    className={`role-btn ${role === 'admin' ? 'is-selected' : ''}`}
                    onClick={() => { setRole('admin'); setSubmissionFeedback(null); }}
                  >
                    ⚙️ Admin
                  </button>
                </div>
              </div>

              {/* Quick Fill Test Accounts */}
              <div className="quick-fill-bar">
                <span className="quick-fill-label">Uji Coba Cepat (Seed Data):</span>
                <div className="quick-fill-buttons">
                  <button 
                    type="button" 
                    className="quick-btn" 
                    onClick={() => handleQuickFill('mahasiswa')}
                  >
                    Isi Mahasiswa
                  </button>
                  <button 
                    type="button" 
                    className="quick-btn" 
                    onClick={() => handleQuickFill('dosen')}
                  >
                    Isi Dosen
                  </button>
                  <button 
                    type="button" 
                    className="quick-btn" 
                    onClick={() => handleQuickFill('admin')}
                  >
                    Isi Admin
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="modal-id">
                    {role === 'mahasiswa' ? 'Nomor Induk Mahasiswa (NIM)' : role === 'dosen' ? 'NIDN / NIP Dosen' : 'Username Administrator'}
                  </label>
                  <input 
                    id="modal-id"
                    type="text" 
                    className="form-input" 
                    placeholder={role === 'mahasiswa' ? 'Contoh: 21102001' : role === 'dosen' ? 'Contoh: 0412345678' : 'Contoh: admin'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-password">Kata Sandi (Password)</label>
                  <input 
                    id="modal-password"
                    type="password" 
                    className="form-input" 
                    placeholder="Masukkan kata sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {submissionFeedback && (
                  <div className={`feedback-alert feedback-${submissionFeedback.type}`}>
                    <span className="feedback-icon">{submissionFeedback.type === 'error' ? '⚠️' : '✓'}</span>
                    <span className="feedback-text">{submissionFeedback.message}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-block btn-lg mt-3"
                >
                  {loading ? 'Memverifikasi Kredensial...' : `Masuk sebagai ${role === 'mahasiswa' ? 'Mahasiswa' : role === 'dosen' ? 'Dosen' : 'Administrator'}`}
                </button>
              </form>
            </>
          )}

          {/* Status Indicator */}
          <div className="modal-api-note">
            <span className={`status-indicator-dot ${apiStatus.connected ? 'is-green' : 'is-gray'}`}></span>
            <span>REST API Endpoint: http://localhost:3000/api/auth/login ({apiStatus.connected ? 'Siap' : 'Offline'})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
