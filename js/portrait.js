function generatePortrait(char) {
  const fc = {
    shu:  {bg1:'#0f2215', bg2:'#060e08', border:'#27ae60', accent:'#4ade80'},
    wei:  {bg1:'#101e30', bg2:'#080e18', border:'#3a7bd5', accent:'#70b0ff'},
    wu:   {bg1:'#280e0e', bg2:'#120606', border:'#c0392b', accent:'#ff7060'},
    other:{bg1:'#1e1808', bg2:'#0e0c04', border:'#9a8040', accent:'#c8a860'}
  }[char.faction] || {bg1:'#1a1408',bg2:'#0a0802',border:'#806040',accent:'#c0a060'};

  const faceColor = {normal:'#d4a574',red:'#9a3a3a',dark:'#9a7050',pale:'#ddc8a8'}[char.faceColor||'normal'];

  const headgears = {
    imperial:`<rect x="26" y="10" width="68" height="7" rx="3.5" fill="${fc.border}" opacity="0.8"/>
      <rect x="35" y="4" width="50" height="8" rx="4" fill="${fc.border}" opacity="0.65"/>
      <rect x="47" y="0" width="26" height="6" rx="3" fill="${fc.accent}" opacity="0.85"/>`,
    military:`<path d="M22,32 Q50,14 78,32 L74,40 Q50,22 26,40 Z" fill="${fc.border}" opacity="0.8"/>
      <rect x="16" y="32" width="68" height="7" rx="3" fill="${fc.border}" opacity="0.6"/>`,
    scholar:`<rect x="26" y="16" width="48" height="8" rx="4" fill="#1a140a" stroke="${fc.border}" stroke-width="1.2" opacity="0.9"/>
      <rect x="34" y="8" width="32" height="10" rx="5" fill="#120e06" stroke="${fc.border}" stroke-width="1" opacity="0.7"/>`,
    phoenix:`<path d="M38,6 Q50,-2 62,6 Q68,12 62,18 Q50,10 38,18 Q32,12 38,6 Z" fill="#d4af37" opacity="0.9"/>
      <ellipse cx="50" cy="2" rx="4" ry="5" fill="#e8c040"/>
      <rect x="22" y="20" width="56" height="8" rx="3" fill="${fc.border}" opacity="0.7"/>`
  };

  const eyeStyles = {
    kind:`<ellipse cx="38" cy="55" rx="7" ry="4.5" fill="#060300"/>
      <ellipse cx="62" cy="55" rx="7" ry="4.5" fill="#060300"/>
      <circle cx="40" cy="54" r="1.8" fill="white" opacity="0.4"/>
      <circle cx="64" cy="54" r="1.8" fill="white" opacity="0.4"/>
      <path d="M31,47 Q38,43 45,47" stroke="#2a1808" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M55,47 Q62,43 69,47" stroke="#2a1808" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    fierce:`<ellipse cx="38" cy="56" rx="8.5" ry="5.5" fill="#020100"/>
      <ellipse cx="62" cy="56" rx="8.5" ry="5.5" fill="#020100"/>
      <circle cx="41" cy="55" r="2" fill="white" opacity="0.3"/>
      <circle cx="65" cy="55" r="2" fill="white" opacity="0.3"/>
      <path d="M28,47 Q38,53 48,47" stroke="#1a0500" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M52,47 Q62,53 72,47" stroke="#1a0500" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    scheming:`<ellipse cx="38" cy="56" rx="7" ry="4" fill="#060300"/>
      <ellipse cx="62" cy="56" rx="7" ry="4" fill="#060300"/>
      <circle cx="40" cy="55" r="1.5" fill="white" opacity="0.4"/>
      <circle cx="64" cy="55" r="1.5" fill="white" opacity="0.4"/>
      <path d="M30,48 Q38,45 46,49" stroke="#2a180a" stroke-width="2" fill="none"/>
      <path d="M54,48 Q62,45 70,49" stroke="#2a180a" stroke-width="2" fill="none"/>`,
    wise:`<ellipse cx="38" cy="55" rx="6.5" ry="4" fill="#060300"/>
      <ellipse cx="62" cy="55" rx="6.5" ry="4" fill="#060300"/>
      <circle cx="40" cy="54" r="1.6" fill="white" opacity="0.5"/>
      <circle cx="64" cy="54" r="1.6" fill="white" opacity="0.5"/>
      <path d="M31,47 Q38,44 45,47" stroke="#2a1808" stroke-width="2.2" fill="none"/>
      <path d="M55,47 Q62,44 69,47" stroke="#2a1808" stroke-width="2.2" fill="none"/>`
  };

  const beards = {
    long:`<path d="M24,82 Q20,112 28,132 Q42,144 50,146 Q58,144 72,132 Q80,112 76,82 Q64,92 50,94 Q36,92 24,82 Z" fill="#0a0500" opacity="0.94"/>`,
    short:`<path d="M28,82 Q26,105 34,118 Q44,126 50,127 Q56,126 66,118 Q74,105 72,82 Q62,90 50,92 Q38,90 28,82 Z" fill="#120800" opacity="0.88"/>`,
    fierce:`<path d="M16,76 Q12,106 18,128 Q34,142 50,146 Q66,142 82,128 Q88,106 84,76 Q68,86 50,90 Q32,86 16,76 Z" fill="#060200" opacity="0.96"/>`,
    none:''
  };

  const mustaches = {
    long:`<path d="M34,73 Q44,68 50,73" stroke="#0a0500" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>
      <path d="M50,73 Q56,68 66,73" stroke="#0a0500" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>`,
    thin:`<path d="M38,73 Q50,69 62,73" stroke="#150900" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    none:''
  };

  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pg${char.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${fc.bg1}"/>
      <stop offset="100%" stop-color="${fc.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="150" rx="10" fill="url(#pg${char.id})"/>
  <rect x="0.7" y="0.7" width="98.6" height="148.6" rx="9.3" fill="none" stroke="${fc.border}" stroke-width="1.2" opacity="0.65"/>
  ${headgears[char.headgear] || headgears.military}
  <ellipse cx="50" cy="66" rx="24" ry="27" fill="${faceColor}"/>
  <ellipse cx="26" cy="66" rx="5" ry="8" fill="${faceColor}"/>
  <ellipse cx="74" cy="66" rx="5" ry="8" fill="${faceColor}"/>
  ${eyeStyles[char.eyeStyle] || eyeStyles.kind}
  <ellipse cx="50" cy="72" rx="3.5" ry="2.5" fill="${char.faceColor==='red'?'#6a1010':'#b08060'}"/>
  <path d="M42,80 Q50,85 58,80" stroke="${char.faceColor==='red'?'#5a0808':'#886060'}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  ${beards[char.beard] || ''}
  ${mustaches[char.mustache] || ''}
  <text x="50" y="146" text-anchor="middle" font-family="serif" font-size="11" fill="${fc.accent}" letter-spacing="3" opacity="0.88">${char.hanja}</text>
</svg>`;
}
