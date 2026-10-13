import pool from '../db.js';

export const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, code, name, short_description, min_credits, min_semester, is_active 
       FROM academic_services 
       WHERE is_active = 1 
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      message: 'Daftar layanan akademik berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data layanan akademik',
    });
  }
};

export const getServiceByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [rows] = await pool.query(
      `SELECT id, code, name, short_description, min_credits, min_semester, is_active 
       FROM academic_services 
       WHERE code = ? AND is_active = 1`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Layanan dengan kode '${code}' tidak ditemukan`,
      });
    }

    res.json({
      success: true,
      message: 'Detail layanan akademik berhasil diambil',
      data: rows[0],
    });
  } catch (error) {
    console.error('Get service by code error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail layanan akademik',
    });
  }
};
