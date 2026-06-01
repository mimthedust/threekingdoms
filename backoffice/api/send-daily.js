const { getAllSubscribers } = require('../lib/db');
const { sendDailyEmail } = require('../lib/email');
const { loadData, getDayIndex } = require('../lib/data');
const { getTokenFromCookie, verifySession } = require('../lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // Vercel Cron 또는 관리자 세션으로만 접근 가능
  const cronSecret = process.env.CRON_SECRET;
  const isCron = cronSecret && req.headers['authorization'] === `Bearer ${cronSecret}`;

  if (!isCron) {
    const token = getTokenFromCookie(req);
    const payload = token ? verifySession(token) : null;
    if (!payload || payload.sub !== process.env.ADMIN_GITHUB_USER) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const { EPISODES, CHARACTERS, IDIOMS } = await loadData();

    const episode = EPISODES[getDayIndex(EPISODES)];
    const character = CHARACTERS[getDayIndex(CHARACTERS)];
    const idiom = IDIOMS[getDayIndex(IDIOMS)];

    const subscribers = await getAllSubscribers();
    if (subscribers.length === 0) {
      return res.status(200).json({ ok: true, sent: 0, message: '구독자가 없습니다.' });
    }

    const results = await Promise.allSettled(
      subscribers.map(sub => sendDailyEmail({
        email: sub.email,
        episode,
        character,
        idiom,
        unsubToken: sub.unsubToken,
        inviteCode: sub.inviteCode,
      }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason?.message);

    return res.status(200).json({ ok: true, sent, failed, total: subscribers.length, errors });
  } catch (err) {
    console.error('[send-daily]', err);
    return res.status(500).json({ error: err.message });
  }
};
