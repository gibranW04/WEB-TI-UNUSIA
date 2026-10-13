import pool from '../db.js';

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

    // Buat slug sederhana yang unik
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const [result] = await pool.query(
      `INSERT INTO announcements (author_id, title, slug, category, summary, content, is_published) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [authorId, title.trim(), slug, category, summary.trim(), content.trim()]
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
