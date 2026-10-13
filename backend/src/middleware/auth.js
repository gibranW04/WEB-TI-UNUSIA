import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET belum dikonfigurasi. Atur variabel JWT_SECRET pada file backend/.env sebelum menjalankan server.'
  );
}

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verifikasi user di database
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, role, status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan dalam sistem',
      });
    }

    const user = rows[0];
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda berstatus nonaktif atau ditangguhkan',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token kedaluwarsa atau tidak valid',
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki hak akses untuk tindakan ini',
      });
    }
    next();
  };
};

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};
