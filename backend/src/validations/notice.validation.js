/**
 * Validation rules for notices
 */
const validateNotice = (req) => {
  const { title, content, category } = req.body || {};
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title is required and must be at least 3 characters' });
  }

  if (!content || typeof content !== 'string' || content.trim().length < 5) {
    errors.push({ field: 'content', message: 'Notice content is required' });
  }

  const validCategories = ['general', 'examination', 'holiday', 'sports', 'admission'];
  if (category && !validCategories.includes(category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${validCategories.join(', ')}`,
    });
  }

  return errors;
};

module.exports = {
  validateNotice,
};
