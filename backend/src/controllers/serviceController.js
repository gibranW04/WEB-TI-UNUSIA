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

const validateServicePayload = (body) => {
  const { code, name } = body;

  if (!code || !name) {
    return 'Kode dan nama layanan wajib diisi';
  }

  const minCredits = body.min_credits === undefined ? 0 : Number(body.min_credits);
  const minSemester = body.min_semester === undefined ? 1 : Number(body.min_semester);

  if (!Number.isInteger(minCredits) || minCredits < 0) {
    return 'Syarat minimal SKS harus berupa angka bulat non-negatif';
  }

  if (!Number.isInteger(minSemester) || minSemester < 1) {
    return 'Syarat minimal semester harus berupa angka bulat minimal 1';
  }

  return null;
};

export const getAdminServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, code, name, short_description, min_credits, min_semester, is_active, created_at, updated_at 
       FROM academic_services 
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      message: 'Daftar layanan akademik berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get admin services error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data layanan akademik',
    });
  }
};

export const createService = async (req, res) => {
  try {
    const validationError = validateServicePayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const {
      code,
      name,
      short_description: shortDescription,
      min_credits: minCredits,
      min_semester: minSemester,
      is_active: isActive,
    } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM academic_services WHERE code = ?',
      [code.trim().toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Kode layanan '${code}' sudah digunakan`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO academic_services 
       (code, name, short_description, min_credits, min_semester, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        code.trim().toLowerCase(),
        name.trim(),
        shortDescription ? shortDescription.trim() : null,
        minCredits === undefined ? 0 : Number(minCredits),
        minSemester === undefined ? 1 : Number(minSemester),
        isActive === undefined ? 1 : isActive ? 1 : 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Layanan akademik berhasil dibuat',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat layanan akademik',
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateServicePayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const [existing] = await pool.query(
      'SELECT id, is_active FROM academic_services WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan akademik tidak ditemukan',
      });
    }

    const {
      code,
      name,
      short_description: shortDescription,
      min_credits: minCredits,
      min_semester: minSemester,
      is_active: isActive,
    } = req.body;

    const [duplicate] = await pool.query(
      'SELECT id FROM academic_services WHERE code = ? AND id <> ?',
      [code.trim().toLowerCase(), id]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Kode layanan '${code}' sudah digunakan`,
      });
    }

    await pool.query(
      `UPDATE academic_services 
       SET code = ?, name = ?, short_description = ?, min_credits = ?, min_semester = ?, is_active = ? 
       WHERE id = ?`,
      [
        code.trim().toLowerCase(),
        name.trim(),
        shortDescription ? shortDescription.trim() : null,
        minCredits === undefined ? 0 : Number(minCredits),
        minSemester === undefined ? 1 : Number(minSemester),
        isActive === undefined ? existing[0].is_active : isActive ? 1 : 0,
        id,
      ]
    );

    res.json({
      success: true,
      message: 'Layanan akademik berhasil diperbarui',
      data: { id: Number(id) },
    });
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui layanan akademik',
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM academic_services WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan akademik tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Layanan akademik berhasil dihapus',
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        success: false,
        message: 'Layanan tidak dapat dihapus karena masih memiliki pengajuan terkait. Nonaktifkan layanan sebagai gantinya.',
      });
    }

    console.error('Delete service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus layanan akademik',
    });
  }
};
