// Retro sound effects via Web Audio API — no external files

let _sfxCtx = null;
function _ctx() {
  if (!_sfxCtx) {
    try { _sfxCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return _sfxCtx;
}

// Unlock audio on first keypress (browser autoplay policy)
document.addEventListener('keydown', () => {
  const c = _ctx(); if (c && c.state === 'suspended') c.resume();
}, { once: true });

function _noise(freq, decay, vol) {
  const c = _ctx(); if (!c) return;
  const buf  = c.createBuffer(1, c.sampleRate * decay, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const flt = c.createBiquadFilter(); flt.type = 'bandpass';
  flt.frequency.value = freq; flt.Q.value = 1.2;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + decay);
  src.connect(flt); flt.connect(g); g.connect(c.destination); src.start();
}

function _tone(freq, dur, type, vol, freqEnd) {
  const c = _ctx(); if (!c) return;
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, c.currentTime);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  osc.connect(g); g.connect(c.destination);
  osc.start(); osc.stop(c.currentTime + dur);
}

function sfxShot(power) {
  _noise(700 + power * 600, 0.09 + power * 0.06, 0.22 + power * 0.14);
}

function sfxBoardHit() {
  _noise(180, 0.09, 0.2);
  _tone(90, 0.08, 'sine', 0.12);
}

function sfxPickup() {
  _tone(1200, 0.04, 'sine', 0.07);
}

function sfxGoal() {
  const c = _ctx(); if (!c) return;
  // Two-oscillator goal horn (sawtooth + square for richness)
  [{ type: 'sawtooth', vol: 0.28 }, { type: 'square', vol: 0.10 }].forEach(({ type, vol }) => {
    const osc = c.createOscillator(); const g = c.createGain();
    osc.type = type; osc.frequency.value = 466;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.setValueAtTime(vol, c.currentTime + 1.1);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
    osc.connect(g); g.connect(c.destination);
    osc.start(); osc.stop(c.currentTime + 1.6);
  });
}

function sfxBuzzer() {
  const c = _ctx(); if (!c) return;
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = 'sawtooth'; osc.frequency.value = 220;
  g.gain.setValueAtTime(0.32, c.currentTime);
  g.gain.setValueAtTime(0.32, c.currentTime + 0.75);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.0);
  osc.connect(g); g.connect(c.destination);
  osc.start(); osc.stop(c.currentTime + 1.1);
}

// ── Event hooks ───────────────────────────────────────────────────────────────

// Shot / one-timer
const _prevTS19 = tryShoot;
tryShoot = function(teamIdx) {
  const ctrl = players.find(p => p.team === teamIdx && p.controlled);
  const had  = ctrl && puck.carrier === ctrl;
  const pwr  = Math.min(charge[teamIdx] / MAX_CHARGE, 1);
  _prevTS19(teamIdx);
  if (had && puck.carrier === null) sfxShot(pwr);
};

const _prevFOT19 = fireOnetimer;
fireOnetimer = function(p) { _prevFOT19(p); sfxShot(0.95); };

// Board bounce
let _lastBounce = 0;
const _prevBP19 = bouncePuck;
bouncePuck = function() {
  const vx0 = puck.vx, vy0 = puck.vy;
  _prevBP19();
  const now = Date.now();
  if (now - _lastBounce > 160 &&
      (Math.abs(puck.vx - vx0) > 0.6 || Math.abs(puck.vy - vy0) > 0.6)) {
    _lastBounce = now; sfxBoardHit();
  }
};

// Puck pickup
let _lastCarrier19 = null;
const _prevUP19 = updatePuck;
updatePuck = function() {
  _prevUP19();
  if (puck.carrier !== null && _lastCarrier19 === null) sfxPickup();
  _lastCarrier19 = puck.carrier;
};

// Goal horn
const _prevCG19 = checkGoal;
checkGoal = function() {
  const was = game.state;
  _prevCG19();
  if (was === 'playing' && game.state === 'goal') sfxGoal();
};

// Period-end buzzer
const _prevTC19 = tickClock;
tickClock = function(t) {
  const was = game.state;
  _prevTC19(t);
  if (was === 'playing' && game.state === 'period_end') sfxBuzzer();
};
