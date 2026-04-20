let _goalTimer  = 0;
const GOAL_FRAMES = 180;  // 3 s at 60 fps

function updateGoalOverlay() {
  if (game.state !== 'goal') { _goalTimer = 0; return; }
  _goalTimer++;
  if (_goalTimer >= GOAL_FRAMES) {
    _goalTimer = 0;
    initPlayers();
    initPuck();
    game.state = 'faceoff';
  }
}

function drawGoalOverlay() {
  if (game.state !== 'goal') return;

  const teamIdx    = game.lastGoalTeam;
  const scoringTeam = teamIdx === 0 ? TEAMS[game.homeTeam] : TEAMS[game.awayTeam];

  // Team-colour flash that fades out over first 30 frames
  const flash = Math.max(0, 1 - _goalTimer / 30);
  if (flash > 0) {
    ctx.globalAlpha = flash * 0.55;
    ctx.fillStyle   = scoringTeam.primary;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // Dark backdrop
  ctx.fillStyle = 'rgba(0,0,10,0.55)';
  ctx.fillRect(0, 0, W, H);

  // Pulsing "GOAL!" text
  const pulse = 1 + Math.sin(_goalTimer * 0.14) * 0.05;
  ctx.save();
  ctx.translate(W / 2, H / 2 - 18);
  ctx.scale(pulse, pulse);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = '40px "Press Start 2P"';
  ctx.fillStyle    = 'rgba(0,0,0,0.55)';
  ctx.fillText('GOAL!', 3, 3);
  ctx.fillStyle    = scoringTeam.primary;
  ctx.fillText('GOAL!', 0, 0);
  ctx.restore();

  // Scoring team name
  ctx.font         = '9px "Press Start 2P"';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#FFFFFF';
  ctx.fillText(scoringTeam.name.toUpperCase(), W / 2, H / 2 + 26);

  // Current score
  ctx.font      = '14px "Press Start 2P"';
  ctx.fillStyle = '#FFD700';
  ctx.fillText(game.scores[0] + '  —  ' + game.scores[1], W / 2, H / 2 + 52);
}

// Hook into the existing render pipeline without editing core
const _prevTC14 = tickClock;
tickClock = function(t) { _prevTC14(t); updateGoalOverlay(); };

const _prevDFO14 = drawFaceoffOverlay;
drawFaceoffOverlay = function() { _prevDFO14(); drawGoalOverlay(); };
