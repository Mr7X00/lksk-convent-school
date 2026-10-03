const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryAlbum',
      required: [true, 'Album reference is required'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Caption cannot exceed 300 characters'],
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

galleryImageSchema.index({ albumId: 1, isActive: 1, displayOrder: 1 });

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;
