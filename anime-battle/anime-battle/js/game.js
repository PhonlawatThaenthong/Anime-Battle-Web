// ── IMAGE + TRAILER CACHE ────────────────────────────────────────
const imgCache     = {};
const trailerCache = {}; // title -> youtube_id or null
const FALLBACK = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect fill="%23111"/><text x="50%25" y="50%25" fill="%23444" font-size="48" text-anchor="middle" dominant-baseline="middle">?</text></svg>';

let YT_API_KEY = localStorage.getItem('yt_api_key') || '';

// ── FETCH IMAGE (Jikan) ──────────────────────────────────────────
async function fetchAnimeData(anime) {
  if (imgCache[anime.title]) return;
  try {
    const res   = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime.title)}&limit=1`);
    const data  = await res.json();
    const entry = data?.data?.[0];
    imgCache[anime.title] = entry?.images?.jpg?.large_image_url || FALLBACK;
  } catch {
    imgCache[anime.title] = FALLBACK;
  }
}

async function fetchImage(anime) {
  await fetchAnimeData(anime);
  return imgCache[anime.title];
}

async function prefetchImages(list) {
  for (const anime of list) {
    if (!imgCache[anime.title]) {
      await fetchAnimeData(anime);
      await new Promise(r => setTimeout(r, 350));
    }
  }
}

// ── FETCH TRAILER (YouTube Data API v3) ─────────────────────────
async function fetchYouTubeTrailer(anime) {
  if (anime.title in trailerCache) return trailerCache[anime.title];
  if (!YT_API_KEY) { trailerCache[anime.title] = null; return null; }
  try {
    const q   = encodeURIComponent(`${anime.title} anime official trailer`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=1&key=${YT_API_KEY}`;
    const res = await fetch(url);
    if (res.status === 403 || res.status === 400) {
      const err = await res.json();
      console.warn('YouTube API error:', err?.error?.message);
      trailerCache[anime.title] = null;
      return null;
    }
    const data = await res.json();
    const id   = data?.items?.[0]?.id?.videoId || null;
    trailerCache[anime.title] = id;
    return id;
  } catch {
    trailerCache[anime.title] = null;
    return null;
  }
}

// ── HELPERS ─────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── TRAILER ─────────────────────────────────────────────────────
const hoverTimers = {};

function clearTrailer(side) {
  clearTimeout(hoverTimers[side]);
  const wrap    = document.getElementById(`${side}-trailer`);
  const badge   = document.getElementById(`${side}-trailer-badge`);
  const noMsg   = document.getElementById(`${side}-no-trailer`);
  const spinner = document.getElementById(`${side}-trailer-loading`);
  wrap.innerHTML = '';
  wrap.classList.remove('ready');
  badge.classList.remove('visible');
  noMsg.classList.remove('visible');
  spinner.classList.remove('fetching');
}

function loadTrailer(side, anime) {
  const wrap    = document.getElementById(`${side}-trailer`);
  const badge   = document.getElementById(`${side}-trailer-badge`);
  const noMsg   = document.getElementById(`${side}-no-trailer`);
  const spinner = document.getElementById(`${side}-trailer-loading`);

  if (wrap.dataset.anime === anime.title && wrap.classList.contains('ready')) return;

  wrap.innerHTML = '';
  wrap.classList.remove('ready');
  badge.classList.remove('visible');
  noMsg.classList.remove('visible');

  if (!YT_API_KEY) {
    noMsg.textContent = 'ใส่ YouTube API Key ก่อน';
    noMsg.classList.add('visible');
    return;
  }

  const cached = trailerCache[anime.title];

  if (cached === undefined) {
    spinner.classList.add('fetching');
    fetchYouTubeTrailer(anime).then(id => {
      spinner.classList.remove('fetching');
      loadTrailer(side, anime);
    });
    return;
  }

  spinner.classList.remove('fetching');

  if (!cached) {
    noMsg.textContent = 'NO TRAILER';
    noMsg.classList.add('visible');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${cached}?autoplay=1&mute=0&controls=1&loop=1&playlist=${cached}&modestbranding=1&rel=0&enablejsapi=1`;
  iframe.allow = 'autoplay; encrypted-media';
  iframe.setAttribute('allowfullscreen', '');
  setIframeVolume(iframe, trailerVolume);
  wrap.appendChild(iframe);
  wrap.dataset.anime = anime.title;
  wrap.classList.add('ready');
  badge.classList.add('visible');
}

function setupHover(side) {
  const panel = document.getElementById(side);
  panel.addEventListener('mouseenter', () => {
    const anime = side === 'left' ? leftAnime : rightAnime;
    // small delay so quick passes don't load
    hoverTimers[side] = setTimeout(() => loadTrailer(side, anime), 600);
  });
  panel.addEventListener('mouseleave', () => {
    clearTrailer(side);
  });
}

function buildPool() {
  // Pick a random subset of size=poolSize from ANIME, then filter rejected
  return shuffle(activePool.filter(a => !rejected.has(a)));
}

function nextAnime(exclude1, exclude2) {
  const available = activePool.filter(a => !rejected.has(a) && a !== exclude1 && a !== exclude2);
  if (available.length === 0) return null;
  return shuffle(available)[0];
}

// ── WINNER ───────────────────────────────────────────────────────
function showWinner(anime) {
  recordWin(anime);
  recordChampion(anime);
  document.getElementById('winner-img').src           = imgCache[anime.title] || FALLBACK;
  document.getElementById('winner-title').textContent = anime.title;
  document.getElementById('winner-jp').textContent    = anime.jp;
  document.getElementById('winner-genre').textContent = anime.genre;
  document.getElementById('winner-round').textContent = `ผ่านมาทั้งหมด ${round - 1} รอบ`;
  document.getElementById('winner-screen').classList.add('show');
}

function playAgain() {
  rejected.clear();
  round = 1;
  wins  = {};
  // re-pick a fresh random subset
  activePool = shuffle([...ANIME]).slice(0, Math.min(poolSize, ANIME.length));
  document.getElementById('winner-screen').classList.remove('show');

  clearTrailer('left');
  clearTrailer('right');

  const vs = document.getElementById('vs-text');
  vs.style.display = '';
  document.getElementById('last-pick-img').classList.remove('visible');
  document.getElementById('last-pick-name').classList.remove('visible');

  leftAnime  = nextAnime(null, null);
  rightAnime = nextAnime(leftAnime, null);
  renderPanel('left',  leftAnime,  'anim-left');
  renderPanel('right', rightAnime, 'anim-right');
  updateUI();
}

// ── INIT ─────────────────────────────────────────────────────────
async function init() {
  // build active pool from random subset
  activePool = shuffle([...ANIME]).slice(0, Math.min(poolSize, ANIME.length));

  initApiKeyUI();
  initPoolSizeUI();

  leftAnime  = nextAnime(null, null);
  rightAnime = nextAnime(leftAnime, null);

  document.getElementById('loading').querySelector('p').textContent = 'FETCHING IMAGES...';
  await Promise.all([fetchImage(leftAnime), fetchImage(rightAnime)]);

  renderPanel('left',  leftAnime);
  renderPanel('right', rightAnime);
  updateUI();

  const loading = document.getElementById('loading');
  loading.classList.add('hide');
  setTimeout(() => loading.remove(), 600);

  prefetchImages(activePool.filter(a => a !== leftAnime && a !== rightAnime));
}

let gameStarted = false;

// Click on panel background also triggers choose
document.getElementById('left').addEventListener('click',  (e) => { if (!e.target.classList.contains('choose-btn')) choose('left');  });
document.getElementById('right').addEventListener('click', (e) => { if (!e.target.classList.contains('choose-btn')) choose('right'); });

// Trailer hover
setupHover('left');
setupHover('right');

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSettings(); closeDashboard(); }
  if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') choose('left');
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') choose('right');
});

window.addEventListener('load', () => { if (!gameStarted) { gameStarted = true; init(); } });
