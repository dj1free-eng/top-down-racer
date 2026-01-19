export const track02 = {
  id: 'track_02_mixed_wide_clockwise',
  name: 'Kart Flow (Clockwise)',
  lapsTotal: 4,

  world: { w: 2200, h: 1400 },

  // Muros base: mismo anillo que el Track01 (ancho)
  walls: [
    // Exterior
    [80, 80, 2200-160, 24],
    [80, 1400-104, 2200-160, 24],
    [80, 80, 24, 1400-160],
    [2200-104, 80, 24, 1400-160],

    // Interior
    [460, 360, 2200-920, 24],
    [460, 1400-384, 2200-920, 24],
    [460, 360, 24, 1400-744],
    [2200-484, 360, 24, 1400-744],
  ],

  // Meta en recta izquierda (mantenemos fijo)
  finish: { y: 1400/2 },

  // Checkpoint recta derecha (fijo por ahora para evitar líos)
  checkpoint: { y: 1400/2 },

  // Salida: antes de meta y mirando hacia arriba
  start: { offsetY: +120, rotation: -Math.PI/2 },

  // Obstáculos: aquí es donde “dibujamos” el circuito a medida
  // Cada obstáculo es [x, y, w, h]
  // En este track NO usamos “bloques” rectos como obstáculos.
  // La dificultad viene de “curbs” inclinados que guían la trazada.
  obstacles: [],

  // Curbs inclinados (no cierran el carril; siempre dejan salida).
  // slanted item: [x1, y1, x2, y2, thickness, step]
  slanted: [
    // =========================
    // ZONA SUPERIOR — Chicane en V (tipo kart)
    // (dos diagonales que se encuentran, dejando hueco por arriba y por abajo)
    // =========================
    [900, 130, 1100, 250, 20, 6],
    [1300, 130, 1100, 250, 20, 6],

    // =========================
    // LATERAL DERECHO — “S” abierta
    // (primero empuja hacia el interior; luego te devuelve hacia el exterior)
    // =========================
    [2060, 420, 1880, 560, 20, 6],
    [1880, 760, 2060, 900, 20, 6],

    // =========================
    // INFERIOR — Diagonal larga de ritmo
    // =========================
    [700, 1160, 1650, 1285, 20, 6],

    // =========================
    // IZQUIERDA — Ajuste suave para que no sea “túnel”
    // =========================
    [420, 640, 220, 780, 18, 6],
  ]
};
