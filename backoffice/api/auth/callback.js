const { createSession, setSessionCookie } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('<h2>OAuth 오류: code 파라미터가 없습니다.</h2>');

  // 코드 → 액세스 토큰 교환
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    return res.status(401).send(`<h2>OAuth 실패</h2><p>${tokenData.error_description}</p>`);
  }

  // GitHub 사용자 정보 조회
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'daily-sangukji-backoffice',
    },
  });

  const user = await userRes.json();

  if (user.login !== process.env.ADMIN_GITHUB_USER) {
    return res.status(403).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#111;color:#eee;">
        <h2>🚫 접근 거부</h2>
        <p><b>${user.login}</b> 계정은 관리자가 아닙니다.</p>
        <a href="/admin" style="color:#ffd700;">돌아가기</a>
      </body></html>
    `);
  }

  const token = createSession(user.login);
  setSessionCookie(res, token);
  res.redirect(302, '/admin');
};
