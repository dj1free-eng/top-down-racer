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
  // ==========================
  // 1) CHICANE SUAVE (más abierta)
  // ==========================
  [900, 150, 110, 70],   // isla 1
  [1180, 255, 110, 70],  // isla 2 (más separada)

  // ==========================
  // 2) HORQUILLA JUGABLE (sin “embudo” imposible)
  // Antes había dos bloques que casi cerraban el carril: ahora los separo y los hago más pequeños
  // ==========================
  [1600, 125, 160, 110], // isla superior derecha (más compacta)
  [1780, 310, 120, 70],  // isla secundaria (más abajo y más pequeña)

  // ==========================
  // 3) RECTA DERECHA (pellizco suave)
  // ==========================
  [1860, 620, 110, 90],

  // ==========================
  // 4) ZONA ABAJO (ligera variación, no molesta)
  // ==========================
  [1080, 1160, 140, 70],
]
    ,

  // Obstáculos inclinados (líneas) -> el loader los convierte en “escalera” de rectángulos
  // Formato: [x1, y1, x2, y2, thickness, step]
  // - thickness: grosor del muro (px)
  // - step: distancia entre bloques (px). Menor = más suave, más coste.
  slanted: [
    // Ejemplo (BORRA o edita):
    // [600, 240, 820, 380, 24, 16],
  ]
};
