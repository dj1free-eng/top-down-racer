export const track02 = {
  id: 'track_02_mixed_wide_clockwise',
  name: 'Mixed Wide (Clockwise)',
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
  obstacles: [
  [1672, 308, 230, 176],
],

slanted: [
  [1179, 107, 740, 225, 24, 16],
  [1324, 110, 1930, 239, 24, 16],
  [1020, 254, 1469, 357, 24, 16],
  [2093, 258, 1859, 972, 24, 16],
  [686, 1160, 1663, 1287, 24, 16],
]
};
