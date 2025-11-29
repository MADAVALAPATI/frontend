import Feedback from '../models/Feedback.js';

// Create feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { workshopId, rating, comment, categories, isAnonymous } = req.body;

    const feedback = await Feedback.create({
      userId: req.userId,
      workshopId,
      rating,
      comment,
      categories,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Get workshop feedback
export const getWorkshopFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({
      workshopId: req.params.workshopId,
      approved: true,
    })
      .populate('userId', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedback (admin)
export const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'fullName email')
      .populate('workshopId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// Approve feedback (admin)
export const approveFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Delete feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check authorization
    if (feedback.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted',
    });
  } catch (error) {
    next(error);
  }
};
