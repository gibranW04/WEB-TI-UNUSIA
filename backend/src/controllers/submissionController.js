import pool from '../db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const uploadSubmissionDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { document_type } = req.body;
    const userId = req.user.id;

    const validDocumentTypes = [
      'proposal',
      'surat_pengantar',
      'logbook',
      'laporan',
      'bukti_acc',
      'lainnya',
    ];

    if (!document_type || !validDocumentTypes.includes(document_type)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis dokumen wajib diisi dan harus sesuai (proposal, surat_pengantar, logbook, laporan, bukti_acc, lainnya).',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File dokumen wajib diunggah. Hanya diperbolehkan PDF, DOC, DOCX, JPG, JPEG, PNG dengan ukuran maksimal 5MB.',
      });
    }

    const [submissionRows] = await pool.query(
      `SELECT id, student_id, status 
       FROM submissions 
       WHERE id = ?`,
      [id]
    );

    if (submissionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan',
      });
    }

    const submission = submissionRows[0];

    if (req.user.role === 'mahasiswa' && submission.student_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin mengunggah dokumen untuk pengajuan ini',
      });
    }

    const [existingVersion] = await pool.query(
      `SELECT MAX(version) as max_version 
       FROM submission_documents 
       WHERE submission_id = ? AND document_type = ?`,
      [id, document_type]
    );

    const nextVersion = existingVersion[0].max_version ? existingVersion[0].max_version + 1 : 1;

    const filePath = req.file.path;
    const relativePath = pathRelative(filePath);

    await pool.query(
      `INSERT INTO submission_documents 
       (submission_id, document_type, file_name, file_path, file_size, mime_type, version) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        document_type,
        req.file.originalname,
        relativePath,
        req.file.size,
        req.file.mimetype,
        nextVersion,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Dokumen berhasil diunggah dan tersimpan',
      data: {
        submission_id: Number(id),
        document_type,
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        version: nextVersion,
      },
    });
  } catch (error) {
    console.error('Upload submission document error:', error.message);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file melebihi batas maksimum 5MB',
      });
    }
    next(error);
  }
};

export const downloadSubmissionDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const { role, id: userId } = req.user;

    const [submissionRows] = await pool.query(
      'SELECT id, student_id FROM submissions WHERE id = ?',
      [id]
    );

    if (submissionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengajuan tidak ditemukan',
      });
    }

    if (role === 'mahasiswa' && submissionRows[0].student_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin mengunduh berkas ini',
      });
    }

    const [docRows] = await pool.query(
      'SELECT id, file_name, file_path FROM submission_documents WHERE id = ? AND submission_id = ?',
      [docId, id]
    );

    if (docRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan',
      });
    }

    const doc = docRows[0];
    const uploadsBase = path.resolve(__dirname, '../../uploads');
    const absolutePath = path.resolve(__dirname, '../../', doc.file_path);

    if (absolutePath !== uploadsBase && !absolutePath.startsWith(uploadsBase + path.sep)) {
      return res.status(400).json({
        success: false,
        message: 'Lokasi berkas tidak valid',
      });
    }

    return res.download(absolutePath, doc.file_name, (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          message: 'Berkas tidak ditemukan pada server',
        });
      }
    });
  } catch (error) {
    console.error('Download submission document error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh dokumen pengajuan',
    });
  }
};

function pathRelative(filePath) {
  try {
    const normalized = filePath.replace(/\\/g, '/');
    const uploadsIndex = normalized.indexOf('/uploads/');
    if (uploadsIndex !== -1) {
      return normalized.substring(uploadsIndex + 1);
    }
    return normalized;
  } catch {
    return filePath;
  }
}

