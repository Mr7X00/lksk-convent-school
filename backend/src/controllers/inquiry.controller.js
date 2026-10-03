const InquiryService = require('../services/inquiry.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * ==================== CONTACT INQUIRIES ====================
 */

/**
 * Submit Contact Inquiry (Public)
 * POST /api/contact
 */
const submitContactInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryService.createContactInquiry(req.body);
  return ApiResponse.success(
    res,
    'Thank you for contacting L.K.S.K Convent School. We have received your message and will get back to you as soon as possible.',
    { id: inquiry._id, createdAt: inquiry.createdAt },
    201
  );
});

/**
 * List Contact Inquiries (Admin)
 * GET /api/contact
 */
const getContactInquiries = asyncHandler(async (req, res) => {
  const result = await InquiryService.getContactInquiries(req.query);
  return ApiResponse.success(res, 'Contact inquiries retrieved successfully', result);
});

/**
 * Get Single Contact Inquiry (Admin)
 * GET /api/contact/:id
 */
const getContactInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await InquiryService.getContactInquiryById(req.params.id);
  return ApiResponse.success(res, 'Contact inquiry details retrieved', inquiry);
});

/**
 * Update Contact Inquiry Status & Notes (Admin)
 * PATCH /api/contact/:id
 */
const updateContactInquiryStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, notes } = req.body;
  const inquiry = await InquiryService.updateContactInquiryStatus(
    req.params.id,
    status,
    adminNotes !== undefined ? adminNotes : notes
  );
  return ApiResponse.success(res, 'Contact inquiry updated successfully', inquiry);
});

/**
 * Delete Contact Inquiry (Admin)
 * DELETE /api/contact/:id
 */
const deleteContactInquiry = asyncHandler(async (req, res) => {
  await InquiryService.deleteContactInquiry(req.params.id);
  return ApiResponse.success(res, 'Contact inquiry deleted successfully');
});

/**
 * Export Contact Inquiries to CSV (Admin)
 * GET /api/contact/export/csv
 */
const exportContactInquiriesCsv = asyncHandler(async (req, res) => {
  const csvContent = await InquiryService.exportContactInquiriesCsv(req.query);
  const filename = `contact_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

/**
 * ==================== ADMISSION INQUIRIES ====================
 */

/**
 * Submit Admission Inquiry (Public)
 * POST /api/admissions
 */
const submitAdmissionInquiry = asyncHandler(async (req, res) => {
  const inquiry = await InquiryService.createAdmissionInquiry(req.body);
  const grade = inquiry.classSeeking || inquiry.gradeApplying;
  return ApiResponse.success(
    res,
    'Admission inquiry submitted successfully. The school admissions office will contact you.',
    {
      id: inquiry._id,
      referenceId: inquiry._id,
      studentName: inquiry.studentName,
      gradeApplying: grade,
      classSeeking: grade,
    },
    201
  );
});

/**
 * List Admission Inquiries (Admin)
 * GET /api/admissions
 */
const getAdmissionInquiries = asyncHandler(async (req, res) => {
  const result = await InquiryService.getAdmissionInquiries(req.query);
  return ApiResponse.success(res, 'Admission inquiries retrieved successfully', result);
});

/**
 * Get Single Admission Inquiry (Admin)
 * GET /api/admissions/:id
 */
const getAdmissionInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await InquiryService.getAdmissionInquiryById(req.params.id);
  return ApiResponse.success(res, 'Admission inquiry details retrieved', inquiry);
});

/**
 * Update Admission Inquiry Status & Notes (Admin)
 * PATCH /api/admissions/:id
 */
const updateAdmissionInquiryStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, notes } = req.body;
  const inquiry = await InquiryService.updateAdmissionInquiryStatus(
    req.params.id,
    status,
    adminNotes !== undefined ? adminNotes : notes
  );
  return ApiResponse.success(res, 'Admission inquiry status updated successfully', inquiry);
});

/**
 * Delete Admission Inquiry (Admin)
 * DELETE /api/admissions/:id
 */
const deleteAdmissionInquiry = asyncHandler(async (req, res) => {
  await InquiryService.deleteAdmissionInquiry(req.params.id);
  return ApiResponse.success(res, 'Admission inquiry deleted successfully');
});

/**
 * Export Admission Inquiries to CSV (Admin)
 * GET /api/admissions/export/csv
 */
const exportAdmissionInquiriesCsv = asyncHandler(async (req, res) => {
  const csvContent = await InquiryService.exportAdmissionInquiriesCsv(req.query);
  const filename = `admission_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

module.exports = {
  submitContactInquiry,
  getContactInquiries,
  getContactInquiryById,
  updateContactInquiryStatus,
  deleteContactInquiry,
  exportContactInquiriesCsv,
  submitAdmissionInquiry,
  getAdmissionInquiries,
  getAdmissionInquiryById,
  updateAdmissionInquiryStatus,
  deleteAdmissionInquiry,
  exportAdmissionInquiriesCsv,
};
