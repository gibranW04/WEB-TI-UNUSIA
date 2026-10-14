import pool from '../db.js';

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [students] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'mahasiswa'");
    const [lecturers] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'dosen'");
    const [admins] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");

    const [totalSubmissions] = await pool.query('SELECT COUNT(*) as count FROM submissions');
    const [pendingSubmissions] = await pool.query("SELECT COUNT(*) as count FROM submissions WHERE status IN ('submitted', 'in_review')");
    const [approvedSubmissions] = await pool.query("SELECT COUNT(*) as count FROM submissions WHERE status = 'approved'");
    const [revisionSubmissions] = await pool.query("SELECT COUNT(*) as count FROM submissions WHERE status = 'revision_required'");

    const [totalAnnouncements] = await pool.query('SELECT COUNT(*) as count FROM announcements');

    res.json({
      success: true,
      message: 'Statistik sistem berhasil diambil',
      data: {
        users: {
          total: totalUsers[0].count,
          students: students[0].count,
          lecturers: lecturers[0].count,
          admins: admins[0].count,
        },
        submissions: {
          total: totalSubmissions[0].count,
          pending: pendingSubmissions[0].count,
          approved: approvedSubmissions[0].count,
          revision: revisionSubmissions[0].count,
        },
        announcements: {
          total: totalAnnouncements[0].count,
        },
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik sistem',
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let sql = `
      SELECT u.id, u.username, u.email, u.full_name, u.role, u.phone, u.status, u.created_at,
             p.study_program, p.semester, p.total_credits, p.gpa
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role && ['mahasiswa', 'dosen', 'admin'].includes(role)) {
      sql += ' AND u.role = ?';
      params.push(role);
    }

    if (search) {
      sql += ' AND (u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY u.created_at DESC';

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Daftar pengguna berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get admin users error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengguna',
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak dapat mengubah status akun Anda sendiri',
      });
    }

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Pilihan: active, inactive, suspended',
      });
    }

    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: `Status pengguna berhasil diperbarui menjadi ${status}`,
    });
  } catch (error) {
    console.error('Update user status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pengguna',
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak dapat mengubah peran akun Anda sendiri',
      });
    }

    if (!role || !['mahasiswa', 'dosen', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Peran tidak valid. Pilihan: mahasiswa, dosen, admin',
      });
    }

    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: `Peran pengguna berhasil diperbarui menjadi ${role}`,
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui peran pengguna',
    });
  }
};

export const getAdminSubmissions = async (req, res) => {
  try {
    const { service_code: serviceCode, status, search } = req.query;
    let sql = `
      SELECT 
        s.id, s.submission_number, s.title, s.agency_name, s.status, s.current_step, 
        s.submitted_at, s.updated_at,
        svc.name as service_name, svc.code as service_code,
        u_student.full_name as student_name, u_student.username as student_nim,
        u_rev.full_name as reviewer_name
      FROM submissions s
      JOIN academic_services svc ON s.service_id = svc.id
      JOIN users u_student ON s.student_id = u_student.id
      LEFT JOIN users u_rev ON s.reviewer_id = u_rev.id
      WHERE 1 = 1
    `;
    const params = [];

    if (serviceCode) {
      sql += ' AND svc.code = ?';
      params.push(serviceCode);
    }

    if (status) {
      sql += ' AND s.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (s.submission_number LIKE ? OR s.title LIKE ? OR u_student.full_name LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY s.submitted_at DESC';

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Daftar pengajuan berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get admin submissions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengajuan',
    });
  }
};
