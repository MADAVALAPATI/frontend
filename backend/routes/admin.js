import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

export default router;
