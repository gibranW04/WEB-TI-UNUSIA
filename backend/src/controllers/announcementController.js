import pool from '../db.js';

const ALLOWED_CATEGORIES = ['pengumuman', 'kegiatan', 'workshop', 'akademik'];

const buildSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${baseSlug}-${Date.now().toString().slice(-4)}`;
};

export const getAnnouncements = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    let sql = `
      SELECT a.id, a.title, a.slug, a.category, a.summary, a.is_published, a.published_at, u.full_name as author_name 
      FROM announcements a
      JOIN users u ON a.author_id = u.id
      WHERE a.is_published = 1
    `;
    const params = [];

    if (category && category !== 'semua') {
      sql += ` AND a.category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY a.published_at DESC LIMIT ?`;
    params.push(parsedLimit);

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Daftar pengumuman dan berita berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get announcements error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengumuman',
    });
  }
};

export const getAnnouncementBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.category, a.summary, a.content, a.is_published, a.published_at, a.created_at, u.full_name as author_name 
       FROM announcements a
       JOIN users u ON a.author_id = u.id
       WHERE a.slug = ? AND a.is_published = 1`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman atau berita tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Detail pengumuman berhasil diambil',
      data: rows[0],
    });
  } catch (error) {
    console.error('Get announcement by slug error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pengumuman',
    });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, category, summary, content } = req.body;
    const authorId = req.user.id;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Judul, kategori, ringkasan, dan konten wajib diisi',
      });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak valid. Pilihan: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    const isPublished = req.body.is_published === undefined ? 1 : req.body.is_published ? 1 : 0;
    const slug = buildSlug(title);

    const [result] = await pool.query(
      `INSERT INTO announcements (author_id, title, slug, category, summary, content, is_published) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [authorId, title.trim(), slug, category, summary.trim(), content.trim(), isPublished]
    );

    res.status(201).json({
      success: true,
      message: 'Pengumuman berhasil dipublikasikan',
      data: {
        id: result.insertId,
        slug,
        title,
      },
    });
  } catch (error) {
    console.error('Create announcement error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat pengumuman baru',
    });
  }
};

export const getAdminAnnouncements = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let sql = `
      SELECT a.id, a.title, a.slug, a.category, a.summary, a.is_published, a.published_at, a.updated_at,
             u.full_name as author_name
      FROM announcements a
      JOIN users u ON a.author_id = u.id
      WHERE 1 = 1
    `;
    const params = [];

    if (category && ALLOWED_CATEGORIES.includes(category)) {
      sql += ' AND a.category = ?';
      params.push(category);
    }

    if (status === 'published') {
      sql += ' AND a.is_published = 1';
    } else if (status === 'draft') {
      sql += ' AND a.is_published = 0';
    }

    if (search) {
      sql += ' AND (a.title LIKE ? OR a.summary LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY a.published_at DESC';

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Daftar pengumuman berhasil diambil',
      data: rows,
    });
  } catch (error) {
    console.error('Get admin announcements error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar pengumuman',
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, summary, content } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Judul, kategori, ringkasan, dan konten wajib diisi',
      });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak valid. Pilihan: ${ALLOWED_CATEGORIES.join(', ')}`,
      });
    }

    const [existing] = await pool.query(
      'SELECT id, is_published FROM announcements WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan',
      });
    }

    const isPublished =
      req.body.is_published === undefined
        ? existing[0].is_published
        : req.body.is_published
          ? 1
          : 0;

    await pool.query(
      `UPDATE announcements 
       SET title = ?, category = ?, summary = ?, content = ?, is_published = ? 
       WHERE id = ?`,
      [title.trim(), category, summary.trim(), content.trim(), isPublished, id]
    );

    res.json({
      success: true,
      message: 'Pengumuman berhasil diperbarui',
      data: { id: Number(id) },
    });
  } catch (error) {
    console.error('Update announcement error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui pengumuman',
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pengumuman tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Pengumuman berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete announcement error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pengumuman',
    });
  }
};
