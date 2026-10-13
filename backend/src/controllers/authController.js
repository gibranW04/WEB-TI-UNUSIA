import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nomor identitas / username dan kata sandi wajib diisi',
      });
    }

    // Cari user berdasarkan username atau email
    const [rows] = await pool.query(
      `SELECT id, username, email, password, full_name, role, phone, avatar, status 
       FROM users 
       WHERE username = ? OR email = ?`,
      [identifier.trim(), identifier.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Kombinasi identitas atau kata sandi tidak valid',
      });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda berstatus nonaktif atau ditangguhkan. Hubungi admin.',
      });
    }

    // Verifikasi kata sandi dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Kombinasi identitas atau kata sandi tidak valid',
      });
    }

    // Buat JWT Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Ambil profile tambahan jika ada
    const [profiles] = await pool.query(
      `SELECT identity_number, study_program, faculty, batch_year, semester, total_credits, gpa, specialization 
       FROM user_profiles 
       WHERE user_id = ?`,
      [user.id]
    );

    res.json({
      success: true,
      message: 'Autentikasi berhasil',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          profile: profiles[0] || null,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses login',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, username, email, full_name, role, phone, avatar, status, created_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan',
      });
    }

    const [profiles] = await pool.query(
      `SELECT identity_number, study_program, faculty, batch_year, semester, total_credits, gpa, specialization, academic_advisor_id 
       FROM user_profiles 
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Profil pengguna berhasil diambil',
      data: {
        ...rows[0],
        profile: profiles[0] || null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profil pengguna',
    });
  }
};
