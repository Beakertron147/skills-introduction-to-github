'use strict';

const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const W = 800;
const H = 520;

const game = {
  state:      'team_select',
  period:     1,
  periodTime: 180,
  scores:     [0, 0],
  homeTeam:   null,
  awayTeam:   null,
};

const keys = {};

document.addEventListener('keydown', e => {
  if (!keys[e.code]) onKeyDown(e.code);
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  keys[e.code] = false;
  onKeyUp(e.code);
});

const SEL = { p1: 0, p2: 4, p1done: false, p2done: false };

const TS_COLS  = 8;
const TS_CW    = 96;
const TS_CH    = 70;
const TS_GX    = 8;
const TS_GY    = 56;

function tsCell(i) {
  return {
    x: TS_GX + (i % TS_COLS) * TS_CW,
    y: TS_GY + Math.floor(i / TS_COLS) * TS_CH,
    w: TS_CW - 3,
    h: TS_CH - 3,
  };
}

function drawTeamSelect() {
  ctx.fillStyle = '#000820';
  ctx.fillRect(0, 0, W, H);

  for (let sy = 0; sy < H; sy += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, sy, W, 1);
  }

  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#FFD700';
  ctx.font         = '13px "Press Start 2P"';
  ctx.fillText("NHL '95", W / 2, 18);

  ctx.fillStyle = '#6688AA';
  ctx.font      = '7px "Press Start 2P"';
  ctx.fillText('CHOOSE YOUR TEAMS', W / 2, 38);

  const DIVS = ['ATLANTIC', 'METROPOLITAN', 'CENTRAL', 'PACIFIC'];
  ctx.font      = '5px "Press Start 2P"';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334466';
  DIVS.forEach((d, r) => {
    ctx.fillText(d, TS_GX - 2, TS_GY + r * TS_CH + TS_CH / 2 - 1);
  });

  for (let i = 0; i < TEAMS.length; i++) {
    const t = TEAMS[i];
    const { x, y, w, h } = tsCell(i);

    ctx.fillStyle = t.primary;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = t.secondary;
    ctx.fillRect(x, y + h - 9, w, 9);

    const cellLogo = typeof LOGOS !== 'undefined' && LOGOS[t.abbr];
    if (cellLogo) {
      const pad = 3;
      ctx.drawImage(cellLogo, x + pad, y + pad, w - pad * 2, h - 9 - pad * 2);
    } else {
      ctx.fillStyle    = t.textColor;
      ctx.font         = '8px "Press Start 2P"';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.abbr, x + w / 2, y + h / 2 - 5);
      const lastWord = t.city.split(' ').pop();
      ctx.font      = '5px "Press Start 2P"';
      ctx.fillStyle = t.textColor === '#FFFFFF' ? '#FFFFFF' : t.primary;
      ctx.fillText(lastWord, x + w / 2, y + h - 4);
    }
  }

  const cursors = [
    { idx: SEL.p1, done: SEL.p1done, color: '#FFD700', label: 'P1' },
    { idx: SEL.p2, done: SEL.p2done, color: '#00E5FF', label: 'P2' },
  ];
  cursors.forEach(cur => {
    const { x, y, w, h } = tsCell(cur.idx);
    ctx.strokeStyle = cur.done ? 'rgba(255,255,255,0.35)' : cur.color;
    ctx.lineWidth   = 3;
    ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
    const labelY = y > TS_GY + 10 ? y - 10 : y + h + 12;
    ctx.fillStyle    = cur.done ? 'rgba(255,255,255,0.35)' : cur.color;
    ctx.font         = '6px "Press Start 2P"';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cur.label, x + w / 2, labelY);
  });

  const panelY = TS_GY + 4 * TS_CH + 6;
  const panelH = H - panelY - 2;
  const half   = Math.floor(W / 2) - 2;

  function drawPanel(team, px, cursor) {
    ctx.fillStyle = team.primary;
    ctx.fillRect(px, panelY, half, panelH);
    ctx.fillStyle = team.secondary;
    ctx.fillRect(px, panelY + panelH - 5, half, 5);
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle    = team.textColor;
    ctx.font         = '8px "Press Start 2P"';
    ctx.fillText(team.name, px + 8, panelY + 8);
    ctx.font         = '6px "Press Start 2P"';
    ctx.fillText(
      (team.conf === 'E' ? 'EAST' : 'WEST') + ' · ' + team.div.toUpperCase(),
      px + 8, panelY + 22
    );
    if (cursor.done) {
      ctx.fillStyle = '#00FF88';
      ctx.font      = '7px "Press Start 2P"';
      ctx.fillText('LOCKED IN ✓', px + 8, panelY + 36);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '6px "Press Start 2P"';
      ctx.fillText(cursor.label + ': ARROWS+SPACE', px + 8, panelY + 36);
    }
  }

  drawPanel(TEAMS[SEL.p1], 0,        cursors[0]);
  drawPanel(TEAMS[SEL.p2], half + 4, cursors[1]);

  ctx.fillStyle = '#111';
  ctx.fillRect(half, panelY, 4, panelH);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#FFFFFF';
  ctx.font         = '10px "Press Start 2P"';
  ctx.fillText('VS', W / 2, panelY + panelH / 2);

  ctx.fillStyle    = '#334';
  ctx.font         = '6px "Press Start 2P"';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(
    (SEL.p1done && SEL.p2done) ? 'GET READY...' : 'P2: WASD + ENTER',
    W / 2, H
  );
}

function onKeyDown(code) {
  if (game.state === 'team_select') tsKeyDown(code);
}
function onKeyUp(code) {}

function tsMove(cur, dc, dr) {
  const col = ((cur % TS_COLS) + dc + TS_COLS) % TS_COLS;
  const row = (Math.floor(cur / TS_COLS) + dr + 4) % 4;
  return row * TS_COLS + col;
}

function tsKeyDown(code) {
  if (!SEL.p1done) {
    if (code === 'ArrowLeft')  SEL.p1 = tsMove(SEL.p1, -1,  0);
    if (code === 'ArrowRight') SEL.p1 = tsMove(SEL.p1,  1,  0);
    if (code === 'ArrowUp')    SEL.p1 = tsMove(SEL.p1,  0, -1);
    if (code === 'ArrowDown')  SEL.p1 = tsMove(SEL.p1,  0,  1);
    if (code === 'Space')      SEL.p1done = true;
  }
  if (!SEL.p2done) {
    if (code === 'KeyA')  SEL.p2 = tsMove(SEL.p2, -1,  0);
    if (code === 'KeyD')  SEL.p2 = tsMove(SEL.p2,  1,  0);
    if (code === 'KeyW')  SEL.p2 = tsMove(SEL.p2,  0, -1);
    if (code === 'KeyS')  SEL.p2 = tsMove(SEL.p2,  0,  1);
    if (code === 'Enter') SEL.p2done = true;
  }
  if (SEL.p1done && SEL.p2done) {
    game.homeTeam = SEL.p1;
    game.awayTeam = SEL.p2;
    setTimeout(() => { game.state = 'faceoff'; }, 1200);
  }
}

function render(t) {
  ctx.fillStyle = '#000010';
  ctx.fillRect(0, 0, W, H);

  if (game.state === 'team_select') {
    drawTeamSelect();
  } else {
    tickClock(t);
    updateGoalieAI();
    updatePlayers();
    resolveCollisions();
    updatePuck();
    updateShooting();
    updatePassing();
    drawRink();
    drawAllPlayers();
    drawPassIndicator();
    drawPuck();
    drawShootingEffects();
    drawScoreboard();
    drawFaceoffOverlay();
  }

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
