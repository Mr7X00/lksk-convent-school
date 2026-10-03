const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: {
        values: ['general', 'examination', 'holiday', 'sports', 'admission'],
        message: '{VALUE} is not a valid notice category',
      },
      default: 'general',
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
      default: '',
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
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

noticeSchema.index({ isActive: 1, isPinned: -1, publishDate: -1 });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
