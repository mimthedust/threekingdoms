document.addEventListener('DOMContentLoaded', () => {
  renderDate();
  const ci = getDayIndex(CHARACTERS.length);
  const ei = getDayIndex(EPISODES.length);
  const ii = getDayIndex(IDIOMS.length);
  renderCharacter(CHARACTERS[ci]);
  renderEpisode(EPISODES[ei]);
  renderIdiom(IDIOMS[ii]);
});
