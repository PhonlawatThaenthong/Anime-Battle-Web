// ── VOLUME ────────────────────────────────────────────────────────
let trailerVolume = parseInt(localStorage.getItem('trailer_volume') ?? '80');

function initVolumeUI() {
  const slider = document.getElementById('vol-slider');
  const valEl  = document.getElementById('vol-value');
  if (!slider) return;
  slider.value = trailerVolume;
  valEl.textContent = trailerVolume;
  updateSliderTrack(slider, trailerVolume);
  updateVolIcon(trailerVolume);
}

function onVolumeSlide(val) {
  val = parseInt(val);
  document.getElementById('vol-value').textContent = val;
  updateSliderTrack(document.getElementById('vol-slider'), val);
  updateVolIcon(val);
  // apply live to any open iframes
  applyVolumeToIframes(val);
}

function saveVolume(val) {
  trailerVolume = parseInt(val);
  localStorage.setItem('trailer_volume', trailerVolume);
}

function updateSliderTrack(slider, val) {
  slider.style.setProperty('--pct', `${val}%`);
}

function updateVolIcon(val) {
  const icon = document.getElementById('vol-icon');
  if (!icon) return;
  icon.textContent = val == 0 ? '🔇' : val < 40 ? '🔉' : '🔊';
}

function applyVolumeToIframes(vol) {
  document.querySelectorAll('.trailer-wrap iframe').forEach(iframe => {
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }), '*'
      );
    } catch(_) {}
  });
}

function setIframeVolume(iframe, vol) {
  // wait for iframe to be ready then send volume command
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }), '*'
        );
        if (vol === 0) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*'
          );
        } else {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
          );
        }
      } catch(_) {}
    }, 1000);
  });
}

// ── SETTINGS ─────────────────────────────────────────────────────
// ── POOL SIZE ────────────────────────────────────────────────────
let poolSize    = parseInt(localStorage.getItem('ab_pool_size') || '30');
let activePool  = [];   // the randomly-picked subset for this game

function savePoolSize(val) {
  poolSize = parseInt(val);
  localStorage.setItem('ab_pool_size', poolSize);
}

function initPoolSizeUI() {
  const slider = document.getElementById('pool-size-slider');
  const label  = document.getElementById('pool-size-val');
  if (!slider) return;
  slider.max   = ANIME.length;
  slider.value = poolSize;
  label.textContent = poolSize;
  slider.addEventListener('change', e => savePoolSize(e.target.value));
}
