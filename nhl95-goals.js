// Puck in left net  → away scores  (home defends left net)
// Puck in right net → home scores  (away defends right net)
function checkGoal() {
  if (game.state !== 'playing') return;

  const px = puck.x, py = puck.y;

  if (px >= LNET.x && px <= LNET.x + LNET.w &&
      py >= LNET.y && py <= LNET.y + LNET.h) {
    game.scores[1]++;
    game.lastGoalTeam = 1;
    game.state = 'goal';
    puck.carrier = null;
    puck.vx = 0; puck.vy = 0;
  }

  if (px >= RNET.x && px <= RNET.x + RNET.w &&
      py >= RNET.y && py <= RNET.y + RNET.h) {
    game.scores[0]++;
    game.lastGoalTeam = 0;
    game.state = 'goal';
    puck.carrier = null;
    puck.vx = 0; puck.vy = 0;
  }
}

const _prevUP13 = updatePuck;
updatePuck = function() { _prevUP13(); checkGoal(); };
