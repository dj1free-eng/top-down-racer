/**
 * Física tipo "derrape" para Matter (Phaser Matter).
 * Mantiene el mismo feeling que la versión Arcade: control directo de velocidad
 * y reducción progresiva de la componente lateral.
 */
export function updateCarPhysics(sprite, state, dt){
  // dt en segundos
  const cfg = state.cfg;
const MATTER_VEL_SCALE = 0.45;      // tu dial (ya lo estabas tocando)
const RESPONSE = 8;                // cuanto mayor, más “arcade”; menor, más inercia
  // 1) Aceleración / freno (en eje forward)
  const forward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation));
// Matter guarda velocity "por paso". La pasamos a px/seg usando dt real.
const invDt = dt > 0 ? (1 / dt) : 60; // fallback seguro
const v = new Phaser.Math.Vector2(
  sprite.body.velocity.x * invDt,
  sprite.body.velocity.y * invDt
);

  // Proyección
  const vForwardMag = v.dot(forward);
  const vForward = forward.clone().scale(vForwardMag);
  const vLateral = v.clone().subtract(vForward);

  // Inputs
  const accel = state.input.accel ? 1 : 0;
  const brake = state.input.brake ? 1 : 0;

  // Tracción (acelera)
  let targetForwardMag = vForwardMag;

if (accel) {
  targetForwardMag += cfg.accel * dt;
}

if (brake) {
  // Si vas hacia delante, el freno SOLO frena (no permite cruzar a negativa de golpe)
  if (vForwardMag > 5) {
    targetForwardMag -= cfg.brake * dt;
    if (targetForwardMag < 0) targetForwardMag = 0; // evita que el freno sea "turbo-reversa"
  } else {
    // Si ya estás casi parado (o ya ibas hacia atrás), entonces sí: reversa suave
    const revA = (typeof cfg.reverseAccel === 'number') ? cfg.reverseAccel : cfg.accel;
    targetForwardMag -= revA * dt;
  }
}

  // Límite velocidad
  targetForwardMag = Phaser.Math.Clamp(targetForwardMag, -cfg.maxReverse, cfg.maxSpeed);

  // 2) Giro (depende de velocidad)
  const steer = (state.input.left ? -1 : 0) + (state.input.right ? 1 : 0);
  const speed01 = Phaser.Math.Clamp(Math.abs(targetForwardMag) / cfg.maxSpeed, 0, 1);
  const steerStrength = Phaser.Math.Linear(cfg.turnMin, cfg.turnMax, 1 - speed01);
  const newRot = sprite.rotation + (steer * steerStrength * dt);
  sprite.setRotation(newRot);

  // Importante en Matter: no queremos que la inercia angular “pelee” con el control.
  if (typeof sprite.setAngularVelocity === 'function') sprite.setAngularVelocity(0);

  // 3) Derrape: reducimos lateral
  const lateralDamp = Phaser.Math.Clamp(1 - (cfg.lateralFriction * dt), 0, 1);
  const newLateral = vLateral.scale(lateralDamp);

  // 4) Reconstruir velocidad
  const newForward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation)).scale(targetForwardMag);
  const newV = newForward.add(newLateral);

// Mezcla suave: mantiene inercia y permite derrape real
const t = 1 - Math.exp(-RESPONSE * dt);
const blended = v.clone().lerp(newV, t);

if (typeof sprite.setVelocity === 'function') {
// blended está en px/seg → Matter necesita por paso → multiplicamos por dt
sprite.setVelocity(
  blended.x * MATTER_VEL_SCALE * dt,
  blended.y * MATTER_VEL_SCALE * dt
);
} else {
  sprite.body.velocity.x = blended.x * MATTER_VEL_SCALE * dt;
sprite.body.velocity.y = blended.y * MATTER_VEL_SCALE * dt;
}
}
