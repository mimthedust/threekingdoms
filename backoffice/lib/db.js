const { kv } = require('@vercel/kv');
const crypto = require('crypto');

function genCode(len = 8) {
  return crypto.randomBytes(len).toString('base64url').slice(0, len);
}

function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function addSubscriber(email, referredBy = null) {
  const key = email.toLowerCase().trim();
  const exists = await kv.sismember('subscribers', key);
  if (exists) return { ok: false, reason: 'already_subscribed' };

  const inviteCode = genCode(8);
  const unsubToken = genToken();
  const data = {
    email: key,
    subscribedAt: new Date().toISOString(),
    inviteCode,
    unsubToken,
    referredBy: referredBy || null,
  };

  await Promise.all([
    kv.sadd('subscribers', key),
    kv.set(`sub:${key}`, JSON.stringify(data)),
    kv.set(`invite:${inviteCode}`, key),
    kv.set(`unsub:${unsubToken}`, key),
  ]);

  return { ok: true, data };
}

async function removeSubscriber(email) {
  const key = email.toLowerCase().trim();
  const raw = await kv.get(`sub:${key}`);
  if (!raw) return { ok: false };

  const data = JSON.parse(raw);
  await Promise.all([
    kv.srem('subscribers', key),
    kv.del(`sub:${key}`),
    kv.del(`invite:${data.inviteCode}`),
    kv.del(`unsub:${data.unsubToken}`),
  ]);
  return { ok: true };
}

async function getSubscriber(email) {
  const raw = await kv.get(`sub:${email.toLowerCase().trim()}`);
  return raw ? JSON.parse(raw) : null;
}

async function getAllSubscribers() {
  const emails = await kv.smembers('subscribers');
  if (!emails || emails.length === 0) return [];
  const all = await Promise.all(emails.map(e => getSubscriber(e)));
  return all
    .filter(Boolean)
    .sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt));
}

async function unsubscribeByToken(token) {
  const email = await kv.get(`unsub:${token}`);
  if (!email) return { ok: false };
  return removeSubscriber(email);
}

async function getEmailByInviteCode(code) {
  return kv.get(`invite:${code}`);
}

module.exports = { addSubscriber, removeSubscriber, getSubscriber, getAllSubscribers, unsubscribeByToken, getEmailByInviteCode };
