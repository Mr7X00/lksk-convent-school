const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
      index: true,
    },
    examType: {
      type: String,
      required: [true, 'Exam type is required'],
      trim: true,
      default: 'Class 10',
      index: true,
    },
    classGrade: {
      type: String,
      trim: true,
      default: 'Class 10',
      index: true,
    },
    percentageOrScore: {
      type: String,
      required: [true, 'Percentage or score is required'],
      trim: true,
    },
    achievement: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Achievement cannot exceed 200 characters'],
    },
    stream: {
      type: String,
      trim: true,
      default: '',
    },
    rank: {
      type: Number,
      default: null,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
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

topperSchema.index({ academicYear: -1, examType: 1, displayOrder: 1 });

const Topper = mongoose.model('Topper', topperSchema);

module.exports = Topper;
