const mongoose = require('mongoose');
const ContactInquiry = require('../models/ContactInquiry');
const AdmissionInquiry = require('../models/AdmissionInquiry');
const EmailService = require('./emailService');
const { isDatabaseConnected } = require('../config/db');
const { memoryStore } = require('./devMemoryStore');
const ApiError = require('../utils/apiError');
const { escapeRegex, escapeCsvCell } = require('../utils/security');
const AuditService = require('./audit.service');

// Allowed sort fields for inquiries
const ALLOWED_SORT_FIELDS = [
  'createdAt',
  '-createdAt',
  'name',
  '-name',
  'studentName',
  '-studentName',
  'status',
  '-status',
];

function sanitizeSort(sortParam) {
  if (typeof sortParam === 'string' && ALLOWED_SORT_FIELDS.includes(sortParam.trim())) {
    return sortParam.trim();
  }
  return '-createdAt';
}

class InquiryService {
  // ==================== CONTACT INQUIRIES ====================

  /**
   * Submit Contact Inquiry (Public)
   * Hardened against Mass Assignment: strictly extracts only allowed public fields.
   */
  static async createContactInquiry(data) {
    // Mass Assignment Protection: Pick strictly allowed fields
    const safePayload = {
      name: typeof data.name === 'string' ? data.name.trim().slice(0, 80) : '',
      email: typeof data.email === 'string' ? data.email.trim().toLowerCase().slice(0, 120) : '',
      phone: typeof data.phone === 'string' ? data.phone.trim().slice(0, 18) : '',
      subject: typeof data.subject === 'string' ? data.subject.trim().slice(0, 150) : '',
      message: typeof data.message === 'string' ? data.message.trim().slice(0, 2000) : '',
      status: 'New', // Forced default, cannot be overridden by public submission
      adminNotes: '',
      notes: '',
    };

    if (!isDatabaseConnected()) {
      return memoryStore.create('contactInquiries', safePayload);
    }

    const inquiry = await ContactInquiry.create(safePayload);

    // Asynchronously dispatch email notification without blocking API response
    EmailService.sendContactNotification(inquiry).catch((err) => {
      console.warn(`[InquiryService] Async email failure: ${err.message}`);
    });

    return inquiry;
  }

  static async getContactInquiries(query = {}) {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    if (!isDatabaseConnected()) {
      let filtered = [...memoryStore.data.contactInquiries];
      if (status && typeof status === 'string') {
        filtered = filtered.filter((i) => i.status.toLowerCase() === status.trim().toLowerCase());
      }
      if (search && typeof search === 'string') {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (i) => (i.name && i.name.toLowerCase().includes(s)) || (i.email && i.email.toLowerCase().includes(s)) || (i.phone && i.phone.includes(s))
        );
      }
      const total = filtered.length;
      const skip = (pageNum - 1) * limitNum;
      const inquiries = filtered.slice(skip, skip + limitNum);
      return {
        inquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    }

    const filter = {};

    // NoSQL Injection Defense: ensure status is a plain string
    if (status && typeof status === 'string') {
      filter.status = status.trim();
    }

    // Regex ReDoS Defense: use escapeRegex with length limit
    if (search && typeof search === 'string') {
      const escaped = escapeRegex(search, 80);
      if (escaped) {
        filter.$or = [
          { name: { $regex: escaped, $options: 'i' } },
          { email: { $regex: escaped, $options: 'i' } },
          { phone: { $regex: escaped, $options: 'i' } },
          { subject: { $regex: escaped, $options: 'i' } },
        ];
      }
    }

    const { startDate, endDate } = query;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate && typeof startDate === 'string') {
        const parsedStart = new Date(startDate);
        if (!isNaN(parsedStart.getTime())) filter.createdAt.$gte = parsedStart;
      }
      if (endDate && typeof endDate === 'string') {
        const parsedEnd = new Date(endDate);
        if (!isNaN(parsedEnd.getTime())) {
          parsedEnd.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = parsedEnd;
        }
      }
      if (Object.keys(filter.createdAt).length === 0) {
        delete filter.createdAt;
      }
    }

    const skip = (pageNum - 1) * limitNum;
    const safeSort = sanitizeSort(sort);

    const [inquiries, total] = await Promise.all([
      ContactInquiry.find(filter).sort(safeSort).skip(skip).limit(limitNum),
      ContactInquiry.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  static async getContactInquiryById(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findById('contactInquiries', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await ContactInquiry.findById(id);
    if (!inquiry) throw ApiError.notFound('Contact inquiry not found');
    return inquiry;
  }

  static async updateContactInquiryStatus(id, status, adminNotes) {
    if (!isDatabaseConnected()) {
      const cleanNotes = typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 3000) : '';
      const updateData = {};
      if (status) updateData.status = status;
      if (adminNotes !== undefined) {
        updateData.adminNotes = cleanNotes;
        updateData.notes = cleanNotes;
      }
      return memoryStore.findByIdAndUpdate('contactInquiries', id, updateData);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await ContactInquiry.findById(id);
    if (!inquiry) throw ApiError.notFound('Contact inquiry not found');

    if (status && typeof status === 'string') inquiry.status = status.trim();
    if (adminNotes !== undefined) {
      const cleanNotes = typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 3000) : '';
      inquiry.adminNotes = cleanNotes;
      inquiry.notes = cleanNotes;
    }
    await inquiry.save();

    AuditService.recordEvent({
      action: 'INQUIRY_STATUS_CHANGED',
      targetModel: 'ContactInquiry',
      targetId: inquiry._id,
      details: { newStatus: inquiry.status, hasNotes: Boolean(inquiry.adminNotes) },
    });

    return inquiry;
  }

  static async deleteContactInquiry(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('contactInquiries', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await ContactInquiry.findByIdAndDelete(id);
    if (!inquiry) throw ApiError.notFound('Contact inquiry not found');
    return inquiry;
  }

  static async exportContactInquiriesCsv(query = {}) {
    if (!isDatabaseConnected()) {
      const inquiries = memoryStore.data.contactInquiries;
      const headers = ['Inquiry ID', 'Sender Name', 'Email Address', 'Contact Phone', 'Subject', 'Status', 'Message', 'Admin Notes', 'Received Date'];
      const rows = inquiries.map((item) => [
        escapeCsvCell(item._id),
        escapeCsvCell(item.name),
        escapeCsvCell(item.email),
        escapeCsvCell(item.phone || ''),
        escapeCsvCell(item.subject),
        escapeCsvCell(item.status),
        escapeCsvCell(item.message),
        escapeCsvCell(item.adminNotes || item.notes || ''),
        escapeCsvCell(new Date(item.createdAt).toISOString()),
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    const filter = {};
    if (query.status && typeof query.status === 'string') filter.status = query.status.trim();

    const inquiries = await ContactInquiry.find(filter).sort({ createdAt: -1 }).limit(1000);

    const headers = [
      'Inquiry ID',
      'Sender Name',
      'Email Address',
      'Contact Phone',
      'Subject',
      'Status',
      'Message',
      'Admin Notes',
      'Received Date',
    ];

    const rows = inquiries.map((item) => [
      escapeCsvCell(item._id),
      escapeCsvCell(item.name),
      escapeCsvCell(item.email),
      escapeCsvCell(item.phone || ''),
      escapeCsvCell(item.subject),
      escapeCsvCell(item.status),
      escapeCsvCell(item.message),
      escapeCsvCell(item.adminNotes || item.notes || ''),
      escapeCsvCell(new Date(item.createdAt).toISOString()),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }

  // ==================== ADMISSION INQUIRIES ====================

  /**
   * Submit Admission Inquiry (Public)
   * Hardened against Mass Assignment: strictly extracts only allowed public fields.
   */
  static async createAdmissionInquiry(data) {
    const classVal = (data.classSeeking || data.gradeApplying || '').toString().trim().slice(0, 60);
    const dobVal = data.dateOfBirth || data.dob;

    // Mass Assignment Protection: Pick strictly allowed student & parent fields
    const safePayload = {
      studentName: typeof data.studentName === 'string' ? data.studentName.trim().slice(0, 80) : '',
      parentName: typeof data.parentName === 'string' ? data.parentName.trim().slice(0, 80) : '',
      email: typeof data.email === 'string' ? data.email.trim().toLowerCase().slice(0, 120) : '',
      phone: typeof data.phone === 'string' ? data.phone.trim().slice(0, 18) : '',
      classSeeking: classVal,
      gradeApplying: classVal,
      academicYear: typeof data.academicYear === 'string' ? data.academicYear.trim().slice(0, 20) : '2026-2027',
      gender: typeof data.gender === 'string' ? data.gender.trim().toLowerCase().slice(0, 20) : 'unspecified',
      address: typeof data.address === 'string' ? data.address.trim().slice(0, 500) : '',
      message: typeof data.message === 'string' ? data.message.trim().slice(0, 2000) : '',
      status: 'New', // Forced default, cannot be manipulated by applicant
      adminNotes: '',
      notes: '',
    };

    if (dobVal) {
      const parsedDate = new Date(dobVal);
      if (!isNaN(parsedDate.getTime())) {
        safePayload.dateOfBirth = parsedDate;
        safePayload.dob = parsedDate;
      }
    }

    if (!isDatabaseConnected()) {
      return memoryStore.create('admissionInquiries', safePayload);
    }

    const inquiry = await AdmissionInquiry.create(safePayload);

    // Asynchronously dispatch notification email without blocking client
    EmailService.sendAdmissionNotification(inquiry).catch((err) => {
      console.warn(`[InquiryService] Async email failure: ${err.message}`);
    });

    return inquiry;
  }

  static async getAdmissionInquiries(query = {}) {
    const {
      status,
      academicYear,
      gradeApplying,
      classSeeking,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt',
    } = query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    if (!isDatabaseConnected()) {
      let filtered = [...memoryStore.data.admissionInquiries];
      if (status && typeof status === 'string') {
        filtered = filtered.filter((i) => i.status.toLowerCase() === status.trim().toLowerCase());
      }
      if (academicYear && typeof academicYear === 'string') {
        filtered = filtered.filter((i) => i.academicYear.toLowerCase().includes(academicYear.trim().toLowerCase()));
      }
      if (search && typeof search === 'string') {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (i) => (i.studentName && i.studentName.toLowerCase().includes(s)) || (i.parentName && i.parentName.toLowerCase().includes(s)) || (i.phone && i.phone.includes(s))
        );
      }
      const total = filtered.length;
      const skip = (pageNum - 1) * limitNum;
      const inquiries = filtered.slice(skip, skip + limitNum);
      return {
        inquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    }

    const filter = {};
    if (status && typeof status === 'string') filter.status = status.trim();
    if (academicYear && typeof academicYear === 'string') filter.academicYear = academicYear.trim();
    if (classSeeking || gradeApplying) {
      const cls = typeof (classSeeking || gradeApplying) === 'string' ? (classSeeking || gradeApplying).trim() : '';
      if (cls) {
        filter.$or = [{ classSeeking: cls }, { gradeApplying: cls }];
      }
    }

    if (search && typeof search === 'string') {
      const escaped = escapeRegex(search, 80);
      if (escaped) {
        const searchConditions = [
          { studentName: { $regex: escaped, $options: 'i' } },
          { parentName: { $regex: escaped, $options: 'i' } },
          { email: { $regex: escaped, $options: 'i' } },
          { phone: { $regex: escaped, $options: 'i' } },
        ];
        if (filter.$or) {
          filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
          delete filter.$or;
        } else {
          filter.$or = searchConditions;
        }
      }
    }

    const { startDate, endDate } = query;
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate && typeof startDate === 'string') {
        const parsedStart = new Date(startDate);
        if (!isNaN(parsedStart.getTime())) dateFilter.$gte = parsedStart;
      }
      if (endDate && typeof endDate === 'string') {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          dateFilter.$lte = end;
        }
      }
      if (Object.keys(dateFilter).length > 0) {
        if (filter.$and) {
          filter.$and.push({ createdAt: dateFilter });
        } else {
          filter.createdAt = dateFilter;
        }
      }
    }

    const skip = (pageNum - 1) * limitNum;
    const safeSort = sanitizeSort(sort);

    const [inquiries, total] = await Promise.all([
      AdmissionInquiry.find(filter).sort(safeSort).skip(skip).limit(limitNum),
      AdmissionInquiry.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  static async getAdmissionInquiryById(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findById('admissionInquiries', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await AdmissionInquiry.findById(id);
    if (!inquiry) throw ApiError.notFound('Admission inquiry not found');
    return inquiry;
  }

  static async updateAdmissionInquiryStatus(id, status, adminNotes) {
    if (!isDatabaseConnected()) {
      const cleanNotes = typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 3000) : '';
      const updateData = {};
      if (status) updateData.status = status;
      if (adminNotes !== undefined) {
        updateData.adminNotes = cleanNotes;
        updateData.notes = cleanNotes;
      }
      return memoryStore.findByIdAndUpdate('admissionInquiries', id, updateData);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await AdmissionInquiry.findById(id);
    if (!inquiry) throw ApiError.notFound('Admission inquiry not found');

    if (status && typeof status === 'string') inquiry.status = status.trim();
    if (adminNotes !== undefined) {
      const cleanNotes = typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 3000) : '';
      inquiry.adminNotes = cleanNotes;
      inquiry.notes = cleanNotes;
    }
    await inquiry.save();

    AuditService.recordEvent({
      action: 'INQUIRY_STATUS_CHANGED',
      targetModel: 'AdmissionInquiry',
      targetId: inquiry._id,
      details: { newStatus: inquiry.status, studentName: inquiry.studentName },
    });

    return inquiry;
  }

  static async deleteAdmissionInquiry(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('admissionInquiries', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid inquiry ID format');

    const inquiry = await AdmissionInquiry.findByIdAndDelete(id);
    if (!inquiry) throw ApiError.notFound('Admission inquiry not found');
    return inquiry;
  }

  static async exportAdmissionInquiriesCsv(query = {}) {
    if (!isDatabaseConnected()) {
      const inquiries = memoryStore.data.admissionInquiries;
      const headers = [
        'Inquiry Reference ID', 'Student Name', 'Class Seeking', 'Parent / Guardian Name',
        'Contact Phone', 'Email Address', 'Residential Address', 'Date of Birth', 'Gender',
        'Academic Session', 'Status', 'Parent Notes', 'Administrative Notes', 'Submission Timestamp',
      ];
      const rows = inquiries.map((item) => [
        escapeCsvCell(item._id),
        escapeCsvCell(item.studentName),
        escapeCsvCell(item.classSeeking || item.gradeApplying || ''),
        escapeCsvCell(item.parentName),
        escapeCsvCell(item.phone),
        escapeCsvCell(item.email),
        escapeCsvCell(item.address || ''),
        escapeCsvCell(item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('en-IN') : ''),
        escapeCsvCell(item.gender || ''),
        escapeCsvCell(item.academicYear || '2026-27'),
        escapeCsvCell(item.status),
        escapeCsvCell(item.message || ''),
        escapeCsvCell(item.adminNotes || item.notes || ''),
        escapeCsvCell(new Date(item.createdAt).toISOString()),
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    }

    const filter = {};
    if (query.status && typeof query.status === 'string') filter.status = query.status.trim();
    if (query.classSeeking || query.gradeApplying) {
      const cls = typeof (query.classSeeking || query.gradeApplying) === 'string'
        ? (query.classSeeking || query.gradeApplying).trim()
        : '';
      if (cls) {
        filter.$or = [{ classSeeking: cls }, { gradeApplying: cls }];
      }
    }

    const inquiries = await AdmissionInquiry.find(filter).sort({ createdAt: -1 }).limit(1000);

    const headers = [
      'Inquiry Reference ID',
      'Student Name',
      'Class Seeking',
      'Parent / Guardian Name',
      'Contact Phone',
      'Email Address',
      'Residential Address',
      'Date of Birth',
      'Gender',
      'Academic Session',
      'Status',
      'Parent Notes',
      'Administrative Notes',
      'Submission Timestamp',
    ];

    const rows = inquiries.map((item) => [
      escapeCsvCell(item._id),
      escapeCsvCell(item.studentName),
      escapeCsvCell(item.classSeeking || item.gradeApplying || ''),
      escapeCsvCell(item.parentName),
      escapeCsvCell(item.phone),
      escapeCsvCell(item.email),
      escapeCsvCell(item.address || ''),
      escapeCsvCell(item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('en-IN') : ''),
      escapeCsvCell(item.gender || ''),
      escapeCsvCell(item.academicYear || '2026-27'),
      escapeCsvCell(item.status),
      escapeCsvCell(item.message || ''),
      escapeCsvCell(item.adminNotes || item.notes || ''),
      escapeCsvCell(new Date(item.createdAt).toISOString()),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}

module.exports = InquiryService;
