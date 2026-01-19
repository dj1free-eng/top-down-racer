// Track 02 — Kart Flow (clockwise)
// Pista esculpida por muros, sin obstáculos internos

export const track02 = {
  id: 'track02',
  name: 'Kart Flow',

walls: [
  // =========================
  // MURO EXTERIOR (rectángulo completo)
  // =========================
  [0, 0, 2304, 20],       // top
  [0, 1296, 2304, 20],    // bottom
  [0, 0, 20, 1296],       // left
  [2284, 0, 20, 1296],    // right

  // =========================
  // ISLA INTERIOR (rectángulo limpio y continuo)
  // Esto crea una pista tipo "kart ring" perfecta para empezar.
  // =========================
  [420, 240, 1460, 20],   // inner top
  [420, 1060, 1460, 20],  // inner bottom
  [420, 240, 20, 840],    // inner left
  [1860, 240, 20, 840],   // inner right
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
