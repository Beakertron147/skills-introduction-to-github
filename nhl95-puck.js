const PUCK_R      = 5;
const PUCK_FRIC   = 0.987;
const PUCK_PICKUP = 18;
const STICK_FWD   = 15;
const STICK_SIDE  = 10;

const puck = {
  x: RINK.cx, y: RINK.cy,
  vx: 0, vy: 0,
  carrier:     null,
  immune:      null,
  immuneTimer: 0,
};

let _faceoffTimer = 0;
const FACEOFF_FRAMES = 180;

function initPuck() {
  puck.x = RINK.cx;  puck.y = RINK.cy;
  puck.vx = 0;       puck.vy = 0;
  puck.carrier     = null;
  puck.immune      = null;
  puck.immuneTimer = 0;
  _faceoffTimer    = 0;
}

function bouncePuck() {
  const bd  = PUCK_R + 9;
  const ax  = RINK.w / 2 - bd;
  const ay  = RINK.h / 2 - bd;
  const dx  = puck.x - RINK.cx;
  const dy  = puck.y - RINK.cy;
  const e   = (dx / ax) * (dx / ax) + (dy / ay) * (dy / ay);
  if (e <= 1) return;

  const nx   = dx / (ax * ax);
  const ny   = dy / (ay * ay);
  const nLen = Math.hypot(nx, ny);
  const nnx  = nx / nLen, nny = ny / nLen;

  const s = 1 / Math.sqrt(e);
  puck.x = RINK.cx + dx * s;
  puck.y = RINK.cy + dy * s;

  const vDotN = puck.vx * nnx + puck.vy * nny;
  if (vDotN > 0) {
    puck.vx -= 2 * vDotN * nnx * 0.72;
    puck.vy -= 2 * vDotN * nny * 0.72;
  }
}

function updatePuck() {
  if (players.length === 0 && game.homeTeam !== null) {
    initPlayers();
    initPuck();
  }

  if (game.state === 'faceoff') {
    _faceoffTimer++;
    if (_faceoffTimer >= FACEOFF_FRAMES) {
      _faceoffTimer = 0;
      game.state = 'playing';
    }
    return;
  }

  if (game.state !== 'playing') return;

  if (puck.immuneTimer > 0) puck.immuneTimer--;
  else                       puck.immune = null;

  if (puck.carrier) {
    const p   = puck.carrier;
    const cos = Math.cos(p.dir), sin = Math.sin(p.dir);
    puck.x  = p.x + cos * STICK_FWD - sin * STICK_SIDE;
    puck.y  = p.y + sin * STICK_FWD + cos * STICK_SIDE;
    puck.vx = p.vx;
    puck.vy = p.vy;
    return;
  }

  puck.vx *= PUCK_FRIC;
  puck.vy *= PUCK_FRIC;
  puck.x  += puck.vx;
  puck.y  += puck.vy;
  bouncePuck();

  let best = null, bestDist = PUCK_PICKUP;
  for (const p of players) {
    if (p === puck.immune) continue;
    const d = Math.hypot(puck.x - p.x, puck.y - p.y);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  if (best) puck.carrier = best;
}

function drawPuck() {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(puck.x + 2, puck.y + 3, PUCK_R + 2, (PUCK_R + 2) * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.ellipse(puck.x, puck.y, PUCK_R, PUCK_R * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.ellipse(puck.x, puck.y, PUCK_R, PUCK_R * 0.65, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFaceoffOverlay() {
  if (game.state !== 'faceoff') return;

  ctx.fillStyle = 'rgba(0,0,10,0.45)';
  ctx.fillRect(0, 0, W, H);

  const secs  = Math.ceil((FACEOFF_FRAMES - _faceoffTimer) / 60);
  const label = secs > 0 ? String(secs) : 'FACE-OFF!';

  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.font      = '28px "Press Start 2P"';
  ctx.fillText(label, W / 2 + 3, H / 2 + 3);

  ctx.fillStyle = secs > 0 ? '#FFD700' : '#FF4444';
  ctx.fillText(label, W / 2, H / 2);

  ctx.fillStyle = '#6688AA';
  ctx.font      = '9px "Press Start 2P"';
  ctx.fillText('PERIOD  ' + game.period + '  OF  3', W / 2, H / 2 + 36);
}
