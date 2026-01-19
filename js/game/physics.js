/**
 * Física tipo "derrape" para Matter (Phaser Matter).
 * Mantiene el mismo feeling que la versión Arcade: control directo de velocidad
 * y reducción progresiva de la componente lateral.
 */
export function updateCarPhysics(sprite, state, dt){
  // dt en segundos
  const cfg = state.cfg;
const MATTER_VEL_SCALE = 0.40; // Sube/baja este número para afinar
  // 1) Aceleración / freno (en eje forward)
  const forward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation));

  // Componentes de velocidad
const v = new Phaser.Math.Vector2(
  sprite.body.velocity.x,
  sprite.body.velocity.y
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

  // Drag
  if (!accel && !brake) {
    const sign = Math.sign(targetForwardMag);
    const dec = cfg.coast * dt;
    const mag = Math.max(0, Math.abs(targetForwardMag) - dec);
    targetForwardMag = mag * sign;
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

  // En Matter, la API de Phaser es setVelocity (no body.setVelocity).
  if (typeof sprite.setVelocity === 'function') {
sprite.setVelocity(newV.x * MATTER_VEL_SCALE, newV.y * MATTER_VEL_SCALE);
  } else {
    // fallback defensivo: algunos objetos exponen body.velocity directamente
    sprite.body.velocity.x = newV.x * MATTER_VEL_SCALE;
sprite.body.velocity.y = newV.y * MATTER_VEL_SCALE;
  }
}
