import express from 'express';
import { 
  getSubmissions, 
  getSubmissionById, 
  createSubmission, 
  createReview 
} from '../controllers/submissionController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.post('/', authorizeRoles('mahasiswa'), createSubmission);
router.post('/:id/reviews', authorizeRoles('dosen', 'admin'), createReview);

export default router;
