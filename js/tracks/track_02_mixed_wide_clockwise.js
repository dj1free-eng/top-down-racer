// Track 02 — Kart Flow (clockwise)
// Pista esculpida por muros, sin obstáculos internos

export const track02 = {
  id: 'track02',
  name: 'Kart Flow',

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
  // =========================
  // Línea de salida / meta
  // =========================
  startLine: {
    x: 120,
    y: 620,
    width: 160,
    height: 6,
    angle: 0,
  },

  direction: 'clockwise',
};
