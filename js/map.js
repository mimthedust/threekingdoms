const LOCATION_COORDS = {
  '탁현(涿縣)':[556,108], '낙양(洛陽)':[450,218], '허창(許昌)':[505,255],
  '업(鄴)':[568,162], '장안(長安)':[218,208], '성도(成都)':[128,400],
  '한중(漢中)':[230,282], '건업(建業)':[698,328], '형주(荊州)':[435,390],
  '양양(襄陽)':[435,348], '관도(官渡)':[468,232], '적벽(赤壁)':[490,388],
  '장판파(長坂坡)':[448,358], '오장원':[248,242], '이릉':[365,402],
  '가정':[205,262], '맥성':[462,368]
};

function renderTerritories(eraKey) {
  const era = MAP_ERAS[eraKey] || MAP_ERAS.three_kingdoms;
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.getElementById('territories');
  g.innerHTML = '';

  era.territories.forEach(t => {
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', t.points);
    poly.setAttribute('fill', t.fill);
    poly.setAttribute('stroke', t.stroke);
    poly.setAttribute('stroke-width', t.sw || 1.5);
    g.appendChild(poly);

    if (t.ls > 0 && t.lx > 0) {
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', t.lx); txt.setAttribute('y', t.ly);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-family', 'serif');
      txt.setAttribute('font-size', t.ls);
      txt.setAttribute('fill', t.lc);
      txt.setAttribute('opacity', t.lo);
      txt.setAttribute('font-weight', 'bold');
      txt.textContent = t.hanja;
      g.appendChild(txt);
    }
  });

  if (era.stateLabels) {
    era.stateLabels.forEach(sl => {
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', sl.x); txt.setAttribute('y', sl.y);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-family', 'serif');
      txt.setAttribute('font-size', 13);
      txt.setAttribute('fill', '#c8a830');
      txt.setAttribute('opacity', '0.42');
      txt.textContent = sl.t;
      g.appendChild(txt);
    });
  }

  // 범례 업데이트
  const legend = document.getElementById('mapLegend');
  const fixed = `
    <div class="leg-item"><span style="color:#ff6040;font-size:1rem">★</span> 주요 전투지</div>
    <div class="leg-item"><span style="color:#f0cf6a;font-size:1rem">◎</span> 오늘의 에피소드 무대</div>
    <div class="leg-item"><span style="color:#5588cc;font-size:0.85rem">━━</span> 황하(黃河)</div>
    <div class="leg-item"><span style="color:#4488bb;font-size:0.85rem">━━</span> 장강(長江)</div>`;
  const dynItems = (era.legendItems || []).map(li =>
    `<div class="leg-item"><div class="leg-dot" style="background:${li.color};border:1px solid ${li.border}"></div>${li.label}</div>`
  ).join('');
  legend.innerHTML = dynItems + fixed;
}

let currentEpId = null;

function openMap(epId) {
  currentEpId = epId;
  const ep = EPISODES.find(e => e.id === epId);
  if (!ep) return;

  const eraKey = ep.mapEra || 'three_kingdoms';
  const era = MAP_ERAS[eraKey] || MAP_ERAS.three_kingdoms;

  document.getElementById('mapTitle').textContent = era.title;
  document.getElementById('mapEraDesc').textContent = era.desc;
  document.getElementById('mapEpNote').textContent =
    `📍 오늘의 에피소드 「${ep.title}」 무대: ${ep.mapLocations.join(', ')} | ${ep.mapNote}`;

  renderTerritories(eraKey);

  const hl = document.getElementById('mapHighlights');
  hl.innerHTML = '';
  ep.mapLocations.forEach(loc => {
    const coords = LOCATION_COORDS[loc];
    if (coords) {
      const [x, y] = coords;
      hl.innerHTML += `
        <circle class="map-highlight" cx="${x}" cy="${y}" r="12" fill="none" stroke="#f0cf6a" stroke-width="2.5" opacity="0.85"/>
        <circle cx="${x}" cy="${y}" r="4.5" fill="#f0cf6a" opacity="0.95"/>`;
    }
  });

  document.getElementById('mapModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMap() {
  document.getElementById('mapModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalClick(e) {
  if (e.target === document.getElementById('mapModal')) closeMap();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMap(); });
