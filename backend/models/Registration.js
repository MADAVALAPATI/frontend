import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'completed', 'cancelled'],
      default: 'registered',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    certificateUrl: {
      type: String,
      default: null,
    },
    attendanceRecord: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, workshopId: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
