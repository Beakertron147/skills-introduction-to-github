// ── Shooting ──────────────────────────────────────────────────────────────────
const charge     = [0, 0];
const MAX_CHARGE = 50;

function updateShooting() {
  if (game.state !== 'playing') return;
  [0, 1].forEach(team => {
    const key    = team === 0 ? 'Space' : 'Enter';
    const carrier = puck.carrier;
    const ctrl    = players.find(p => p.team === team && p.controlled);
    if (keys[key] && ctrl && carrier === ctrl) {
      charge[team] = Math.min(charge[team] + 1, MAX_CHARGE);
    } else if (!keys[key]) {
      charge[team] = 0;
    }
  });
}

function tryShoot(teamIdx) {
  const frames = charge[teamIdx];
  charge[teamIdx] = 0;
  if (game.state !== 'playing') return;
  const ctrl = players.find(p => p.team === teamIdx && p.controlled);
  if (!ctrl || puck.carrier !== ctrl) return;

  const roster  = teamIdx === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
  const sht     = (roster[ctrl.rIdx] || { sht: 80 }).sht;
  const baseSpd = 10 + sht / 98 * 8;
  const isSlap  = frames >= 15;
  const c       = Math.min(frames / MAX_CHARGE, 1);
  const shotSpd = isSlap ? baseSpd * (0.85 + c * 0.85) : baseSpd * 0.62;

  puck.vx          = Math.cos(ctrl.dir) * shotSpd;
  puck.vy          = Math.sin(ctrl.dir) * shotSpd;
  puck.carrier     = null;
  puck.immune      = ctrl;
  puck.immuneTimer = 28;
}

function drawShootingEffects() {
  if (game.state !== 'playing') return;
  [0, 1].forEach(team => {
    const c = charge[team];
    if (c < 4) return;
    const ctrl = players.find(p => p.team === team && p.controlled && p === puck.carrier);
    if (!ctrl) return;

    const pct  = Math.min(c / MAX_CHARGE, 1);
    const barW = 26, barH = 4;
    const bx   = ctrl.x - barW / 2;
    const by   = ctrl.y - 26;

    ctx.fillStyle = '#111';
    ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
    ctx.fillStyle = `hsl(${Math.round(120 - pct * 120)},100%,50%)`;
    ctx.fillRect(bx, by, barW * pct, barH);

    if (pct >= 0.98) {
      ctx.fillStyle    = '#FFFFFF';
      ctx.font         = '5px "Press Start 2P"';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('SHOOT!', ctrl.x, by - 1);
    }
  });
}

const _prevKeyUp = onKeyUp;
onKeyUp = function(code) {
  _prevKeyUp(code);
  if (code === 'Space') tryShoot(0);
  if (code === 'Enter') tryShoot(1);
};

// ── Passing ───────────────────────────────────────────────────────────────────
function bestPassTarget(carrier, teamIdx) {
  const cos = Math.cos(carrier.dir), sin = Math.sin(carrier.dir);
  const candidates = players.filter(p => p.team === teamIdx && p !== carrier);
  if (!candidates.length) return null;

  let best = null, bestScore = Infinity;
  candidates.forEach(t => {
    const dx    = t.x - carrier.x, dy = t.y - carrier.y;
    const dist  = Math.hypot(dx, dy);
    const fwd   = cos * dx + sin * dy;
    const score = dist - (fwd > 0 ? 40 : 0);
    if (score < bestScore) { bestScore = score; best = t; }
  });
  return best;
}

function tryPass(teamIdx) {
  if (game.state !== 'playing') return;
  const ctrl = players.find(p => p.team === teamIdx && p.controlled);
  if (!ctrl || puck.carrier !== ctrl) return;

  const target  = bestPassTarget(ctrl, teamIdx);
  if (!target) return;

  const roster  = teamIdx === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
  const pas     = (roster[ctrl.rIdx] || { pas: 80 }).pas;
  const passSpd = 8 + pas / 98 * 6;

  const dx = target.x - puck.x, dy = target.y - puck.y;
  const d  = Math.hypot(dx, dy);
  if (d < 1) return;

  puck.vx          = dx / d * passSpd;
  puck.vy          = dy / d * passSpd;
  puck.carrier     = null;
  puck.immune      = ctrl;
  puck.immuneTimer = 18;
}

let _prevCarrier = null;

function updatePassing() {
  if (game.state !== 'playing') { _prevCarrier = puck.carrier; return; }
  const cur = puck.carrier;
  if (cur !== null && _prevCarrier === null && cur.controlled) {
    const key = cur.team === 0 ? 'Space' : 'Enter';
    if (keys[key]) fireOnetimer(cur);
  }
  _prevCarrier = cur;
}

function fireOnetimer(p) {
  const roster = p.team === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
  const sht    = (roster[p.rIdx] || { sht: 80 }).sht;
  const spd    = (10 + sht / 98 * 8) * 1.30;

  puck.vx          = Math.cos(p.dir) * spd;
  puck.vy          = Math.sin(p.dir) * spd;
  puck.carrier     = null;
  puck.immune      = p;
  puck.immuneTimer = 28;
  charge[p.team]   = 0;
}

function drawPassIndicator() {
  if (game.state !== 'playing') return;
  [0, 1].forEach(team => {
    const ctrl = players.find(p => p.team === team && p.controlled && p === puck.carrier);
    if (!ctrl) return;
    const target = bestPassTarget(ctrl, team);
    if (!target) return;

    ctx.strokeStyle  = team === 0 ? 'rgba(255,215,0,0.65)' : 'rgba(0,229,255,0.65)';
    ctx.lineWidth    = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(target.x, target.y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

const _prevKD = onKeyDown;
onKeyDown = function(code) {
  _prevKD(code);
  if (code === 'KeyQ') tryPass(0);
  if (code === 'KeyE') tryPass(1);
};

// ── Goalie AI ─────────────────────────────────────────────────────────────────
function goalieTargetPos(g) {
  const netX = g.team === 0 ? GL1 : GL2;
  const netY = RINK.cy;
  const dx   = puck.x - netX;
  const dy   = puck.y - netY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const fraction = Math.min((NET_D + 2) / dist, 1);
  return { x: netX + dx * fraction, y: netY + dy * fraction };
}

function updateGoalieAI() {
  if (game.state !== 'playing') return;
  players.forEach(g => {
    if (!g.isGoalie) return;
    const roster   = g.team === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
    const save     = (roster[g.rIdx] || { save: 85 }).save;
    let spd        = 1.6 + (save - 80) / 13 * 0.8;

    const puckSpd  = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
    const movingIn = g.team === 0 ? puck.vx < 0 : puck.vx > 0;
    if (puckSpd > 3.5 && movingIn && puck.carrier === null) spd *= 2.5;

    const target = goalieTargetPos(g);
    const ex = target.x - g.x;
    const ey = target.y - g.y;
    const ed = Math.sqrt(ex * ex + ey * ey) || 1;
    if (ed > 1) {
      const move = Math.min(spd, ed);
      g.x += (ex / ed) * move;
      g.y += (ey / ed) * move;
    }

    g.dir = Math.atan2(puck.y - g.y, puck.x - g.x);
    clampGoalie(g);
    [g.x, g.y] = clampToRink(g.x, g.y);
    g.vx = 0;
    g.vy = 0;
  });
}
