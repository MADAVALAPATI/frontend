import User from '../models/User.js';
import Workshop from '../models/Workshop.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkshops = await Workshop.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const workshopsByCategory = await Workshop.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const recentRegistrations = await Registration.find()
      .populate('userId', 'fullName email')
      .populate('workshopId', 'title')
      .limit(10)
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWorkshops,
        totalRegistrations,
        totalFeedback,
        usersByRole,
        workshopsByCategory,
        recentRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Update user status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics data
export const getAnalytics = async (req, res, next) => {
  try {
    const registrationTrend = await Registration.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const topWorkshops = await Workshop.find()
      .sort({ currentParticipants: -1 })
      .limit(5)
      .select('title currentParticipants maxParticipants rating');

    res.status(200).json({
      success: true,
      data: {
        registrationTrend,
        feedbackStats,
        topWorkshops,
      },
    });
  } catch (error) {
    next(error);
  }
};
