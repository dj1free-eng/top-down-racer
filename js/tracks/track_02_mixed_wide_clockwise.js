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
    // =========================
  // KART FLOW: chicanes pegadas al borde interior (no flotantes)
  // =========================

  // Chicane superior (dos “pianos” desde el borde interior hacia fuera)
  // Se apoyan en y=360 (borde interior superior) y entran en pista sin cerrar.
  [760, 360 + 24, 260, 28],
  [1180, 360 + 24, 260, 28],

  // Chicane derecha (pianos desde el borde interior derecho hacia la izquierda)
  // Se apoyan en x=(2200-484) (borde interior derecho) y entran en pista sin cerrar.
  [2200-484 - 28, 520, 28, 220],
  [2200-484 - 28, 860, 28, 220],

  // Chicane inferior (piano desde el borde interior inferior hacia arriba)
  // Se apoya en y=(1400-384) (borde interior inferior) y entra en pista sin cerrar.
  [980, 1400-384 - 28, 360, 28],
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
