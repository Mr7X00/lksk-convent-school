const mongoose = require('mongoose');

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Album slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Campus Life',
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    coverImageUrl: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    eventDate: {
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

galleryAlbumSchema.index({ isActive: 1, displayOrder: 1, eventDate: -1 });

const GalleryAlbum = mongoose.model('GalleryAlbum', galleryAlbumSchema);

module.exports = GalleryAlbum;
