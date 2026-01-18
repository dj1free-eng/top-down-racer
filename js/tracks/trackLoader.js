function addRect(scene, x, y, w, h){
  scene._addWallRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Convierte una línea inclinada en una “escalera” de rectángulos Arcade (AABB)
// slanted item: [x1, y1, x2, y2, thickness, step]
function addSlanted(scene, seg){
  const x1 = seg[0], y1 = seg[1], x2 = seg[2], y2 = seg[3];
  const thickness = (seg[4] ?? 24);
  const step = (seg[5] ?? Math.max(8, Math.floor(thickness * 0.75)));

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  if (!dist || dist < 1) return;

  const n = Math.max(1, Math.ceil(dist / step));

  // Usamos “bloques” cuadrados (thickness x thickness).
  // Es lo más estable con Arcade: el coche “nota” la diagonal de forma progresiva.
  const size = thickness;

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;

    // top-left para tu formato [x,y,w,h]
    const x = cx - size / 2;
    const y = cy - size / 2;

    addRect(scene, x, y, size, size);
  }
}

export function buildTrack(scene, track){
  // 1) Muros base
  for (const [x,y,w,h] of track.walls) {
    addRect(scene, x, y, w, h);
  }

  // 2) Obstáculos rectos (si existen)
  for (const [x,y,w,h] of (track.obstacles || [])) {
    addRect(scene, x, y, w, h);
  }

  // 3) Obstáculos inclinados (si existen)
  for (const seg of (track.slanted || [])) {
    addSlanted(scene, seg);
  }
}
