// CPU puck-chase AI — uncontrolled non-goalie skaters pursue the puck

const CPU_CHASE_SPD = 3.8;  // pre-friction; net ≈ 3.15 px/frame after FRICTION

function updateCPUSkaters() {
  if (game.state !== 'playing') return;
  players.forEach(p => {
    if (p.controlled || p.isGoalie) return;
    const dx = puck.x - p.x;
    const dy = puck.y - p.y;
    const d  = Math.hypot(dx, dy);
    if (d < 12) return;
    p.vx = (dx / d) * CPU_CHASE_SPD;
    p.vy = (dy / d) * CPU_CHASE_SPD;
    p.dir = Math.atan2(dy, dx);
  });
}

// Run before existing updatePlayers so friction + position are applied normally
const _prevUP17 = updatePlayers;
updatePlayers = function() {
  updateCPUSkaters();
  _prevUP17();
};
