import pool from '../db.js';

export const getSubmissions = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let sql = `
      SELECT 
        s.id, s.submission_number, s.title, s.agency_name, s.status, s.current_step, s.submitted_at, s.updated_at,
        svc.name as service_name, svc.code as service_code,
        u_student.full_name as student_name, u_student.username as student_nim,
        u_rev.full_name as reviewer_name
      FROM submissions s
      JOIN academic_services svc ON s.service_id = svc.id
      JOIN users u_student ON s.student_id = u_student.id
      LEFT JOIN users u_rev ON s.reviewer_id = u_rev.id
    `;
    const params = [];

    if (role === 'mahasiswa') {
      sql += ' WHERE s.student_id = ?';
      params.push(userId);
    } else if (role === 'dosen') {
      sql += ' WHERE s.reviewer_id = ? OR s.status IN ("submitted", "in_review")';
      params.push(userId);
    }

    sql += ' ORDER BY s.submitted_at DESC';

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Daftar pengajuan berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get submissions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengajuan',
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const [rows] = await pool.query(
      `SELECT 
        s.id, s.submission_number, s.service_id, s.student_id, s.reviewer_id,
        s.title, s.agency_name, s.agency_address, s.status, s.current_step, s.notes,
        s.submitted_at, s.updated_at,
        svc.name as service_name, svc.code as service_code,
        u_student.full_name as student_name, u_student.username as student_nim,
        u_rev.full_name as reviewer_name
      FROM submissions s
      JOIN academic_services svc ON s.service_id = svc.id
      JOIN users u_student ON s.student_id = u_student.id
      LEFT JOIN users u_rev ON s.reviewer_id = u_rev.id
      WHERE s.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan',
      });
    }

    const submission = rows[0];

    // Otorisasi akses data
    if (role === 'mahasiswa' && submission.student_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin melihat berkas mahasiswa lain',
      });
    }

    // Ambil dokumen lampiran
    const [documents] = await pool.query(
      `SELECT id, document_type, file_name, file_size, mime_type, version, uploaded_at 
       FROM submission_documents 
       WHERE submission_id = ? 
       ORDER BY uploaded_at DESC`,
      [id]
    );

    // Ambil riwayat review
    const [reviews] = await pool.query(
      `SELECT r.id, r.action, r.review_notes, r.created_at, u.full_name as reviewer_name, u.role as reviewer_role 
       FROM submission_reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.submission_id = ? 
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      message: 'Detail pengajuan berhasil diambil',
      data: {
        ...submission,
        documents,
        reviews,
      },
    });
  } catch (error) {
    console.error('Get submission by id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pengajuan',
    });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { service_code, title, agency_name, agency_address, notes } = req.body;

    if (!service_code || !title) {
      return res.status(400).json({
        success: false,
        message: 'Kode layanan dan judul usulan wajib diisi',
      });
    }

    // Ambil service_id
    const [svcRows] = await pool.query(
      'SELECT id, code, name FROM academic_services WHERE code = ? AND is_active = 1',
      [service_code]
    );

    if (svcRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Layanan '${service_code}' tidak aktif atau tidak ditemukan`,
      });
    }

    const service = svcRows[0];
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codePrefix = service.code.slice(0, 2).toUpperCase();
    const submissionNumber = `SUB-${codePrefix}-${year}-${randomSuffix}`;

    const [result] = await pool.query(
      `INSERT INTO submissions 
       (submission_number, service_id, student_id, title, agency_name, agency_address, notes, status, current_step) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', 1)`,
      [
        submissionNumber,
        service.id,
        studentId,
        title.trim(),
        agency_name ? agency_name.trim() : null,
        agency_address ? agency_address.trim() : null,
        notes ? notes.trim() : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Pengajuan berkas akademik berhasil dibuat',
      data: {
        id: result.insertId,
        submission_number: submissionNumber,
        service_name: service.name,
        status: 'submitted',
      },
    });
  } catch (error) {
    console.error('Create submission error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memproses pengajuan akademik',
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user.id;
    const { action, review_notes } = req.body;

    const validActions = ['approved', 'revision_required', 'rejected', 'commented'];
    if (!action || !validActions.includes(action) || !review_notes) {
      return res.status(400).json({
        success: false,
        message: 'Tindakan evaluasi (action) dan catatan review wajib diisi dengan benar',
      });
    }

    // Periksa keberadaan submission
    const [subRows] = await pool.query('SELECT id, status, current_step FROM submissions WHERE id = ?', [id]);
    if (subRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan',
      });
    }

    const currentSub = subRows[0];

    // Simpan review
    await pool.query(
      `INSERT INTO submission_reviews (submission_id, reviewer_id, action, review_notes) 
       VALUES (?, ?, ?, ?)`,
      [id, reviewerId, action, review_notes.trim()]
    );

    // Tentukan status submission baru
    let newStatus = currentSub.status;
    let newStep = currentSub.current_step;

    if (action === 'approved') {
      newStatus = 'approved';
      newStep = Math.min(newStep + 1, 4);
    } else if (action === 'revision_required') {
      newStatus = 'revision_required';
    } else if (action === 'rejected') {
      newStatus = 'rejected';
    } else if (action === 'commented') {
      newStatus = 'in_review';
    }

    await pool.query(
      'UPDATE submissions SET status = ?, current_step = ?, reviewer_id = ? WHERE id = ?',
      [newStatus, newStep, reviewerId, id]
    );

    res.json({
      success: true,
      message: 'Catatan review berhasil disimpan dan status pengajuan diperbarui',
      data: {
        submission_id: Number(id),
        status: newStatus,
        current_step: newStep,
      },
    });
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan catatan evaluasi review',
    });
  }
};
