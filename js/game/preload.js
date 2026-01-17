export default class PreloadScene extends Phaser.Scene {
  constructor(){ super('preload'); }

  preload(){
    // MVP: generamos texturas en runtime, sin assets.
    // Si luego quieres sprites, aquí se cargan.

    const w = this.scale.width;
    const h = this.scale.height;

    const bar = this.add.rectangle(w/2, h/2, Math.min(420, w*0.7), 14, 0xffffff, 0.15).setOrigin(0.5);
    const fill = this.add.rectangle(bar.x - bar.width/2, bar.y, 0, bar.height, 0xffffff, 0.55).setOrigin(0,0.5);

    this.load.on('progress', (p)=>{
      fill.width = bar.width * p;
    });
  }

  create(){
    // Textura del coche (simple)
    const g = this.add.graphics();
    g.fillStyle(0x3b82f6, 1);
    g.fillRoundedRect(0,0,34,18,6);
    g.lineStyle(2, 0x0b1020, 0.7);
    g.strokeRoundedRect(0,0,34,18,6);
    g.fillStyle(0xffffff, 0.35);
    g.fillRoundedRect(6,4,22,6,4);
    g.generateTexture('car', 34, 18);
    g.destroy();

    // Textura asfalto
    const t = this.add.graphics();
    t.fillStyle(0x2b2f3a, 1);
    t.fillRect(0,0,128,128);
    t.fillStyle(0xffffff, 0.06);
    for(let i=0;i<10;i++){
      t.fillCircle(Phaser.Math.Between(0,127), Phaser.Math.Between(0,127), Phaser.Math.Between(1,2));
    }
    t.generateTexture('asphalt', 128, 128);
    t.destroy();

    this.scene.start('play');
  }
}
