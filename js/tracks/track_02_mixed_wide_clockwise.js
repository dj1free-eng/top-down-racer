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
    // 1) CHICANE SUAVE (simula el 45° izquierda)
    // Recta superior: metemos dos islas alternadas para obligar a trazar diagonal
    // ==========================
    [860, 150, 140, 80],   // isla 1 (cerca del carril interior)
    [1120, 230, 140, 80],  // isla 2 (desplazada hacia abajo)

    // ==========================
    // 2) “HORQUILLA” JUGABLE A DERECHA (zona superior derecha)
    // Creamos un estrechamiento + isla grande que obliga a girar fuerte
    // ==========================
    [1540, 120, 220, 140], // isla grande arriba derecha (te obliga a cerrar)
    [1740, 260, 180, 90],  // segunda isla para que no sea un giro suave

    // ==========================
    // 3) SECCIÓN TÉCNICA EN RECTA DERECHA (sin estrechar demasiado)
    // Un “pellizco” que obliga a frenar un poco pero mantiene ancho general
    // ==========================
    [1840, 560, 140, 120], // isla derecha media

    // ==========================
    // 4) ZONA RÁPIDA ABAJO (dejamos más limpio para velocidad)
    // Solo una isla pequeña para que no sea autopista total
    // ==========================
    [1040, 1140, 160, 80],
  ]
};
