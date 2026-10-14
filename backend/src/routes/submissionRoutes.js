import express from 'express';
import { 
  getSubmissions, 
  getSubmissionById, 
  createSubmission, 
  createReview, 
  uploadSubmissionDocument,
  downloadSubmissionDocument
} from '../controllers/submissionController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { handleDocumentUpload, validateFileSignature } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.post('/', authorizeRoles('mahasiswa'), createSubmission);
router.post('/:id/reviews', authorizeRoles('dosen', 'admin'), createReview);
router.post('/:id/documents', authorizeRoles('mahasiswa', 'admin'), handleDocumentUpload, validateFileSignature, uploadSubmissionDocument);
router.get('/:id/documents/:docId/download', downloadSubmissionDocument);

export default router;
