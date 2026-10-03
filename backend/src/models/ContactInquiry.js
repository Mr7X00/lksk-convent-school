const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
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
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Read', 'Replied', 'Resolved', 'Archived', 'unread', 'read', 'replied'],
        message: '{VALUE} is not a valid contact status',
      },
      default: 'New',
      index: true,
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

contactInquirySchema.pre('validate', function () {
  if (!this.notes && this.adminNotes) {
    this.notes = this.adminNotes;
  }
  if (!this.adminNotes && this.notes) {
    this.adminNotes = this.notes;
  }
});


contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ status: 1, createdAt: -1 });
contactInquirySchema.index({ email: 1 });
contactInquirySchema.index({ phone: 1 });

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);

module.exports = ContactInquiry;

