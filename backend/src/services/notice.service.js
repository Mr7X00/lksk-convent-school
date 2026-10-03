const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const { isDatabaseConnected } = require('../config/db');
const { memoryStore } = require('./devMemoryStore');
const ApiError = require('../utils/apiError');
const { escapeRegex } = require('../utils/security');

class NoticeService {
  /**
   * Get notices (supports public active list or admin full list)
   */
  static async getNotices(query = {}, isAdmin = false) {
    const { category, page = 1, limit = 20, search } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    if (!isDatabaseConnected()) {
      let filtered = memoryStore.data.notices.filter((n) => (isAdmin ? true : n.isActive));
      if (category && typeof category === 'string') {
        filtered = filtered.filter((n) => n.category.toLowerCase() === category.trim().toLowerCase());
      }
      if (search && typeof search === 'string') {
        const s = search.toLowerCase();
        filtered = filtered.filter((n) => n.title.toLowerCase().includes(s) || (n.content && n.content.toLowerCase().includes(s)));
      }
      const total = filtered.length;
      const skip = (pageNum - 1) * limitNum;
      const notices = filtered.slice(skip, skip + limitNum);
      return {
        notices,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    }

    const filter = {};
    if (!isAdmin) {
      filter.isActive = true;
      filter.$or = [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ];
    }

    if (category && typeof category === 'string') {
      filter.category = category.trim();
    }

    if (search && typeof search === 'string') {
      const escaped = escapeRegex(search, 80);
      if (escaped) {
        const searchConditions = [
          { title: { $regex: escaped, $options: 'i' } },
          { content: { $regex: escaped, $options: 'i' } },
        ];
        if (filter.$or) {
          filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
          delete filter.$or;
        } else {
          filter.$or = searchConditions;
        }
      }
    }

    const skip = (pageNum - 1) * limitNum;
    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .sort({ isPinned: -1, publishDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Notice.countDocuments(filter),
    ]);

    return {
      notices,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  static async getNoticeById(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findById('notices', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid notice identifier format');
    const notice = await Notice.findById(id);
    if (!notice) throw ApiError.notFound('Notice not found');
    return notice;
  }

  static async createNotice(data) {
    if (!isDatabaseConnected()) {
      return memoryStore.create('notices', data);
    }
    return await Notice.create(data);
  }

  static async updateNotice(id, data) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndUpdate('notices', id, data);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid notice identifier format');
    const notice = await Notice.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!notice) throw ApiError.notFound('Notice not found');
    return notice;
  }

  static async deleteNotice(id) {
    if (!isDatabaseConnected()) {
      return memoryStore.findByIdAndDelete('notices', id);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid notice identifier format');
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) throw ApiError.notFound('Notice not found');
    return notice;
  }
}

module.exports = NoticeService;
