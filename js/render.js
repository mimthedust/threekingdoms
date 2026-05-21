function getDayIndex(len) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  return day % len;
}

function renderCharacter(char) {
  const chipClass = 'chip-' + (char.faction === 'other' ? 'other' : char.faction);
  const achItems = char.achievements.map(a => `<div class="char-ach-item">${a}</div>`).join('');
  const quoteHtml = char.quote ? `
    <div class="char-quote">
      <div class="char-quote-cn">${char.quote}</div>
      <div class="char-quote-ko">${char.quoteKo}</div>
    </div>` : '';

  document.getElementById('charContent').innerHTML = `
    <div class="char-portrait-area">${generatePortrait(char)}</div>
    <div class="char-name-area">
      <span class="char-ko">${char.name}</span><span class="char-hanja">${char.hanja}</span>
      <div class="char-subtitle">${char.subtitle}</div>
      <div class="char-dates">${char.born} ~ ${char.died}</div>
      <span class="faction-chip ${chipClass}">${char.factionName}</span>
    </div>
    <div class="char-divider"></div>
    <div class="char-bio">${char.bio}</div>
    <div class="char-ach-title">◈ 주요 활약상</div>
    <div class="char-ach-list">${achItems}</div>
    ${quoteHtml}
  `;
}

function verdictTag(v) {
  const map = {
    '허구': '<span class="sec-tag tag-fiction">연의 창작</span>',
    '사실': '<span class="sec-tag tag-fact">정사 일치</span>',
    '부분사실': '<span class="sec-tag tag-partial">부분 사실</span>'
  };
  return map[v] || '';
}

function renderEpisode(ep) {
  const sourceHtml = ep.history.source ? `
    <div class="source-box">
      <div class="source-box-title">▶ 정사 출전(出典)</div>
      <div class="source-ref">📖 ${ep.history.source}</div>
      ${ep.history.sourceNote ? `<div class="source-note">※ ${ep.history.sourceNote}</div>` : ''}
    </div>` : '';

  document.getElementById('epContent').innerHTML = `
    <div class="ep-header">
      <div class="ep-label">오늘의 에피소드 — 삼국지연의</div>
      <div class="ep-title">${ep.title}<span class="ep-title-hanja">${ep.hanja}</span></div>
      <div class="ep-meta">
        <span class="ep-year">⏱ ${ep.year}</span>
        <div class="ep-sep"></div>
        <span class="ep-year">${ep.period}</span>
        <button class="map-btn" onclick="openMap(${ep.id})">🗺 지도로 보기</button>
      </div>
    </div>
    <div class="ep-body">
      <div class="sec-label">
        <span class="sec-tag tag-romance">연의(演義)</span>
        <span class="sec-name">삼국지연의의 이야기</span>
      </div>
      <div class="ep-text">${ep.romance}</div>

      <div class="ep-divider"></div>

      <div class="sec-label">
        <span class="sec-tag tag-history">정사(正史)</span>
        <span class="sec-name">삼국지 정사와의 비교</span>
      </div>
      <div class="verdict-row">
        <span class="verdict-label">사실 여부:</span>
        ${verdictTag(ep.history.verdict)}
      </div>
      <div class="ep-text">${ep.history.content}</div>
      ${sourceHtml}
    </div>
  `;
}

function renderIdiom(idiom) {
  const hanjaGrid = idiom.chars.filter(c => c.char && c.char !== '·' && c.char !== '').map(c => `
    <div class="hanja-cell">
      <span class="hj-char">${c.char}</span>
      <span class="hj-read">${c.reading}</span>
      <span class="hj-mean">${c.meaning}</span>
    </div>`).join('');

  document.getElementById('idiomContent').innerHTML = `
    <div class="idiom-hanja-area">
      <div class="idiom-hanja-big">${idiom.hanja.replace('·','')}</div>
      <div class="idiom-ko">${idiom.term}</div>
      <div class="idiom-brief">${idiom.meaning}</div>
    </div>
    <div class="hanja-grid">${hanjaGrid}</div>
    <div class="idiom-sec">
      <div class="idiom-sec-title">◈ 유래 이야기</div>
      <div class="idiom-sec-body">${idiom.origin}</div>
    </div>
    <div class="idiom-use-box">
      <div class="idiom-use-label">▶ 현대적 용례</div>
      <div class="idiom-use-text">${idiom.modernUse}</div>
    </div>
  `;
}

function renderDate() {
  const now = new Date();
  const days = ['일','월','화','수','목','금','토'];
  document.getElementById('headerDate').textContent =
    `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 (${days[now.getDay()]}요일)`;
}
