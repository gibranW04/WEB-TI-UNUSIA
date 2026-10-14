import express from 'express';
import { 
  getAnnouncements, 
  getAnnouncementBySlug 
} from '../controllers/announcementController.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:slug', getAnnouncementBySlug);

export default router;
