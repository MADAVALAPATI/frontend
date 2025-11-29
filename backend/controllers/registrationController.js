import Registration from '../models/Registration.js';
import Workshop from '../models/Workshop.js';

// Register for workshop
export const registerForWorkshop = async (req, res, next) => {
  try {
    const { workshopId } = req.body;

    // Check if workshop exists
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check if already registered
    let registration = await Registration.findOne({
      userId: req.userId,
      workshopId,
    });

    if (registration) {
      return res.status(400).json({ message: 'Already registered for this workshop' });
    }

    // Check if workshop has space
    if (workshop.currentParticipants >= workshop.maxParticipants) {
      return res.status(400).json({ message: 'Workshop is full' });
    }

    // Create registration
    registration = await Registration.create({
      userId: req.userId,
      workshopId,
      paymentAmount: workshop.price,
    });

    // Update workshop participants
    workshop.currentParticipants += 1;
    await workshop.save();

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// Get user registrations
export const getUserRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.userId })
      .populate('workshopId')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// Get workshop registrations (for instructors/admins)
export const getWorkshopRegistrations = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId);

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check authorization
    if (workshop.instructor.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ workshopId: req.params.workshopId })
      .populate('userId', 'fullName email phone')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel registration
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check authorization
    if (registration.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Update workshop participants
    const workshop = await Workshop.findById(registration.workshopId);
    if (workshop) {
      workshop.currentParticipants = Math.max(0, workshop.currentParticipants - 1);
      await workshop.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled',
    });
  } catch (error) {
    next(error);
  }
};

// Update registration status
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    await registration.save();

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
