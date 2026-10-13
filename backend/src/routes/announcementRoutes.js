import express from 'express';
import { 
  getAnnouncements, 
  getAnnouncementBySlug, 
  createAnnouncement 
} from '../controllers/announcementController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:slug', getAnnouncementBySlug);
router.post('/', authenticateToken, authorizeRoles('admin'), createAnnouncement);

export default router;
