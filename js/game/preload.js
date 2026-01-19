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
    // Textura del coche (mejorada, runtime)
    const g = this.add.graphics();

    // Tamano base (mantengo 34x18 para no cambiar feeling ni colisiones por defecto)
    const W = 34;
    const H = 18;

    // 1) Sombra (ligera, centrada)
    g.fillStyle(0x000000, 0.22);
    g.fillRoundedRect(2, 2, W - 2, H - 2, 7);

    // 2) Carroceria (base + highlight)
    g.fillStyle(0x2563eb, 1); // azul mas profundo
    g.fillRoundedRect(0, 0, W, H, 7);

    // Banda central (da "forma" y lectura)
    g.fillStyle(0xffffff, 0.10);
    g.fillRoundedRect(3, 7, W - 6, 4, 3);

    // Highlight superior (simula luz)
    g.fillStyle(0xffffff, 0.18);
    g.fillRoundedRect(4, 3, W - 8, 5, 4);

    // Contorno
    g.lineStyle(2, 0x0b1020, 0.75);
    g.strokeRoundedRect(0, 0, W, H, 7);

    // 3) Ventana/cabina
    g.fillStyle(0xffffff, 0.28);
    g.fillRoundedRect(9, 4, 16, 6, 4);

    // 4) Ruedas (4 puntos oscuros)
    g.fillStyle(0x0b1020, 0.85);
    g.fillRoundedRect(2, 1, 6, 4, 2); // rueda delantera izq
    g.fillRoundedRect(W - 8, 1, 6, 4, 2); // rueda delantera der
    g.fillRoundedRect(2, H - 5, 6, 4, 2); // trasera izq
    g.fillRoundedRect(W - 8, H - 5, 6, 4, 2); // trasera der

    // 5) Faros (para que se lea el "frente")
    g.fillStyle(0xfff1a8, 0.55);
    g.fillRect(W - 3, 4, 2, 2);
    g.fillRect(W - 3, H - 6, 2, 2);

    // Generar textura final
    g.generateTexture('car', W, H);
    g.destroy();

    // Textura asfalto
    const t = this.add.graphics();
    t.fillStyle(0x2b2f3a, 1);
    t.fillRect(0, 0, 128, 128);
    t.fillStyle(0xffffff, 0.06);
    for (let i = 0; i < 10; i++) {
      t.fillCircle(/* x */ Phaser.Math.Between(0, 127), /* y */ Phaser.Math.Between(0, 127), /* r */ Phaser.Math.Between(1, 2));
    }
    t.generateTexture('asphalt', 128, 128);
    t.destroy();

    this.scene.start('play');
  }
}
