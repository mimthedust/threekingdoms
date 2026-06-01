const vm = require('vm');

const RAW = 'https://raw.githubusercontent.com/mimthedust/threekingdoms/main/data';
let cache = null;
let cacheAt = 0;
const TTL = 3600 * 1000; // 1시간 캐시

async function loadData() {
  if (cache && Date.now() - cacheAt < TTL) return cache;

  const [episodesText, charactersText, idiomsText] = await Promise.all([
    fetch(`${RAW}/episodes.js`).then(r => r.text()),
    fetch(`${RAW}/characters.js`).then(r => r.text()),
    fetch(`${RAW}/idioms.js`).then(r => r.text()),
  ]);

  const sandbox = {};
  vm.runInNewContext(`${episodesText}\n${charactersText}\n${idiomsText}`, sandbox);

  cache = {
    EPISODES: sandbox.EPISODES,
    CHARACTERS: sandbox.CHARACTERS,
    IDIOMS: sandbox.IDIOMS,
  };
  cacheAt = Date.now();
  return cache;
}

function getDayIndex(arr) {
  const start = new Date('2024-01-01');
  const diff = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  return diff % arr.length;
}

module.exports = { loadData, getDayIndex };
