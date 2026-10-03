const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'mandatory_disclosure',
          'cbse_affiliation',
          'fee_structure',
          'academic_calendar',
          'transfer_certificate',
          'other',
        ],
        message: '{VALUE} is not a valid document category',
      },
      default: 'mandatory_disclosure',
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required'],
      trim: true,
    },
    fileSize: {
      type: String,
      trim: true,
      default: '',
    },
    fileFormat: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'PDF',
    },
    publishDate: {
      type: Date,
      default: Date.now,
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

documentSchema.index({ isActive: 1, category: 1, displayOrder: 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
