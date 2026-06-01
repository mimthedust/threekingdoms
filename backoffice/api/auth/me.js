const { getTokenFromCookie, verifySession } = require('../../lib/auth');

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const token = getTokenFromCookie(req);
  if (!token) return res.status(200).json({ authenticated: false });

  const payload = verifySession(token);
  if (!payload || payload.sub !== process.env.ADMIN_GITHUB_USER) {
    return res.status(200).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true, user: payload.sub });
};
