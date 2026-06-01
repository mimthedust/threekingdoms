module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'GITHUB_CLIENT_ID not set' });

  const base = process.env.BACKOFFICE_URL || `https://${req.headers.host}`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${base}/api/auth/callback`,
    scope: 'read:user',
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
