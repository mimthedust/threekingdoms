function generatePortrait(char) {
  const id = char.id;

  // === FACTION PALETTE (bright flat colors like the reference) ===
  const fpal = {
    shu:   { bg:'#5a9a68', dark:'#1e4030', mid:'#2e5840', trim:'#7ad050', border:'#4a8a50' },
    wei:   { bg:'#4878b8', dark:'#182858', mid:'#243870', trim:'#60b0e8', border:'#3060a0' },
    wu:    { bg:'#c84838', dark:'#3e0e18', mid:'#561a28', trim:'#e87058', border:'#a03028' },
    other: { bg:'#9a7830', dark:'#3c1a08', mid:'#4e2810', trim:'#c8a040', border:'#7a6020' }
  }[char.faction] || { bg:'#807060', dark:'#302020', mid:'#402828', trim:'#b09060', border:'#605040' };

  // Headgear type overrides the background color (imperial = warm, scholar = cool blue)
  const bgOverride = {
    imperial: { shu:'#d07828', wei:'#2858b0', wu:'#208060', other:'#c07820' },
    scholar:  { shu:'#3888a8', wei:'#3060a8', wu:'#287878', other:'#386888' },
    phoenix:  { shu:'#c05878', wei:'#8050a0', wu:'#b83858', other:'#a86050' }
  };
  const bg = (bgOverride[char.headgear] || {})[char.faction] || fpal.bg;

  // === FACE COLORS ===
  const faceMap = {
    normal: { skin:'#e8d2a8', shadow:'#c8a878', lip:'#c07858' },
    red:    { skin:'#c07858', shadow:'#a05030', lip:'#882020' },
    dark:   { skin:'#a87840', shadow:'#886030', lip:'#785030' },
    pale:   { skin:'#f2e4ca', shadow:'#d8c098', lip:'#c09070' }
  };
  const fc = faceMap[char.faceColor || 'normal'];
  const hair = '#120808';

  // === HEADGEAR ===
  const headgearSVG = {
    imperial: `
      <rect x="34" y="0" width="32" height="9" rx="4" fill="#e8c030"/>
      <rect x="20" y="8" width="60" height="6" rx="2" fill="${fpal.trim}"/>
      <rect x="16" y="13" width="68" height="5" rx="2" fill="#c89820" opacity="0.9"/>
      <rect x="16" y="17" width="68" height="4" rx="1" fill="${fpal.dark}"/>`,
    military: `
      <rect x="38" y="0" width="24" height="20" rx="5" fill="#b86818"/>
      <rect x="40" y="1" width="4" height="18" rx="2" fill="#e89030" opacity="0.55"/>
      <rect x="46" y="1" width="4" height="18" rx="2" fill="#e89030" opacity="0.42"/>
      <rect x="52" y="1" width="4" height="18" rx="2" fill="#e89030" opacity="0.42"/>
      <rect x="58" y="1" width="3" height="18" rx="1.5" fill="#e89030" opacity="0.55"/>
      <rect x="22" y="18" width="56" height="6" rx="2" fill="#d4af37"/>
      <rect x="18" y="23" width="64" height="3" rx="1" fill="${fpal.dark}"/>`,
    scholar: `
      <rect x="39" y="1" width="22" height="16" rx="4" fill="#0c0604"/>
      <rect x="8"  y="14" width="84" height="9" rx="4" fill="#080402"/>
      <rect x="12" y="21" width="76" height="3" rx="1" fill="${fpal.trim}" opacity="0.22"/>`,
    phoenix: `
      <ellipse cx="50" cy="9" rx="22" ry="9" fill="${fpal.trim}"/>
      <rect x="28" y="1" width="44" height="7" rx="3" fill="#e8c030"/>
      <circle cx="50" cy="0" r="4.5" fill="#f4d040"/>
      <circle cx="33" cy="5" r="3" fill="${fpal.trim}"/>
      <circle cx="67" cy="5" r="3" fill="${fpal.trim}"/>
      <rect x="10" y="15" width="80" height="6" rx="3" fill="${fpal.mid}" opacity="0.9"/>
      <line x1="25" y1="3" x2="75" y2="3" stroke="#c8a020" stroke-width="1.5" opacity="0.8"/>`
  }[char.headgear] || `
    <rect x="22" y="16" width="56" height="6" rx="2" fill="${fpal.trim}" opacity="0.7"/>
    <rect x="18" y="21" width="64" height="3" rx="1" fill="${fpal.dark}"/>`;

  // === HAIR (under headgear) ===
  const hairSVG = (char.headgear === 'scholar' || char.headgear === 'imperial')
    ? `<path d="M24,25 Q26,20 28,18 Q26,23 24,30 Z" fill="${hair}" opacity="0.6"/>
       <path d="M76,25 Q74,20 72,18 Q74,23 76,30 Z" fill="${hair}" opacity="0.6"/>`
    : `<path d="M25,23 Q38,15 50,12 Q62,15 75,23 Q70,19 64,16 Q58,12 50,11 Q42,12 36,16 Q30,19 25,23 Z" fill="${hair}"/>`;

  // === EYES & BROWS ===
  const b = '#0a0604';
  const eyesSVG = {
    fierce: `
      <polygon points="27,41 46,37 46,43 29,47" fill="${b}"/>
      <polygon points="54,37 73,41 71,47 54,43" fill="${b}"/>
      <polygon points="28,51 44,47 44,58 28,58" fill="#080402"/>
      <polygon points="56,47 72,51 72,58 56,58" fill="#080402"/>
      <circle cx="38"  cy="53" r="2.2" fill="white" opacity="0.22"/>
      <circle cx="64"  cy="53" r="2.2" fill="white" opacity="0.22"/>`,
    kind: `
      <rect x="29" y="39" width="18" height="5" rx="2.5" fill="${b}"/>
      <rect x="53" y="39" width="18" height="5" rx="2.5" fill="${b}"/>
      <ellipse cx="38" cy="51" rx="8"   ry="5.5" fill="#080402"/>
      <ellipse cx="62" cy="51" rx="8"   ry="5.5" fill="#080402"/>
      <circle cx="41"  cy="49" r="2.2" fill="white" opacity="0.35"/>
      <circle cx="65"  cy="49" r="2.2" fill="white" opacity="0.35"/>`,
    scheming: `
      <rect x="29" y="41" width="16" height="3.5" rx="1.5" fill="${b}" opacity="0.85"/>
      <rect x="55" y="41" width="16" height="3.5" rx="1.5" fill="${b}" opacity="0.85"/>
      <rect x="29" y="49" width="16" height="6"   rx="1.5" fill="#080402"/>
      <rect x="55" y="49" width="16" height="6"   rx="1.5" fill="#080402"/>
      <circle cx="37"  cy="52" r="1.8" fill="white" opacity="0.30"/>
      <circle cx="63"  cy="52" r="1.8" fill="white" opacity="0.30"/>`,
    wise: `
      <path d="M29,41 Q38,36 47,41" stroke="${b}" stroke-width="4"   fill="none" stroke-linecap="round"/>
      <path d="M53,41 Q62,36 71,41" stroke="${b}" stroke-width="4"   fill="none" stroke-linecap="round"/>
      <ellipse cx="38" cy="52" rx="9"   ry="6.5" fill="#080402"/>
      <ellipse cx="62" cy="52" rx="9"   ry="6.5" fill="#080402"/>
      <circle cx="41"  cy="49" r="3"   fill="white" opacity="0.38"/>
      <circle cx="65"  cy="49" r="3"   fill="white" opacity="0.38"/>`
  }[char.eyeStyle] || `
    <rect x="29" y="39" width="18" height="5" rx="2.5" fill="${b}"/>
    <rect x="53" y="39" width="18" height="5" rx="2.5" fill="${b}"/>
    <ellipse cx="38" cy="51" rx="8" ry="5.5" fill="#080402"/>
    <ellipse cx="62" cy="51" rx="8" ry="5.5" fill="#080402"/>
    <circle cx="41" cy="49" r="2.2" fill="white" opacity="0.32"/>
    <circle cx="65" cy="49" r="2.2" fill="white" opacity="0.32"/>`;

  // === BEARD ===
  const beardSVG = {
    long:   `<path d="M26,79 Q22,104 28,122 Q40,132 50,133 Q60,132 72,122 Q78,104 74,79 Q62,89 50,91 Q38,89 26,79 Z" fill="${hair}"/>`,
    short:  `<path d="M30,79 Q28,98 34,110 Q42,118 50,119 Q58,118 66,110 Q72,98 70,79 Q61,87 50,89 Q39,87 30,79 Z" fill="${hair}"/>`,
    fierce: `<path d="M20,69 Q14,100 20,122 Q36,136 50,138 Q64,136 80,122 Q86,100 80,69 Q64,83 50,87 Q36,83 20,69 Z" fill="${hair}"/>`,
    none:   ''
  }[char.beard] || '';

  // === MUSTACHE ===
  const mustacheSVG = {
    long: `<path d="M29,71 Q41,65 50,71" stroke="${hair}" stroke-width="5" fill="none" stroke-linecap="round"/>
           <path d="M50,71 Q59,65 71,71" stroke="${hair}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    thin: `<path d="M36,71 Q50,67 64,71" stroke="#2a1008" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    none: ''
  }[char.mustache] || '';

  // Mouth hidden if beard covers it
  const mouthSVG = (!char.beard || char.beard === 'none')
    ? `<path d="M40,74 Q50,80 60,74" stroke="${fc.lip}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    : '';

  return `<svg viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="cp${id}"><rect width="100" height="125" rx="10"/></clipPath>
  </defs>
  <g clip-path="url(#cp${id})">

    <!-- Background -->
    <rect width="100" height="125" fill="${bg}"/>

    <!-- Body / clothing -->
    <polygon points="0,93 100,93 100,125 0,125" fill="${fpal.dark}"/>
    <polygon points="6,97 94,97 100,125 0,125" fill="${fpal.mid}"/>
    <!-- Collar V -->
    <polygon points="42,88 58,88 65,115 50,123 35,115" fill="${fpal.mid}"/>
    <polygon points="50,92 58,88 63,113 50,119" fill="${fpal.dark}" opacity="0.6"/>
    <line x1="0" y1="93" x2="100" y2="93" stroke="${fpal.trim}" stroke-width="1.5" opacity="0.3"/>

    <!-- Neck -->
    <rect x="43" y="80" width="14" height="16" fill="${fc.skin}"/>

    <!-- Head -->
    <path d="M24,84 Q20,57 24,23 Q36,14 50,12 Q64,14 76,23 Q80,57 76,84 Q64,93 50,94 Q36,93 24,84 Z" fill="${fc.skin}"/>

    <!-- Ears -->
    <rect x="14" y="50" width="11" height="22" rx="5.5" fill="${fc.skin}"/>
    <rect x="75" y="50" width="11" height="22" rx="5.5" fill="${fc.skin}"/>
    <rect x="16" y="53" width="6"  height="16" rx="3"   fill="${fc.shadow}" opacity="0.35"/>
    <rect x="78" y="53" width="6"  height="16" rx="3"   fill="${fc.shadow}" opacity="0.35"/>

    <!-- Hair top -->
    ${hairSVG}

    <!-- Eyes & brows -->
    ${eyesSVG}

    <!-- Nose -->
    <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="${fc.shadow}" opacity="0.48"/>

    <!-- Beard -->
    ${beardSVG}

    <!-- Mustache -->
    ${mustacheSVG}

    <!-- Mouth -->
    ${mouthSVG}

    <!-- Headgear (top layer) -->
    ${headgearSVG}

  </g>
  <!-- Frame -->
  <rect x="0.8" y="0.8" width="98.4" height="123.4" rx="9.2" fill="none" stroke="${fpal.trim}" stroke-width="1.3" opacity="0.5"/>
</svg>`;
}
