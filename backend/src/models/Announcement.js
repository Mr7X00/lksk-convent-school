const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['urgent', 'general', 'academic'],
        message: '{VALUE} is not a valid announcement type',
      },
      default: 'general',
      index: true,
    },
    linkUrl: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    endDate: {
      type: Date,
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ isActive: 1, displayOrder: 1, startDate: -1 });

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
