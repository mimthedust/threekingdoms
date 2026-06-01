const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const COOKIE = 'sangukji_admin';
const MAX_AGE = 7 * 24 * 60 * 60; // 7일 (초)

function createSession(githubUser) {
  return jwt.sign({ sub: githubUser, role: 'admin' }, SECRET, { expiresIn: '7d' });
}

function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function getTokenFromCookie(req) {
  const cookies = req.headers.cookie || '';
  const match = cookies.match(new RegExp(`${COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV !== 'development' ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    `${COOKIE}=${token}; HttpOnly${secure}; SameSite=Lax; Max-Age=${MAX_AGE}; Path=/`
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie',
    `${COOKIE}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`
  );
}

async function requireAdmin(req, res) {
  const token = getTokenFromCookie(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  const payload = verifySession(token);
  if (!payload || payload.sub !== process.env.ADMIN_GITHUB_USER) {
    res.status(403).json({ error: 'Not authorized' });
    return null;
  }
  return payload;
}

module.exports = { createSession, verifySession, getTokenFromCookie, setSessionCookie, clearSessionCookie, requireAdmin };
