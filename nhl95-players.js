const players = [];

function initPlayers() {
  players.length = 0;
  if (game.homeTeam === null || game.awayTeam === null) return;

  function lineup(roster) {
    const G  = roster.find(p => p.pos === 'G');
    const Ds = roster.filter(p => p.pos === 'D').slice(0, 2);
    const Fs = roster.filter(p => ['C','LW','RW'].includes(p.pos)).slice(0, 3);
    return [G, ...Ds, ...Fs].filter(Boolean);
  }

  const hPos = [
    { x: GL1 - 8,      y: RINK.cy      },
    { x: BL1 - 34,     y: RINK.cy - 62 },
    { x: BL1 - 34,     y: RINK.cy + 62 },
    { x: RINK.cx - 46, y: RINK.cy - 52 },
    { x: RINK.cx - 14, y: RINK.cy      },
    { x: RINK.cx - 46, y: RINK.cy + 52 },
  ];
  const aPos = [
    { x: GL2 + 8,      y: RINK.cy      },
    { x: BL2 + 34,     y: RINK.cy - 62 },
    { x: BL2 + 34,     y: RINK.cy + 62 },
    { x: RINK.cx + 46, y: RINK.cy - 52 },
    { x: RINK.cx + 14, y: RINK.cy      },
    { x: RINK.cx + 46, y: RINK.cy + 52 },
  ];

  const hLine = lineup(TEAMS[game.homeTeam].roster);
  const aLine = lineup(TEAMS[game.awayTeam].roster);

  hLine.forEach((r, i) => {
    if (!hPos[i]) return;
    players.push({ ...hPos[i], vx:0, vy:0, dir:0, team:0,
                   isGoalie: r.pos==='G', controlled: i===4,
                   rIdx: TEAMS[game.homeTeam].roster.indexOf(r) });
  });
  aLine.forEach((r, i) => {
    if (!aPos[i]) return;
    players.push({ ...aPos[i], vx:0, vy:0, dir:Math.PI, team:1,
                   isGoalie: r.pos==='G', controlled: i===4,
                   rIdx: TEAMS[game.awayTeam].roster.indexOf(r) });
  });
}

function drawSprite(x, y, dir, isGoalie, controlled, team) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(dir);

  if (controlled) {
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth   = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (isGoalie) {
    ctx.fillStyle = team.secondary === team.primary
      ? 'rgba(255,255,255,0.6)' : team.secondary;
    ctx.fillRect(-12, -3, 4, 6);
    ctx.fillRect(8,   -3, 4, 6);
  }

  const r = isGoalie ? 9 : 8;
  ctx.fillStyle   = team.primary;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = team.secondary === team.primary
    ? 'rgba(255,255,255,0.5)' : team.secondary;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = team.primary;
  ctx.beginPath();
  ctx.arc(r + 2, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DCA870';
  ctx.beginPath();
  ctx.arc(r + 2, 1, 2.5, 0, Math.PI);
  ctx.fill();

  if (!isGoalie) {
    ctx.strokeStyle = '#A07038';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(2,  r);
    ctx.lineTo(10, r + 8);
    ctx.lineTo(18, r + 3);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAllPlayers() {
  if (players.length === 0 && game.homeTeam !== null) initPlayers();
  players.forEach(p => {
    const team = p.team === 0 ? TEAMS[game.homeTeam] : TEAMS[game.awayTeam];
    drawSprite(p.x, p.y, p.dir, p.isGoalie, p.controlled, team);
  });
}

// ── Movement ──────────────────────────────────────────────────────────────────
const ACCEL    = 0.52;
const FRICTION = 0.83;
const MAX_SPD  = 4.4;

function statMax(rIdx, team) {
  const roster = team === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
  const r = roster[rIdx];
  return r ? MAX_SPD * r.spd / 98 : MAX_SPD * 0.82;
}

function clampToRink(x, y) {
  const bd = 13;
  const ax = RINK.w / 2 - bd;
  const ay = RINK.h / 2 - bd;
  const dx = x - RINK.cx;
  const dy = y - RINK.cy;
  const e  = (dx / ax) * (dx / ax) + (dy / ay) * (dy / ay);
  if (e > 1) {
    const s = 1 / Math.sqrt(e);
    x = RINK.cx + dx * s;
    y = RINK.cy + dy * s;
  }
  return [x, y];
}

function clampGoalie(p) {
  const creaseX = RINK.h * 0.13 + 6;
  if (p.team === 0) p.x = Math.min(GL1 + creaseX, Math.max(RINK.x + 10, p.x));
  else              p.x = Math.max(GL2 - creaseX, Math.min(RINK.x + RINK.w - 10, p.x));
}

function movePlayer(p, upKey, downKey, leftKey, rightKey) {
  const maxSpd = statMax(p.rIdx, p.team);
  const accel  = ACCEL * (maxSpd / MAX_SPD);

  let ax = 0, ay = 0;
  if (keys[leftKey])  ax -= accel;
  if (keys[rightKey]) ax += accel;
  if (keys[upKey])    ay -= accel;
  if (keys[downKey])  ay += accel;

  if (ax !== 0 && ay !== 0) { ax *= 0.7071; ay *= 0.7071; }

  p.vx = p.vx * FRICTION + ax;
  p.vy = p.vy * FRICTION + ay;

  const spd = Math.hypot(p.vx, p.vy);
  if (spd > maxSpd) { p.vx = p.vx / spd * maxSpd; p.vy = p.vy / spd * maxSpd; }
  if (spd > 0.25) p.dir = Math.atan2(p.vy, p.vx);

  p.x += p.vx;
  p.y += p.vy;

  if (p.isGoalie) clampGoalie(p);
  [p.x, p.y] = clampToRink(p.x, p.y);
}

function updatePlayers() {
  if (game.state !== 'playing') return;

  players.forEach(p => {
    if (!p.controlled) {
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x  += p.vx;
      p.y  += p.vy;
      [p.x, p.y] = clampToRink(p.x, p.y);
      return;
    }
    if (p.team === 0) {
      movePlayer(p, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');
    } else {
      movePlayer(p, 'KeyW', 'KeyS', 'KeyA', 'KeyD');
    }
  });
}

// ── Collisions ────────────────────────────────────────────────────────────────
const PLAYER_R = 10;
const MIN_SEP  = PLAYER_R * 2;

function getRoster(p) {
  return p.team === 0 ? TEAMS[game.homeTeam].roster : TEAMS[game.awayTeam].roster;
}

function resolveCollisions() {
  if (game.state !== 'playing') return;

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i], b = players[j];
      const dx   = b.x - a.x;
      const dy   = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= MIN_SEP || dist < 0.01) continue;

      const nx = dx / dist, ny = dy / dist;
      const half = (MIN_SEP - dist) * 0.51;
      a.x -= nx * half;  a.y -= ny * half;
      b.x += nx * half;  b.y += ny * half;

      const dvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (dvn >= 0) continue;

      const sameTeam = a.team === b.team;
      const e = sameTeam ? 0.06 : 0.38;
      let impulse = -(1 + e) * dvn / 2;

      if (!sameTeam) {
        const aStats = getRoster(a)[a.rIdx] || { chk: 80 };
        const bStats = getRoster(b)[b.rIdx] || { chk: 80 };
        const aSpd   = Math.hypot(a.vx, a.vy);
        const bSpd   = Math.hypot(b.vx, b.vy);
        const bonus  = Math.max(0, aSpd * aStats.chk / 98 - bSpd * bStats.chk / 98) * 0.28;
        impulse += bonus;
      }

      a.vx -= impulse * nx;  a.vy -= impulse * ny;
      b.vx += impulse * nx;  b.vy += impulse * ny;

      const capSpd = MAX_SPD * 1.7;
      for (const p of [a, b]) {
        const s = Math.hypot(p.vx, p.vy);
        if (s > capSpd) { p.vx = p.vx / s * capSpd; p.vy = p.vy / s * capSpd; }
      }

      [a.x, a.y] = clampToRink(a.x, a.y);
      [b.x, b.y] = clampToRink(b.x, b.y);
    }
  }
}
