/**
 * Física arcade "derrape" simple.
 * Devuelve velocidad deseada en función de inputs.
 */
export function updateCarPhysics(sprite, state, dt){
  // dt en segundos
  const cfg = state.cfg;

  // 1) Aceleración / freno (en eje forward)
  const forward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation));

  // Componentes de velocidad
  const v = new Phaser.Math.Vector2(sprite.body.velocity.x, sprite.body.velocity.y);

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
  sprite.rotation += steer * steerStrength * dt;

  // 3) Derrape: reducimos lateral
  const lateralDamp = Phaser.Math.Clamp(1 - (cfg.lateralFriction * dt), 0, 1);
  const newLateral = vLateral.scale(lateralDamp);

  // 4) Reconstruir velocidad
  const newForward = new Phaser.Math.Vector2(Math.cos(sprite.rotation), Math.sin(sprite.rotation)).scale(targetForwardMag);
  const newV = newForward.add(newLateral);

  sprite.body.setVelocity(newV.x, newV.y);
}
