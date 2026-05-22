function openBookshelf() {
  const seen = JSON.parse(localStorage.getItem('sangukji_seen') || '[]');
  const episodes = EPISODES
    .filter(ep => seen.includes(ep.id))
    .sort((a, b) => {
      const toYear = s => parseInt((s || '').replace(/[^0-9]/g, ''), 10) || 0;
      return toYear(a.year) - toYear(b.year);
    });

  const factionLabel = { shu: '촉', wei: '위', wu: '오', other: '기타' };

  const listHtml = episodes.length === 0
    ? '<div class="bs-empty">아직 읽은 에피소드가 없습니다.<br>오늘 에피소드를 열면 여기에 기록됩니다.</div>'
    : episodes.map(ep => `
      <div class="bs-item">
        <div class="bs-year">${ep.year}</div>
        <div class="bs-info">
          <span class="bs-title">${ep.title}<span class="bs-hanja">${ep.hanja}</span></span>
          <span class="bs-period">${ep.period}</span>
        </div>
        <span class="bs-faction chip-${ep.faction}">${factionLabel[ep.faction] || '기타'}</span>
      </div>`).join('');

  document.getElementById('bookshelfList').innerHTML = listHtml;
  document.getElementById('bookshelfCount').textContent = `지금까지 읽은 에피소드 ${episodes.length}편 · 연대순 정렬`;
  document.getElementById('bookshelfModal').classList.add('open');
}

function closeBookshelf() {
  document.getElementById('bookshelfModal').classList.remove('open');
}

function handleBookshelfClick(e) {
  if (e.target === document.getElementById('bookshelfModal')) closeBookshelf();
}
