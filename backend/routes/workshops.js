import express from 'express';
import {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  addReview,
} from '../controllers/workshopController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getWorkshops);
router.get('/:id', getWorkshop);
router.post('/', protect, authorize('instructor', 'admin'), createWorkshop);
router.put('/:id', protect, authorize('instructor', 'admin'), updateWorkshop);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteWorkshop);
router.post('/:id/reviews', protect, addReview);

export default router;
