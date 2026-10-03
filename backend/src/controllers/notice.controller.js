const NoticeService = require('../services/notice.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { clearCache } = require('../middlewares/cache');

/**
 * Get public notices
 * GET /api/notices
 */
const getNotices = asyncHandler(async (req, res) => {
  const result = await NoticeService.getNotices(req.query, false);
  return ApiResponse.success(res, 'Notices retrieved', result);
});

/**
 * Get all notices (Admin)
 * GET /api/notices/all
 */
const getAllNoticesAdmin = asyncHandler(async (req, res) => {
  const result = await NoticeService.getNotices(req.query, true);
  return ApiResponse.success(res, 'All notices retrieved for administration', result);
});

/**
 * Get single notice by ID
 * GET /api/notices/:id
 */
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await NoticeService.getNoticeById(req.params.id);
  return ApiResponse.success(res, 'Notice details retrieved', notice);
});

/**
 * Create notice (Admin)
 * POST /api/notices
 */
const createNotice = asyncHandler(async (req, res) => {
  const notice = await NoticeService.createNotice(req.body);
  clearCache('/api/notices');
  return ApiResponse.success(res, 'Notice published successfully', notice, 201);
});

/**
 * Update notice (Admin)
 * PUT /api/notices/:id
 */
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await NoticeService.updateNotice(req.params.id, req.body);
  clearCache('/api/notices');
  return ApiResponse.success(res, 'Notice updated successfully', notice);
});

/**
 * Delete notice (Admin)
 * DELETE /api/notices/:id
 */
const deleteNotice = asyncHandler(async (req, res) => {
  await NoticeService.deleteNotice(req.params.id);
  clearCache('/api/notices');
  return ApiResponse.success(res, 'Notice deleted successfully', null);
});

module.exports = {
  getNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
