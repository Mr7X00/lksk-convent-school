const mongoose = require('mongoose');

const academicContentSchema = new mongoose.Schema(
  {
    gradeLevel: {
      type: String,
      required: [true, 'Grade level or wing is required'],
      trim: true,
      maxlength: [80, 'Grade level cannot exceed 80 characters'],
    },
    stream: {
      type: String,
      trim: true,
      default: '',
    },
    curriculumOverview: {
      type: String,
      required: [true, 'Curriculum overview is required'],
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    syllabusPdfUrl: {
      type: String,
      trim: true,
      default: '',
    },
    academicYear: {
      type: String,
      trim: true,
      default: '2026-2027',
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

academicContentSchema.index({ isActive: 1, displayOrder: 1 });

const AcademicContent = mongoose.model('AcademicContent', academicContentSchema);

module.exports = AcademicContent;
