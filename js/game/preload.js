export default class PreloadScene extends Phaser.Scene {
  constructor(){
    super('preload');
  }

  preload(){
    // MVP: generamos texturas en runtime, sin assets.
    // Si luego quieres sprites, aqui se cargan.

    const w = this.scale.width;
    const h = this.scale.height;

    const bar = this.add
      .rectangle(w / 2, h / 2, Math.min(420, w * 0.7), 14, 0xffffff, 0.15)
      .setOrigin(0.5);

    const fill = this.add
      .rectangle(bar.x - bar.width / 2, bar.y, 0, bar.height, 0xffffff, 0.55)
      .setOrigin(0, 0.5);

    this.load.on('progress', (p) => {
      fill.width = bar.width * p;
    });
  }

  create(){
    // Textura del coche (AGRESIVO, con morro estrecho y trasera ancha)
    const g = this.add.graphics();

    // Mantengo dimensiones para no cambiar físicas/colisiones
    const W = 34;
    const H = 18;

    // Helpers
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // =========================
    // 1) Sombra (ligeramente hacia la trasera)
    // =========================
    g.fillStyle(0x000000, 0.26);
    g.fillRoundedRect(1, 2, W - 2, H - 3, 7);

    // =========================
    // 2) Silueta agresiva (trapezoide: trasera ancha -> morro estrecho)
    // Frente = DERECHA (x crece)
    // =========================
    const bodyPts = [
      { x: 2,  y: 2  },  // trasera-top
      { x: 20, y: 2  },  // hombro-top
      { x: 33, y: 6  },  // morro-top (estrecho)
      { x: 33, y: 12 },  // morro-bottom
      { x: 20, y: 16 },  // hombro-bottom
      { x: 2,  y: 16 }   // trasera-bottom
    ];

    // Carrocería base
    g.fillStyle(0x2563eb, 1);
    g.fillPoints(bodyPts, true);

    // Oscurecer trasera para “peso”
    g.fillStyle(0x0b1020, 0.16);
    g.fillRoundedRect(0, 3, 10, H - 6, 6);

    // =========================
    // 3) Spoiler / bumper trasero (muy reconocible)
    // =========================
    g.fillStyle(0x0b1020, 0.78);
    g.fillRoundedRect(0, 4, 5, H - 8, 4);

    // Pilotos traseros (dos puntitos rojos)
    g.fillStyle(0xff3b3b, 0.85);
    g.fillRect(1, 5, 2, 2);
    g.fillRect(1, H - 7, 2, 2);

    // =========================
    // 4) Capó / línea central (ayuda a leer dirección)
    // =========================
    // Línea central hacia el morro
    g.fillStyle(0xffffff, 0.10);
    g.fillRoundedRect(10, 8, 18, 2, 2);

    // Highlight superior tipo “luz”
    g.fillStyle(0xffffff, 0.14);
    g.fillRoundedRect(8, 3, 18, 4, 4);

    // =========================
    // 5) Parabrisas/cabina inclinada (más agresivo)
    // =========================
    g.fillStyle(0xffffff, 0.26);
    const cabPts = [
      { x: 11, y: 5 },
      { x: 21, y: 5 },
      { x: 25, y: 9 },
      { x: 21, y: 13 },
      { x: 11, y: 13 }
    ];
    g.fillPoints(cabPts, true);

    // =========================
    // 6) Ruedas (más “arcade”: grandes detrás, más pequeñas delante)
    // =========================
    g.fillStyle(0x0b1020, 0.90);

    // Delanteras (cerca del morro)
    g.fillRoundedRect(22, 2, 7, 4, 2);       // delantera arriba
    g.fillRoundedRect(22, H - 6, 7, 4, 2);   // delantera abajo

    // Traseras (más “gordas” para sensación de tracción)
    g.fillRoundedRect(5, 1, 8, 5, 2);        // trasera arriba
    g.fillRoundedRect(5, H - 6, 8, 5, 2);    // trasera abajo

    // =========================
    // 7) Faros delanteros (FRONT CLARO)
    // =========================
    g.fillStyle(0xfff1a8, 0.65);
    g.fillRect(W - 2, 6, 2, 2);
    g.fillRect(W - 2, H - 8, 2, 2);

    // Mini “splitter” frontal oscuro (más agresivo)
    g.fillStyle(0x0b1020, 0.55);
    g.fillRect(W - 3, 8, 1, 2);

    // =========================
    // 8) Contorno para separar del fondo
    // =========================
    g.lineStyle(2, 0x0b1020, 0.80);
    g.strokePoints(bodyPts, true);

    // Generar textura final
    g.generateTexture('car', W, H);
    g.destroy();

    // =========================
    // Textura asfalto
    // =========================
    const t = this.add.graphics();
    t.fillStyle(0x2b2f3a, 1);
    t.fillRect(0, 0, 128, 128);
    t.fillStyle(0xffffff, 0.06);
    for (let i = 0; i < 10; i++) {
      t.fillCircle(
        Phaser.Math.Between(0, 127),
        Phaser.Math.Between(0, 127),
        Phaser.Math.Between(1, 2)
      );
    }
    t.generateTexture('asphalt', 128, 128);
    t.destroy();

    this.scene.start('play');
  }
}
