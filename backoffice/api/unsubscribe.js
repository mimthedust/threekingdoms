const { unsubscribeByToken } = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const result = await unsubscribeByToken(token);
  if (!result.ok) {
    return res.status(404).json({ ok: false, error: '유효하지 않은 링크입니다. 이미 취소되었거나 만료되었을 수 있습니다.' });
  }

  return res.status(200).json({ ok: true, message: '구독이 취소되었습니다.' });
};
