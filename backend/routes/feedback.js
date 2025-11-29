import express from 'express';
import {
  createFeedback,
  getWorkshopFeedback,
  getAllFeedback,
  approveFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createFeedback);
router.get('/workshop/:workshopId', getWorkshopFeedback);
router.get('/admin/all', protect, authorize('admin'), getAllFeedback);
router.put('/:id/approve', protect, authorize('admin'), approveFeedback);
router.delete('/:id', protect, deleteFeedback);

export default router;
