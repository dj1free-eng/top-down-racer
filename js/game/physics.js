/**
 * Física tipo "derrape" para Matter (Phaser Matter).
 * Mantiene el mismo feeling que la versión Arcade: control directo de velocidad
 * y reducción progresiva de la componente lateral.
 */
export function updateCarPhysics(sprite, state, dt){
  // dt en segundos
  const cfg = state.cfg;

  // 1) Aceleración / freno (en eje forward)
  const forward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation));

  // Componentes de velocidad
// Matter usa velocity "por tick" (aprox 60Hz). Convertimos a px/seg para que tu cfg siga teniendo sentido.
const STEP = 1 / 60;
const v = new Phaser.Math.Vector2(
  sprite.body.velocity.x / STEP,
  sprite.body.velocity.y / STEP
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
  if (accel) targetForwardMag += cfg.accel * dt;
  if (brake) targetForwardMag -= cfg.brake * dt;

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
    sprite.setVelocity(newV.x, newV.y);
  } else {
    // fallback defensivo: algunos objetos exponen body.velocity directamente
    sprite.body.velocity.x = newV.x;
    sprite.body.velocity.y = newV.y;
  }
}
