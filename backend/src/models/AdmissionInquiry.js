const mongoose = require('mongoose');

const admissionInquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [80, 'Student name cannot exceed 80 characters'],
    },
    parentName: {
      type: String,
      required: [true, 'Parent or guardian name is required'],
      trim: true,
      maxlength: [80, 'Parent name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s]{8,15}$/, 'Please enter a valid phone number'],
    },

    classSeeking: {
      type: String,
      trim: true,
      set: function (val) {
        if (val && !this.gradeApplying) this.gradeApplying = val;
        return val;
      },
    },
    gradeApplying: {
      type: String,
      trim: true,
      set: function (val) {
        if (val && !this.classSeeking) this.classSeeking = val;
        return val;
      },
    },
    academicYear: {
      type: String,
      trim: true,
      default: '2026-2027',
    },
    dateOfBirth: {
      type: Date,
      default: null,
      set: function (val) {
        if (val && !this.dob) this.dob = val;
        return val;
      },
    },
    dob: {
      type: Date,
      default: null,
      set: function (val) {
        if (val && !this.dateOfBirth) this.dateOfBirth = val;
        return val;
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'unspecified', 'Male', 'Female', 'Other', 'Unspecified'],
      default: 'unspecified',
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: [
          'New',
          'Contacted',
          'In Progress',
          'Completed',
          'Archived',
          'pending',
          'reviewed',
          'admitted',
          'rejected',
        ],
        message: '{VALUE} is not a valid inquiry status',
      },
      default: 'New',
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      default: '',
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
      set: function (val) {
        this.notes = val;
        return val;
      },
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      set: function (val) {
        this.adminNotes = val;
        return val;
      },
    },

  },
  {
    timestamps: true,
  }
);

// Pre-validate synchronization hooks for compatibility between classSeeking / gradeApplying, dateOfBirth / dob, and adminNotes / notes
admissionInquirySchema.pre('validate', function () {
  if (!this.classSeeking && this.gradeApplying) {
    this.classSeeking = this.gradeApplying;
  }
  if (!this.gradeApplying && this.classSeeking) {
    this.gradeApplying = this.classSeeking;
  }
  if (!this.classSeeking && !this.gradeApplying) {
    this.invalidate('classSeeking', 'Class / Grade seeking admission is required');
  }

  if (!this.dateOfBirth && this.dob) {
    this.dateOfBirth = this.dob;
  }
  if (!this.dob && this.dateOfBirth) {
    this.dob = this.dateOfBirth;
  }

  if (!this.notes && this.adminNotes) {
    this.notes = this.adminNotes;
  }
  if (!this.adminNotes && this.notes) {
    this.adminNotes = this.notes;
  }
});


admissionInquirySchema.index({ createdAt: -1 });
admissionInquirySchema.index({ status: 1, createdAt: -1 });
admissionInquirySchema.index({ email: 1 });
admissionInquirySchema.index({ phone: 1 });

const AdmissionInquiry = mongoose.model('AdmissionInquiry', admissionInquirySchema);

module.exports = AdmissionInquiry;

