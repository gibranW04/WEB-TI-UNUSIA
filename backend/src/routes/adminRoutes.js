import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  getAdminSubmissions,
} from '../controllers/adminController.js';
import {
  getAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import {
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeRoles('admin'));

// Ringkasan sistem
router.get('/stats', getAdminStats);

// Pengelolaan berita dan pengumuman
router.get('/announcements', getAdminAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Pengelolaan informasi layanan akademik
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Pengelolaan pengguna dan peran
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Pemantauan pengajuan
router.get('/submissions', getAdminSubmissions);

export default router;
