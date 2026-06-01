const { clearSessionCookie } = require('../../lib/auth');

module.exports = function handler(req, res) {
  clearSessionCookie(res);
  res.redirect(302, '/admin');
};
