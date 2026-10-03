/**
 * Validation rules for authentication
 */
const validateLogin = (req) => {
  const { usernameOrEmail, password } = req.body || {};
  const errors = [];

  if (!usernameOrEmail || typeof usernameOrEmail !== 'string' || usernameOrEmail.trim().length === 0) {
    errors.push({ field: 'usernameOrEmail', message: 'Username or email is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

module.exports = {
  validateLogin,
};
