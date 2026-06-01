const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FACTION_COLOR = { shu: '#4CAF50', wei: '#5B9BD5', wu: '#E57373', other: '#FFC107' };
const FACTION_NAME = { shu: '촉한(蜀漢)', wei: '위(魏)', wu: '오(吳)', other: '기타' };
const VERDICT_ICON = { '사실': '✅', '허구': '❌', '부분사실': '⚠️' };

function truncate(text, max) {
  if (!text) return '';
  const s = String(text).replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function buildHtml({ episode, character, idiom, unsubUrl, inviteUrl }) {
  const ec = FACTION_COLOR[episode.faction] || '#FFC107';
  const cc = FACTION_COLOR[character.faction] || '#FFC107';

  const charCells = (idiom.chars || []).map(c =>
    `<td style="text-align:center;padding:8px 14px;background:#1e0e00;border:1px solid #3d2200;border-radius:4px;min-width:44px;">` +
    `<div style="font-size:22px;color:#ffd700;font-weight:bold;">${c.char}</div>` +
    `<div style="font-size:12px;color:#c8a96a;margin-top:2px;">${c.reading}</div>` +
    `<div style="font-size:11px;color:#8b6914;">${c.meaning}</div></td>`
  ).join('<td style="width:6px;"></td>');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>데일리 삼국지</title>
</head>
<body style="margin:0;padding:16px;background:#050200;font-family:Georgia,'Noto Serif KR',serif;color:#e8d5b7;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#0f0800;border:1px solid #8b6914;border-radius:8px;overflow:hidden;">

  <!-- 헤더 -->
  <tr><td style="background:linear-gradient(135deg,#2d1200,#1a0800);padding:28px 24px;text-align:center;border-bottom:2px solid #8b6914;">
    <div style="font-size:10px;letter-spacing:5px;color:#8b6914;text-transform:uppercase;margin-bottom:6px;">Daily Sangukji</div>
    <div style="font-size:26px;color:#ffd700;letter-spacing:2px;font-weight:bold;">📜 데일리 삼국지</div>
    <div style="font-size:13px;color:#c8a96a;margin-top:8px;">${episode.year || ''} · ${episode.period || ''}</div>
  </td></tr>

  <!-- 에피소드 -->
  <tr><td style="padding:24px;border-bottom:1px solid #2d1a00;">
    <div style="margin-bottom:12px;"><span style="background:${ec}1a;border:1px solid ${ec};border-radius:4px;padding:3px 10px;font-size:11px;color:${ec};">⚔️ 오늘의 에피소드</span></div>
    <div style="font-size:21px;color:#ffd700;font-weight:bold;margin-bottom:4px;">${episode.title}</div>
    <div style="font-size:13px;color:#8b6914;margin-bottom:14px;">${episode.hanja || ''}</div>
    <div style="font-size:14px;line-height:1.9;color:#d4b896;margin-bottom:16px;">${truncate(episode.romance, 420)}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e0e00;border-left:3px solid ${ec};border-radius:0 4px 4px 0;"><tr><td style="padding:12px 16px;">
      <div style="font-size:11px;color:#8b6914;margin-bottom:4px;">역사 검증 (정사)</div>
      <div style="font-size:13px;color:#e8d5b7;">${VERDICT_ICON[episode.history && episode.history.verdict] || ''} ${(episode.history && episode.history.verdict) || ''}</div>
      <div style="font-size:13px;color:#c8a96a;margin-top:6px;line-height:1.7;">${truncate(episode.history && episode.history.content, 260)}</div>
    </td></tr></table>
  </td></tr>

  <!-- 인물 -->
  <tr><td style="padding:24px;border-bottom:1px solid #2d1a00;">
    <div style="margin-bottom:12px;"><span style="background:${cc}1a;border:1px solid ${cc};border-radius:4px;padding:3px 10px;font-size:11px;color:${cc};">👤 오늘의 인물</span></div>
    <div style="font-size:21px;color:#ffd700;font-weight:bold;margin-bottom:2px;">${character.name} <span style="font-size:15px;color:#8b6914;font-weight:normal;">${character.hanja || ''}</span></div>
    <div style="font-size:12px;color:#c8a96a;margin-bottom:6px;">${character.subtitle || ''} · ${FACTION_NAME[character.faction] || ''}</div>
    <div style="font-size:12px;color:#8b6914;margin-bottom:14px;">${character.born || ''} ~ ${character.died || ''}</div>
    <div style="font-size:14px;line-height:1.9;color:#d4b896;">${truncate(character.bio, 360)}</div>
    ${character.quoteKo ? `<div style="margin-top:14px;padding:10px 16px;border-left:2px solid #8b6914;font-style:italic;color:#c8a96a;font-size:13px;">"${character.quoteKo}"</div>` : ''}
  </td></tr>

  <!-- 고사성어 -->
  <tr><td style="padding:24px;border-bottom:1px solid #2d1a00;">
    <div style="margin-bottom:14px;"><span style="background:#8b69141a;border:1px solid #8b6914;border-radius:4px;padding:3px 10px;font-size:11px;color:#c8a96a;">📚 오늘의 고사성어</span></div>
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:32px;color:#ffd700;letter-spacing:10px;font-weight:bold;">${idiom.term}</div>
      <div style="font-size:13px;color:#8b6914;letter-spacing:5px;margin-top:4px;">${idiom.hanja || ''}</div>
    </div>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;"><tr>${charCells}</tr></table>
    <div style="text-align:center;font-size:16px;color:#e8d5b7;font-weight:bold;margin-bottom:14px;">${idiom.meaning || ''}</div>
    <div style="font-size:13px;line-height:1.9;color:#d4b896;">${truncate(idiom.origin, 360)}</div>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:24px;text-align:center;border-bottom:1px solid #2d1a00;">
    <a href="https://mimthedust.github.io/threekingdoms" style="display:inline-block;background:linear-gradient(135deg,#7a1515,#5c0f0f);color:#ffd700;text-decoration:none;padding:13px 36px;border-radius:4px;font-size:14px;letter-spacing:1px;border:1px solid #8b6914;">🏯 전체 내용 보러 가기</a>
  </td></tr>

  <!-- 초대 -->
  <tr><td style="padding:16px 24px;text-align:center;border-bottom:1px solid #2d1a00;background:#080300;">
    <div style="font-size:13px;color:#c8a96a;margin-bottom:6px;">🎎 친구에게 데일리 삼국지를 추천해보세요</div>
    <div style="font-size:12px;color:#5c4a2e;">나만의 초대 링크 → <a href="${inviteUrl}" style="color:#8b6914;">${inviteUrl}</a></div>
  </td></tr>

  <!-- 푸터 -->
  <tr><td style="padding:14px 24px;text-align:center;">
    <div style="font-size:11px;color:#3d2c1a;">더 이상 받고 싶지 않으시면 <a href="${unsubUrl}" style="color:#5c4a2e;text-decoration:underline;">구독 취소</a>하세요.</div>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

async function sendDailyEmail({ email, episode, character, idiom, unsubToken, inviteCode }) {
  const base = process.env.BACKOFFICE_URL || 'http://localhost:3000';
  const html = buildHtml({
    episode, character, idiom,
    unsubUrl: `${base}/unsubscribe?token=${unsubToken}`,
    inviteUrl: `${base}/invite?ref=${inviteCode}`,
  });

  return resend.emails.send({
    from: process.env.FROM_EMAIL || '데일리 삼국지 <onboarding@resend.dev>',
    to: email,
    subject: `📜 데일리 삼국지 — ${episode.year || ''} ${episode.title}`,
    html,
  });
}

module.exports = { sendDailyEmail, buildHtml };
