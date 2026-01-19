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

  // Obstáculos rectos (islas).
  // IMPORTANTE: ninguno debe cerrar por completo un carril.
  obstacles: [
    // Isla superior-derecha (obliga a trazar sin tapar el paso)
    [1780, 312, 140, 140],
  ],

  // Segmentos inclinados (chicanes). Formato: [x1, y1, x2, y2, thickness, step]
  // Frente al “callejón sin salida”: evitamos diagonales que toquen el muro exterior
  // y el interior a la vez sin dejar hueco.
  slanted: [
    // ===== Chicane superior (2 diagonales + una central) =====
    // Izquierda: baja hacia la derecha (mete el coche hacia el centro)
    [700, 130, 1180, 250, 22, 12],
    // Derecha: baja hacia la izquierda (devuelve hacia el exterior)
    [1500, 130, 1980, 250, 22, 12],
    // Central: contra-diagonal suave (crea una S, pero deja hueco arriba y abajo)
    [1200, 270, 1480, 340, 20, 12],

    // ===== Lateral derecho (zig-zag SIN bloquear el carril) =====
    // Ojo: el carril derecho va entre x≈1740 (muro interior) y x≈2096 (muro exterior).
    // Estas diagonales se quedan dentro, dejando paso tanto por fuera como por dentro.
    [1980, 310, 1820, 520, 22, 12],
    [1840, 560, 2020, 770, 22, 12],

    // ===== Inferior (una diagonal larga para variar la trazada) =====
    [700, 1160, 1660, 1285, 22, 12],
  ]
};
