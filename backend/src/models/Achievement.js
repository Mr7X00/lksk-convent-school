const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Academic',
          'Sports',
          'Cultural',
          'Competitions',
          'Creative',
          'Other',
          'academic',
          'sports',
          'cultural',
          'other',
        ],
        message: '{VALUE} is not a valid achievement category',
      },
      default: 'Academic',
      index: true,
    },
    student: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    studentClass: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'Class cannot exceed 50 characters'],
    },
    achievement: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Achievement cannot exceed 150 characters'],
    },
    event: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Event name cannot exceed 120 characters'],
    },
    year: {
      type: String,
      trim: true,
      default: '2026',
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    recipient: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Recipient name cannot exceed 100 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ isActive: 1, isFeatured: -1, date: -1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
