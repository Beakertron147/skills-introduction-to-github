let _clock    = game.periodTime;
let _prevRafT = null;

function tickClock(t) {
  if (game.state === 'playing') {
    if (_prevRafT !== null) {
      _clock -= (t - _prevRafT) / 1000;
      if (_clock <= 0) { _clock = 0; game.state = 'period_end'; }
    }
    _prevRafT = t;
  } else {
    _prevRafT = null;
  }
}

function fmtClock(s) {
  s = Math.max(0, Math.ceil(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

const _PER = ['', '1ST', '2ND', '3RD', 'OT'];
const SB_H = 36;

function drawScoreboard() {
  if (game.homeTeam === null || game.awayTeam === null) return;

  const home = TEAMS[game.homeTeam];
  const away = TEAMS[game.awayTeam];

  ctx.fillStyle = '#06080f';
  ctx.fillRect(0, 0, W, SB_H);

  const gr = ctx.createLinearGradient(0, 0, W, 0);
  gr.addColorStop(0,    home.primary);
  gr.addColorStop(0.38, '#7a5e08');
  gr.addColorStop(0.62, '#7a5e08');
  gr.addColorStop(1,    away.primary);
  ctx.fillStyle = gr;
  ctx.fillRect(0, SB_H - 3, W, 3);

  ctx.fillStyle = home.primary;
  ctx.fillRect(0, 0, 7, SB_H - 3);
  ctx.fillStyle = away.primary;
  ctx.fillRect(W - 7, 0, 7, SB_H - 3);

  const lsz   = 26;
  const hLogo = typeof LOGOS !== 'undefined' ? LOGOS[home.abbr] : null;
  const aLogo = typeof LOGOS !== 'undefined' ? LOGOS[away.abbr] : null;

  if (hLogo) ctx.drawImage(hLogo, 10, 4, lsz, lsz);
  ctx.fillStyle    = '#C8D8E8';
  ctx.font         = '7px "Press Start 2P"';
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(home.abbr, hLogo ? 40 : 12, SB_H / 2 - 4);
  ctx.fillStyle = '#334455';
  ctx.font      = '5px "Press Start 2P"';
  ctx.fillText('HOME', hLogo ? 40 : 12, SB_H / 2 + 7);

  ctx.fillStyle    = '#FFD700';
  ctx.font         = '20px "Press Start 2P"';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(game.scores[0]), 300, SB_H / 2 - 1);

  ctx.fillStyle    = '#FFD700';
  ctx.font         = '20px "Press Start 2P"';
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(game.scores[1]), 500, SB_H / 2 - 1);

  if (aLogo) ctx.drawImage(aLogo, W - 10 - lsz, 4, lsz, lsz);
  ctx.fillStyle    = '#C8D8E8';
  ctx.font         = '7px "Press Start 2P"';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(away.abbr, aLogo ? W - 40 : W - 12, SB_H / 2 - 4);
  ctx.fillStyle = '#334455';
  ctx.font      = '5px "Press Start 2P"';
  ctx.fillText('AWAY', aLogo ? W - 40 : W - 12, SB_H / 2 + 7);

  ctx.strokeStyle = '#3a2c00';
  ctx.lineWidth   = 1;
  [322, 478].forEach(vx => {
    ctx.beginPath();
    ctx.moveTo(vx, 4); ctx.lineTo(vx, SB_H - 7);
    ctx.stroke();
  });

  ctx.fillStyle    = '#EE1111';
  ctx.font         = '5px "Press Start 2P"';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('ESPN', W / 2, 2);

  ctx.fillStyle    = '#8899AA';
  ctx.font         = '9px "Press Start 2P"';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(_PER[Math.min(game.period, 4)], W / 2 - 52, SB_H / 2 + 1);

  ctx.fillStyle    = game.state === 'playing' ? '#22FF88' : '#557766';
  ctx.font         = '11px "Press Start 2P"';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fmtClock(_clock), W / 2 + 50, SB_H / 2 + 1);
}
