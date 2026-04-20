// Player switching — TAB (P1) / ShiftLeft or ShiftRight (P2)

// Prevent Tab and Shift from doing browser default things
document.addEventListener('keydown', e => {
  if (e.code === 'Tab' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    e.preventDefault();
  }
}, true);

function switchControl(teamIdx) {
  if (game.state !== 'playing') return;
  const nonGoalies = players.filter(p => p.team === teamIdx && !p.isGoalie);
  const ctrl = nonGoalies.find(p => p.controlled);

  // Always switch to puck carrier if a teammate holds it and they're not current
  if (puck.carrier && puck.carrier.team === teamIdx && puck.carrier !== ctrl && !puck.carrier.isGoalie) {
    nonGoalies.forEach(p => { p.controlled = false; });
    puck.carrier.controlled = true;
    return;
  }

  // Otherwise pick the non-goalie closest to the puck that isn't the current one
  const sorted = nonGoalies.slice().sort((a, b) =>
    Math.hypot(puck.x - a.x, puck.y - a.y) - Math.hypot(puck.x - b.x, puck.y - b.y)
  );
  const next = sorted.find(p => p !== ctrl);
  if (!next) return;
  nonGoalies.forEach(p => { p.controlled = false; });
  next.controlled = true;
}

const _prevKD16 = onKeyDown;
onKeyDown = function(code) {
  _prevKD16(code);
  if (code === 'Tab')                            switchControl(0);
  if (code === 'ShiftLeft' || code === 'ShiftRight') switchControl(1);
};
