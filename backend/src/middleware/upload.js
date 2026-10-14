import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/submissions');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now().toString(36) + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Tipe file tidak diizinkan. Hanya PDF, DOC, DOCX, JPG, JPEG, PNG yang diperbolehkan.'));
};

const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
}).single('document');

export const handleDocumentUpload = (req, res, next) => {
  uploadDocument(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file melebihi batas maksimum 5MB',
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Gagal memproses berkas yang diunggah',
    });
  });
};

const FILE_SIGNATURES = {
  'application/pdf': '25504446',
  'image/jpeg': 'FFD8FF',
  'image/jpg': 'FFD8FF',
  'image/png': '89504E470D0A1A0A',
  'application/msword': 'D0CF11E0A1B11AE1',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '504B0304',
};

export const validateFileSignature = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const expectedSignature = FILE_SIGNATURES[req.file.mimetype];
  if (!expectedSignature) {
    return next();
  }

  const buffer = Buffer.alloc(8);
  let fd;

  try {
    fd = fs.openSync(req.file.path, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
  } catch (error) {
    return next(error);
  } finally {
    if (fd !== undefined) {
      fs.closeSync(fd);
    }
  }

  const actualSignature = buffer.toString('hex').toUpperCase();

  if (!actualSignature.startsWith(expectedSignature)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch {
      // berkas mungkin sudah terhapus; abaikan
    }
    return res.status(400).json({
      success: false,
      message: 'Isi berkas tidak sesuai dengan tipe yang diizinkan',
    });
  }

  return next();
};

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
export const MAX_UPLOAD_SIZE = MAX_FILE_SIZE;
export const UPLOAD_BASE_DIR = UPLOAD_DIR;
