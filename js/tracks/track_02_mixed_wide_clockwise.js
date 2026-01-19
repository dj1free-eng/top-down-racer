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

// =========================
// CIRCUITO PRO – FLOW EDITION
// =========================

obstacles: [
  // Islas suaves (NUNCA frontales)
  // Solo para dividir trazadas, no para bloquear
  [1040, 520, 100, 100],
  [1640, 780, 100, 100],
],

// Diagonales = guías de trayectoria
// Formato: [x1, y1, x2, y2, thickness, step]
slanted: [
  // ===== ZONA SUPERIOR – S RÁPIDA =====
  // Te saca de la recta y te recoloca
  [620, 120, 1180, 260, 18, 8],
  [1180, 260, 1700, 140, 18, 8],

  // ===== PRE-CURVA DERECHA – PREPARACIÓN =====
  // Obliga a abrir gas con control
  [1820, 220, 2020, 420, 18, 8],

  // ===== LATERAL DERECHO – S ABIERTA =====
  // Flujo continuo, nunca encierra
  [2040, 520, 1860, 720, 18, 8],
  [1860, 860, 2060, 1040, 18, 8],

  // ===== ZONA INFERIOR – DIAGONAL DE VELOCIDAD =====
  // Mantiene ritmo, no castiga
  [700, 1180, 1700, 1320, 18, 8],

  // ===== ENTRADA A META – AJUSTE FINO =====
  // Te coloca bonito para la recta
  [520, 820, 760, 640, 16, 8],
]
};
