const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      default: 'L.K.S.K Convent School',
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    affiliationNumber: {
      type: String,
      trim: true,
      default: 'TODO — to be provided',
    },
    schoolCode: {
      type: String,
      trim: true,
      default: 'TODO — to be provided',
    },
    establishedYear: {
      type: Number,
      default: 2017,
    },
    contactDetails: {
      phone: { type: String, trim: true, default: 'TODO — to be provided' },
      alternatePhone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, lowercase: true, default: 'lkskconventschool@gmail.com' },
      address: {
        type: String,
        trim: true,
        default: 'Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188',
      },
      pinCode: { type: String, trim: true, default: '224188' },
      googleMapsUrl: { type: String, trim: true, default: '' },
      googleMapsEmbedUrl: { type: String, trim: true, default: '' },
      latitude: { type: Number, default: 26.7818 },
      longitude: { type: Number, default: 82.0289 },
    },
    whatsApp: {
      number: { type: String, trim: true, default: '8127746334' },
      defaultMessage: {
        type: String,
        trim: true,
        default: 'Hello, welcome to L.K.S.K Convent School. Thank you for contacting us. How may we help you with admissions, academics, school information, or any other query?',
      },
    },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
    },
    admissionPopup: {
      enabled: { type: Boolean, default: true },
      title: { type: String, trim: true, default: 'Admission Open — 2026–27' },
      subtitle: {
        type: String,
        trim: true,
        default: 'Registrations are open for Nursery to Class XII. Secure your child\'s academic journey with excellence at L.K.S.K Convent School.',
      },
      session: { type: String, trim: true, default: '2026–27' },
      imageUrl: { type: String, trim: true, default: '' },
      ctaText: { type: String, trim: true, default: 'Apply for Admission' },
      ctaUrl: { type: String, trim: true, default: '/academic/admission-inquiry' },
      secondaryCtaText: { type: String, trim: true, default: 'Admission Process' },
      secondaryCtaUrl: { type: String, trim: true, default: '/academic/admission-process' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      displayFrequency: {
        type: String,
        enum: ['always', 'once_per_session', 'once_per_day', 'once_per_week'],
        default: 'once_per_day',
      },
      priority: { type: Number, default: 1 },
      position: {
        type: String,
        enum: ['modal', 'banner', 'bottom-right'],
        default: 'modal',
      },
      allowMinimize: { type: Boolean, default: true },
    },
    logoUrl: {
      type: String,
      trim: true,
      default: '/assets/branding/new logo transparent.png',
    },
    faviconUrl: {
      type: String,
      trim: true,
      default: '/assets/branding/svg logo.svg',
    },
    metaTitle: {
      type: String,
      trim: true,
      default: 'L.K.S.K Convent School | Panditpur, Sohawal, Ayodhya',
    },
    metaDescription: {
      type: String,
      trim: true,
      default: 'Official portal of L.K.S.K Convent School, Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188.',
    },
    siteUrl: {
      type: String,
      trim: true,
      default: process.env.PUBLIC_SITE_URL || '',
    },
    defaultSocialImage: {
      type: String,
      trim: true,
      default: '/assets/branding/new logo transparent.png',
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);

module.exports = WebsiteSettings;

