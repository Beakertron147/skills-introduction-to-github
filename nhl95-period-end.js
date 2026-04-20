// NHL 94-style period-end / game-end scoreboard screen

game.pScores = [];       // per-period [homeGoals, awayGoals]
game._pStart  = [0, 0];  // cumulative scores at start of current period

let _peMenuIdx = 0;
let _peKeyLock = false;

function _capturePeriodScore() {
  game.pScores[game.period - 1] = [
    game.scores[0] - game._pStart[0],
    game.scores[1] - game._pStart[1],
  ];
}

function _advancePeriod() {
  if (_peKeyLock) return;
  if (game.period === 3) {
    if (game.scores[0] === game.scores[1]) {
      game.period  = 4;
      game._pStart = [game.scores[0], game.scores[1]];
      _clock = game.periodTime;
      initPlayers(); initPuck();
      game.state = 'faceoff';
    } else {
      game.state = 'game_end';
      _peMenuIdx = 0;
      _peKeyLock = true;
      setTimeout(() => { _peKeyLock = false; }, 500);
    }
    return;
  }
  if (game.period >= 4) {
    game.state = 'game_end';
    _peMenuIdx = 0;
    _peKeyLock = true;
    setTimeout(() => { _peKeyLock = false; }, 500);
    return;
  }
  game.period++;
  game._pStart = [game.scores[0], game.scores[1]];
  _clock = game.periodTime;
  initPlayers(); initPuck();
  game.state = 'faceoff';
}

function _playAgain() {
  game.scores  = [0, 0];
  game.pScores = [];
  game._pStart = [0, 0];
  game.period  = 1;
  _clock       = game.periodTime;
  initPlayers(); initPuck();
  game.state = 'faceoff';
}

function _mainMenu() {
  game.scores  = [0, 0];
  game.pScores = [];
  game._pStart = [0, 0];
  game.period  = 1;
  _clock       = game.periodTime;
  game.state   = 'team_select';
  SEL.p1done   = false;
  SEL.p2done   = false;
}

// Detect playing→period_end transition
const _prevTC15 = tickClock;
tickClock = function(t) {
  const wasPlaying = game.state === 'playing';
  _prevTC15(t);
  if (wasPlaying && game.state === 'period_end') {
    _capturePeriodScore();
    _peMenuIdx = 0;
    _peKeyLock = true;
    setTimeout(() => { _peKeyLock = false; }, 500);
  }
};

const _prevKD15 = onKeyDown;
onKeyDown = function(code) {
  _prevKD15(code);
  if (game.state === 'period_end') {
    if (!_peKeyLock && (code === 'Space' || code === 'Enter')) _advancePeriod();
    return;
  }
  if (game.state === 'game_end') {
    if (_peKeyLock) return;
    if (code === 'ArrowUp'   || code === 'KeyW') _peMenuIdx = (_peMenuIdx + 1) % 2;
    if (code === 'ArrowDown' || code === 'KeyS') _peMenuIdx = (_peMenuIdx + 1) % 2;
    if (code === 'Space'     || code === 'Enter') {
      if (_peMenuIdx === 0) _playAgain(); else _mainMenu();
    }
  }
};

function drawPeriodEnd() {
  const st = game.state;
  if (st !== 'period_end' && st !== 'game_end') return;

  const home      = TEAMS[game.homeTeam];
  const away      = TEAMS[game.awayTeam];
  const isGameEnd = st === 'game_end';
  const numPers   = Math.max(3, game.period);
  const cols      = numPers >= 4
    ? ['', '1ST', '2ND', '3RD', 'OT',  'TOT']
    : ['', '1ST', '2ND', '3RD',        'TOT'];
  const nC  = cols.length;
  const tbX = 50, tbY = 68, tbW = W - 100;
  const cw  = Math.floor(tbW / nC);
  const rH  = 56;

  // Dark full-screen backdrop
  ctx.fillStyle = 'rgba(0,2,18,0.94)';
  ctx.fillRect(0, 0, W, H);

  // Team color side strips
  ctx.fillStyle = home.primary;  ctx.fillRect(0, 0, 6, H);
  ctx.fillStyle = away.primary;  ctx.fillRect(W - 6, 0, 6, H);

  // Header
  ctx.fillStyle = '#080c18';
  ctx.fillRect(0, 0, W, 52);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = '12px "Press Start 2P"';
  ctx.fillStyle    = '#FFD700';
  ctx.fillText(isGameEnd ? 'FINAL  SCORE' : 'END  OF  PERIOD  ' + game.period, W / 2, 26);

  // Column headers
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(tbX, tbY, tbW, 24);
  cols.forEach((lbl, ci) => {
    ctx.fillStyle    = ci === nC - 1 ? '#FFD700' : '#5577AA';
    ctx.font         = '7px "Press Start 2P"';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lbl, tbX + ci * cw + cw / 2, tbY + 12);
  });

  // Team rows
  [0, 1].forEach(ti => {
    const team = ti === 0 ? home : away;
    const ry   = tbY + 24 + ti * rH;

    ctx.fillStyle = ti === 0 ? 'rgba(8,16,40,0.9)' : 'rgba(4,10,28,0.9)';
    ctx.fillRect(tbX, ry, tbW, rH);
    ctx.fillStyle = team.primary;
    ctx.fillRect(tbX, ry, 5, rH);

    // Logo / abbr in col 0
    const logo = typeof LOGOS !== 'undefined' ? LOGOS[team.abbr] : null;
    const cx0  = tbX + cw / 2;
    if (logo) {
      const lsz = 38;
      ctx.drawImage(logo, cx0 - lsz / 2, ry + (rH - lsz) / 2, lsz, lsz);
    } else {
      ctx.fillStyle = team.primary; ctx.font = '9px "Press Start 2P"';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(team.abbr, cx0, ry + rH / 2);
    }

    // Period score columns
    const periodCols = nC - 2;
    for (let pi = 0; pi < periodCols; pi++) {
      const ps  = game.pScores[pi];
      const val = ps !== undefined ? String(ps[ti]) : '-';
      ctx.fillStyle    = ps !== undefined ? '#FFFFFF' : '#334455';
      ctx.font         = '15px "Press Start 2P"';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(val, tbX + (pi + 1) * cw + cw / 2, ry + rH / 2);
    }

    // Total column
    ctx.fillStyle    = '#FFD700';
    ctx.font         = '18px "Press Start 2P"';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(game.scores[ti]), tbX + (nC - 1) * cw + cw / 2, ry + rH / 2);
  });

  // Table border
  ctx.strokeStyle = '#1a2a40';
  ctx.lineWidth   = 1;
  ctx.strokeRect(tbX, tbY, tbW, 24 + rH * 2);
  ctx.beginPath();
  ctx.moveTo(tbX, tbY + 24 + rH);
  ctx.lineTo(tbX + tbW, tbY + 24 + rH);
  ctx.stroke();

  // Team name labels
  const nyY = tbY + 24 + rH * 2 + 14;
  ctx.font = '7px "Press Start 2P"'; ctx.textBaseline = 'middle';
  ctx.fillStyle = home.primary; ctx.textAlign = 'left';
  ctx.fillText(home.name.toUpperCase(), tbX + 8, nyY);
  ctx.fillStyle = away.primary; ctx.textAlign = 'right';
  ctx.fillText(away.name.toUpperCase(), tbX + tbW - 8, nyY);

  // Winner banner (game end)
  if (isGameEnd) {
    const winner = game.scores[0] > game.scores[1] ? home
                 : game.scores[1] > game.scores[0] ? away : null;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '11px "Press Start 2P"';
    ctx.fillStyle = winner ? winner.primary : '#AABBCC';
    ctx.fillText(winner ? winner.name.toUpperCase() + '  WIN!' : 'OVERTIME  TIE', W / 2, nyY + 26);
  }

  // Menu
  const mY = H - 62;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (!isGameEnd) {
    const blink = Math.floor(Date.now() / 480) % 2 === 0;
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = blink ? '#FFD700' : '#886600';
    ctx.fillText('SPACE / ENTER  TO  CONTINUE', W / 2, mY + 16);
  } else {
    ['PLAY  AGAIN', 'MAIN  MENU'].forEach((opt, i) => {
      const sel = _peMenuIdx === i;
      ctx.font      = sel ? '10px "Press Start 2P"' : '9px "Press Start 2P"';
      ctx.fillStyle = sel ? '#FFD700' : '#3a4f66';
      ctx.fillText(sel ? '\u25ba ' + opt + ' \u25c4' : opt, W / 2, mY + i * 26);
    });
    ctx.font = '6px "Press Start 2P"'; ctx.fillStyle = '#2a3a4a';
    ctx.fillText('UP / DOWN   SPACE = SELECT', W / 2, mY + 54);
  }
}

const _prevDFO15 = drawFaceoffOverlay;
drawFaceoffOverlay = function() { _prevDFO15(); drawPeriodEnd(); };
