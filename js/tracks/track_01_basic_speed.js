export const track01 = {
  id: 'track_01_basic_speed',
  name: 'Basic Speed',
  lapsTotal: 4,

  // Tamaño del mundo (debe coincidir con PlayScene)
  world: { w: 2200, h: 1400 },

  // Muros: rectángulos [x, y, w, h]
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

  // Meta: se calcula igual que en tu código actual
  finish: {
    kind: 'left_straight',
    y: 1400/2
  },

  // Checkpoint (recta derecha)
  checkpoint: {
    kind: 'right_straight',
    y: 1400/2
  },

  // Salida (antes de meta, mirando hacia arriba)
  start: {
    kind: 'near_finish',
    offsetY: +120,  // más abajo que la meta
    rotation: -Math.PI/2
  },

  // Obstáculos extra (por ahora ninguno)
  obstacles: []
};
