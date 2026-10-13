import express from 'express';
import { getServices, getServiceByCode } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:code', getServiceByCode);

export default router;
