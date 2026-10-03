const mongoose = require('mongoose');

const campusPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campus page title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Page content is required'],
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    features: {
      type: [String],
      default: [],
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

campusPageSchema.index({ isActive: 1, displayOrder: 1 });

const CampusPage = mongoose.model('CampusPage', campusPageSchema);

module.exports = CampusPage;
