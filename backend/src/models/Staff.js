const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Staff member name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [80, 'Designation cannot exceed 80 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Academics',
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Staff category is required'],
      enum: {
        values: [
          'PGT',
          'TGT',
          'Other Teaching Staff',
          'Administrative Staff',
          'Support Staff',
        ],
        message: '{VALUE} is not a valid staff category',
      },
      default: 'Other Teaching Staff',
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      default: '',
      maxlength: [80, 'Subject cannot exceed 80 characters'],
    },
    qualification: {
      type: String,
      trim: true,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
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

staffSchema.index({ isActive: 1, department: 1, displayOrder: 1 });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
