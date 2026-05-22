document.addEventListener('DOMContentLoaded', () => {
  renderDate();
  const ci = getDayIndex(CHARACTERS.length);
  const ei = getDayIndex(EPISODES.length);
  const ii = getDayIndex(IDIOMS.length);
  renderCharacter(CHARACTERS[ci]);
  renderEpisode(EPISODES[ei]);
  renderIdiom(IDIOMS[ii]);

  const seen = JSON.parse(localStorage.getItem('sangukji_seen') || '[]');
  const todayId = EPISODES[ei].id;
  if (!seen.includes(todayId)) {
    seen.push(todayId);
    localStorage.setItem('sangukji_seen', JSON.stringify(seen));
  }
});
