import express from 'express';
import {
  registerForWorkshop,
  getUserRegistrations,
  getWorkshopRegistrations,
  cancelRegistration,
  updateRegistrationStatus,
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, registerForWorkshop);
router.get('/user', protect, getUserRegistrations);
router.get('/workshop/:workshopId', protect, authorize('instructor', 'admin'), getWorkshopRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.put('/:id/status', protect, authorize('instructor', 'admin'), updateRegistrationStatus);

export default router;
