const { addSubscriber, getEmailByInviteCode } = require('../lib/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, ref } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: '유효한 이메일 주소를 입력해주세요.' });
  }

  let referredBy = null;
  if (ref) {
    referredBy = await getEmailByInviteCode(ref);
  }

  const result = await addSubscriber(email, referredBy);
  if (!result.ok) {
    return res.status(409).json({ error: '이미 구독 중인 이메일입니다.' });
  }

  return res.status(200).json({
    ok: true,
    message: '구독해주셔서 감사합니다! 내일부터 매일 아침 삼국지 이야기를 보내드립니다.',
    inviteCode: result.data.inviteCode,
  });
};
