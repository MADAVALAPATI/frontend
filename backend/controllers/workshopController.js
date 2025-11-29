import Workshop from '../models/Workshop.js';

// Get all workshops
export const getWorkshops = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const workshops = await Workshop.find(filter)
      .populate('instructor', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops,
    });
  } catch (error) {
    next(error);
  }
};

// Get single workshop
export const getWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('instructor', 'fullName email bio')
      .populate('reviews.userId', 'fullName profileImage');

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// Create workshop
export const createWorkshop = async (req, res, next) => {
  try {
    const { title, description, category, startDate, endDate, duration, maxParticipants, price, location } = req.body;

    const workshop = await Workshop.create({
      title,
      description,
      category,
      startDate,
      endDate,
      duration,
      maxParticipants,
      price,
      location,
      instructor: req.userId,
    });

    res.status(201).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// Update workshop
export const updateWorkshop = async (req, res, next) => {
  try {
    let workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check authorization
    if (workshop.instructor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this workshop' });
    }

    workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// Delete workshop
export const deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check authorization
    if (workshop.instructor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this workshop' });
    }

    await Workshop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Workshop deleted',
    });
  } catch (error) {
    next(error);
  }
};

// Add review
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const review = {
      userId: req.userId,
      rating,
      comment,
    };

    workshop.reviews.push(review);

    // Update average rating
    const avgRating = workshop.reviews.reduce((sum, rev) => sum + rev.rating, 0) / workshop.reviews.length;
    workshop.rating = avgRating;

    await workshop.save();

    res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};
