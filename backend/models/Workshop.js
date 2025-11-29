import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a workshop title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Technology', 'Business', 'Creative', 'Personal Development', 'Other'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    duration: {
      type: Number, // in hours
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please provide maximum participants'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    materials: [
      {
        title: String,
        url: String,
        type: String, // pdf, video, document, etc
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'draft',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

export default mongoose.model('Workshop', workshopSchema);
