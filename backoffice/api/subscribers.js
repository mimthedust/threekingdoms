const { getAllSubscribers, removeSubscriber, addSubscriber } = require('../lib/db');
const { requireAdmin } = require('../lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    const subscribers = await getAllSubscribers();
    // 각 구독자가 몇 명을 초대했는지 집계
    const referralCount = {};
    subscribers.forEach(s => {
      if (s.referredBy) referralCount[s.referredBy] = (referralCount[s.referredBy] || 0) + 1;
    });
    const withStats = subscribers.map(s => ({
      ...s,
      referralCount: referralCount[s.email] || 0,
    }));
    return res.status(200).json({ subscribers: withStats, total: subscribers.length });
  }

  if (req.method === 'POST') {
    const { email } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '유효한 이메일을 입력하세요.' });
    }
    const result = await addSubscriber(email);
    if (!result.ok) return res.status(409).json({ error: '이미 등록된 이메일입니다.' });
    return res.status(200).json({ ok: true, data: result.data });
  }

  if (req.method === 'DELETE') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const result = await removeSubscriber(email);
    if (!result.ok) return res.status(404).json({ error: '구독자를 찾을 수 없습니다.' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
