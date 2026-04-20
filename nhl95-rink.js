const RINK = { x: 20, y: 38, w: 760, h: 440, r: 78 };
RINK.cx = RINK.x + RINK.w / 2;
RINK.cy = RINK.y + RINK.h / 2;

const GL1 = RINK.x + RINK.w * 0.066;
const GL2 = RINK.x + RINK.w * 0.934;
const BL1 = RINK.x + RINK.w * 0.310;
const BL2 = RINK.x + RINK.w * 0.690;

const NET_HW = Math.round(RINK.h * 0.072);
const NET_D  = Math.round(RINK.w * 0.024);

const LNET = { x: GL1 - NET_D, y: RINK.cy - NET_HW, w: NET_D, h: NET_HW * 2 };
const RNET = { x: GL2,         y: RINK.cy - NET_HW, w: NET_D, h: NET_HW * 2 };

function rinkPath() {
  const { x, y, w, h, r } = RINK;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
}

function drawRink() {
  ctx.save();
  rinkPath();
  ctx.clip();

  ctx.fillStyle = '#C8EAF2';
  ctx.fillRect(RINK.x, RINK.y, RINK.w, RINK.h);

  ctx.strokeStyle = 'rgba(180,220,240,0.5)';
  ctx.lineWidth = 1;
  for (let iy = RINK.y + 20; iy < RINK.y + RINK.h; iy += 20) {
    ctx.beginPath();
    ctx.moveTo(RINK.x, iy);
    ctx.lineTo(RINK.x + RINK.w, iy);
    ctx.stroke();
  }

  drawCenterIceLogo();

  ctx.strokeStyle = '#CC1111';
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.moveTo(RINK.cx, RINK.y);
  ctx.lineTo(RINK.cx, RINK.y + RINK.h);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#1133CC';
  ctx.lineWidth = 5;
  [BL1, BL2].forEach(bx => {
    ctx.beginPath();
    ctx.moveTo(bx, RINK.y);
    ctx.lineTo(bx, RINK.y + RINK.h);
    ctx.stroke();
  });

  const glMargin = RINK.r * 0.42;
  ctx.strokeStyle = '#CC1111';
  ctx.lineWidth = 2;
  [GL1, GL2].forEach(gx => {
    ctx.beginPath();
    ctx.moveTo(gx, RINK.y + glMargin);
    ctx.lineTo(gx, RINK.y + RINK.h - glMargin);
    ctx.stroke();
  });

  const cR = RINK.h * 0.20;
  ctx.strokeStyle = '#CC1111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(RINK.cx, RINK.cy, cR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#CC1111';
  ctx.beginPath();
  ctx.arc(RINK.cx, RINK.cy, 5, 0, Math.PI * 2);
  ctx.fill();

  const foR  = RINK.h * 0.17;
  const foOX = RINK.w * 0.078;
  const foOY = RINK.h * 0.245;
  const foPositions = [
    [GL1 + foOX, RINK.cy - foOY], [GL1 + foOX, RINK.cy + foOY],
    [GL2 - foOX, RINK.cy - foOY], [GL2 - foOX, RINK.cy + foOY],
  ];
  ctx.strokeStyle = '#CC1111';
  ctx.lineWidth = 2;
  foPositions.forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.arc(fx, fy, foR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#CC1111';
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const nzOX = RINK.w * 0.076;
  [
    [RINK.cx - nzOX, RINK.cy - foOY], [RINK.cx - nzOX, RINK.cy + foOY],
    [RINK.cx + nzOX, RINK.cy - foOY], [RINK.cx + nzOX, RINK.cy + foOY],
  ].forEach(([nx, ny]) => {
    ctx.fillStyle = '#CC1111';
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const creaseR = RINK.h * 0.13;
  ctx.fillStyle   = 'rgba(60, 140, 230, 0.25)';
  ctx.strokeStyle = '#2244CC';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.arc(GL1, RINK.cy, creaseR, 3 * Math.PI / 2, Math.PI / 2, false);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.arc(GL2, RINK.cy, creaseR, Math.PI / 2, 3 * Math.PI / 2, false);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(140,140,140,0.65)';
  ctx.fillRect(LNET.x, LNET.y, LNET.w, LNET.h);
  ctx.fillRect(RNET.x, RNET.y, RNET.w, RNET.h);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(LNET.x, LNET.y, LNET.w, LNET.h);
  ctx.strokeRect(RNET.x, RNET.y, RNET.w, RNET.h);

  ctx.restore();

  rinkPath();
  ctx.strokeStyle = '#222266';
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.strokeStyle = '#EE2222';
  ctx.lineWidth = 4;
  [[GL1, LNET], [GL2, RNET]].forEach(([gx, net]) => {
    ctx.beginPath();
    ctx.moveTo(gx, net.y);
    ctx.lineTo(gx, net.y + net.h);
    ctx.stroke();
  });
}

// ── Logo preloading ────────────────────────────────────────────────────────────
const _LB  = 'https://raw.githubusercontent.com/MLBAMGames/nhl_teams_logo_svg/master/light/';
const _CDN = 'https://assets.nhle.com/logos/nhl/svg/';

const _MLBAM = {
  BOS:'bos', BUF:'buf', DET:'det', FLA:'fla', MTL:'mtl', OTT:'ott',
  TBL:'tbl', TOR:'tor', CAR:'car', CBJ:'cbj', NJD:'njd', NYI:'nyi',
  NYR:'nyr', PHI:'phi', PIT:'pit', WSH:'wsh', CHI:'chi', COL:'col',
  DAL:'dal', MIN:'min', NSH:'nsh', STL:'stl', WPG:'wng', ANA:'ana',
  CGY:'cgy', EDM:'edm', LAK:'lak', SJS:'sjs', VAN:'van', VGK:'vgk',
};

const LOGOS = {};

(function preloadLogos() {
  Object.entries(_MLBAM).forEach(([abbr, file]) => {
    const img = new Image();
    img.onload  = () => { LOGOS[abbr] = img; };
    img.onerror = () => { LOGOS[abbr] = null; };
    img.src = _LB + file + '_l.svg';
  });
  ['SEA', 'UTA'].forEach(abbr => {
    const img = new Image();
    img.onload  = () => { LOGOS[abbr] = img; };
    img.onerror = () => { LOGOS[abbr] = null; };
    img.src = _CDN + abbr + '_light.svg';
  });
}());

function drawCenterIceLogo() {
  if (game.homeTeam === null) return;
  const team = TEAMS[game.homeTeam];
  const r    = Math.round(RINK.h * 0.188);
  const cx   = RINK.cx;
  const cy   = RINK.cy;
  const logo = LOGOS[team.abbr];

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (logo) {
    ctx.drawImage(logo, cx - r, cy - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = team.primary;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    const sh = r * 0.21;
    ctx.fillStyle = team.secondary;
    ctx.fillRect(cx - r, cy - sh * 2.1, r * 2, sh);
    ctx.fillRect(cx - r, cy + sh * 1.1, r * 2, sh);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  if (!logo) {
    const fs = Math.round(r * 0.38);
    ctx.font         = fs + 'px "Press Start 2P"';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = 'rgba(0,0,0,0.5)';
    ctx.fillText(team.abbr, cx + 2, cy + 3);
    ctx.fillStyle    = team.textColor;
    ctx.fillText(team.abbr, cx, cy);
  }
}
