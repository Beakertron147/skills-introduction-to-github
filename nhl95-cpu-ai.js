// CPU positioning AI — replaces the simple puck-chase with role-aware movement
// Overrides updateCPUSkaters defined in nhl95-cpu-chase.js

function updateCPUSkaters() {
  if (game.state !== 'playing') return;

  [0, 1].forEach(team => {
    const atkDir     = team === 0 ? 1 : -1;
    const unctrl     = players.filter(p => p.team === team && !p.isGoalie && !p.controlled);
    const carrier    = puck.carrier;

    // Support offsets when teammate carries — spread to scoring positions
    const support = [
      { dx:  95 * atkDir, dy: -62 },
      { dx:  95 * atkDir, dy:  62 },
      { dx:  30 * atkDir, dy:   0 },
      { dx: -65 * atkDir, dy:   0 },
    ];

    // Pressure offsets when opponent carries — bracket the carrier
    const pressure = [
      { dx:   0,           dy:   0 },
      { dx: -20 * atkDir,  dy: -28 },
      { dx: -20 * atkDir,  dy:  28 },
      { dx: -45 * atkDir,  dy:   0 },
    ];

    unctrl.forEach((p, i) => {
      let tx, ty;

      if (!carrier) {
        // Loose puck — everyone chases it
        tx = puck.x;
        ty = puck.y;
      } else if (carrier.team === team) {
        // Teammate has puck — spread into support positions
        const off = support[i % support.length];
        tx = puck.x + off.dx;
        ty = puck.y + off.dy;
      } else {
        // Opponent has puck — apply pressure, bracket the carrier
        const off = pressure[i % pressure.length];
        tx = carrier.x + off.dx;
        ty = carrier.y + off.dy;
      }

      const dx = tx - p.x;
      const dy = ty - p.y;
      const d  = Math.hypot(dx, dy);
      if (d < 10) return;

      // Support players move slightly slower to avoid over-running positions
      const spd = (!carrier || carrier.team !== team) ? CPU_CHASE_SPD : CPU_CHASE_SPD * 0.78;
      p.vx = (dx / d) * spd;
      p.vy = (dy / d) * spd;
      p.dir = Math.atan2(dy, dx);
    });
  });
}
