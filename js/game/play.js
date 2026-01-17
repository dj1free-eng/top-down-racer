import { createTouchControls } from './input.js';
import { updateCarPhysics } from './physics.js';
import { setHud } from './ui.js';

export default class PlayScene extends Phaser.Scene {
  constructor(){ super('play'); }

  create(){
    // Mundo
    this.worldW = 2200;
    this.worldH = 1400;
    this.physics.world.setBounds(0,0,this.worldW,this.worldH);

    // Fondo asfalto (tileSprite)
    const bg = this.add.tileSprite(0,0,this.worldW,this.worldH,'asphalt').setOrigin(0);

    // Bordes (colliders invisibles) + un circuito simple tipo "óvalo" con paredes
    this.walls = this.physics.add.staticGroup();

    // Pared exterior
    this._addWallRect(80, 80, this.worldW-160, 24);
    this._addWallRect(80, this.worldH-104, this.worldW-160, 24);
    this._addWallRect(80, 80, 24, this.worldH-160);
    this._addWallRect(this.worldW-104, 80, 24, this.worldH-160);

    // Pared interior (simula un circuito)
    this._addWallRect(460, 360, this.worldW-920, 24);
    this._addWallRect(460, this.worldH-384, this.worldW-920, 24);
    this._addWallRect(460, 360, 24, this.worldH-744);
    this._addWallRect(this.worldW-484, 360, 24, this.worldH-744);

// Decoración: "piano" de salida/meta (CRUZANDO la pista en la recta izquierda)
const outerLeftInnerEdge = 80 + 24;   // x=104 (borde interior de la pared exterior izquierda)
const innerLeftWallX = 460;           // x=460 (pared interior izquierda)
const trackCenterX = (outerLeftInnerEdge + innerLeftWallX) / 2; // centro del carril
const trackWidth = (innerLeftWallX - outerLeftInnerEdge);       // ancho del carril

this.finishLine = this.add.rectangle(trackCenterX, this.worldH/2, trackWidth, 18, 0xffffff, 0.25);
this.finishLine.setStrokeStyle(2, 0xffffff, 0.35);

// Trigger de meta (sensor) — un poco más alto para detectar bien
this.finishSensor = this.add.zone(trackCenterX, this.worldH/2, trackWidth + 40, 44);
this.physics.world.enable(this.finishSensor);
this.finishSensor.body.setAllowGravity(false);
this.finishSensor.body.setImmovable(true);
    
    // Coche
    this.car = this.physics.add.sprite(320, this.worldH/2, 'car');
    this.car.setDamping(false);
    this.car.setDrag(0,0);
    this.car.setMaxVelocity(9999);
    this.car.setCollideWorldBounds(true);
    this.car.setBounce(0.2);
    this.car.rotation = 0;

    // Colisiones
    this.physics.add.collider(this.car, this.walls);
// Checkpoint (sensor) en la recta derecha (opuesta a meta)
// PERPENDICULAR a la recta: línea horizontal cruzando el carril

// Borde interior de la pared exterior derecha (donde empieza el asfalto)
const outerRightInnerEdge = (this.worldW - 104) - 24; // = worldW - 128

// Borde interior de la pared interior derecha (donde empieza el asfalto)
// pared interior derecha: x=(worldW-484), ancho 24  => borde interior (lado derecho) = +24
const innerRightWallRightEdge = (this.worldW - 484) + 24;

const trackWidth_R = outerRightInnerEdge - innerRightWallRightEdge;
const cpX = (outerRightInnerEdge + innerRightWallRightEdge) / 2;
const cpY = this.worldH / 2;

// Línea checkpoint fina y negra (cruzando TODO el carril)
this.checkpointLine = this.add.rectangle(cpX, cpY, trackWidth_R, 4, 0x000000, 0.60);
this.checkpointLine.setDepth(10); // por encima de paredes para que no se “tape”

// Sensor checkpoint (más alto para detectar bien, pero sin ser una franja visual)
this.checkpointSensor = this.add.zone(cpX, cpY, trackWidth_R + 40, 44);
this.physics.world.enable(this.checkpointSensor);
this.checkpointSensor.body.setAllowGravity(false);
this.checkpointSensor.body.setImmovable(true);

// Overlap checkpoint: OK solo si se pasa en sentido correcto.
// En sentido horario, en la recta derecha vas HACIA ABAJO => vy positiva
this.physics.add.overlap(this.car, this.checkpointSensor, ()=>{
  const vy = this.car.body.velocity.y;
  if (vy < 60) return;      // si no va hacia abajo con fuerza, no vale
  this._checkpointOK = true;
});
// Overlap meta
this.lap = 1;
this.lapsTotal = 4;
this._canCountLap = true;

// Checkpoint: debe pasar por aquí antes de contar vuelta en meta
this._checkpointOK = false;

    this.physics.add.overlap(this.car, this.finishSensor, ()=>{
      // Para evitar contar vueltas "vibrando" encima: gate por salida
      if(!this._canCountLap) return;

// Validación simple: solo cuenta si hay cruce "vertical" con cierta velocidad
const vy = this.car.body.velocity.y;
if (Math.abs(vy) < 60) return;
      // Solo cuenta si antes pasaste por el checkpoint
if(!this._checkpointOK) return;

      if (this.lap < this.lapsTotal) {
        this.lap += 1;
} else {
  // FIN de carrera: congelar y mostrar resultado
  this.finalTimeMs = (this.time.now - this.startTime);
  this.raceFinished = true;
  this._showRaceEnd(this.finalTimeMs);

  // Parar coche
  this.car.body.setVelocity(0,0);

  return;
}
      // Consumimos el checkpoint: para la siguiente vuelta hay que volver a pasarlo
this._checkpointOK = false;
      this._canCountLap = false;
      this.time.delayedCall(600, ()=>{ this._canCountLap = true; });
    });

    // Cámara
    this.cameras.main.setBounds(0,0,this.worldW,this.worldH);
    this.cameras.main.startFollow(this.car, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.1);

    // Input táctil
    this.inputState = createTouchControls();

    // Config de física
    this.state = {
      input: this.inputState,
      cfg: {
        maxSpeed: 520,
        maxReverse: 220,
        accel: 720,
        brake: 980,
        coast: 420,
        lateralFriction: 4.8,
        turnMax: 3.2,  // rad/s a baja velocidad
        turnMin: 1.35  // rad/s a alta velocidad
      }
    };

    // Timer
    this.startTime = this.time.now;
this.raceFinished = false;
this.finalTimeMs = 0;
    // HUD init
    setHud({lap:this.lap, lapsTotal:this.lapsTotal, timeMs:0});

    // Soporte teclado (por si pruebas en PC, no estorba)
    this.keys = this.input.keyboard?.addKeys('LEFT,RIGHT,UP,DOWN');
// UI overlay fin de carrera
this._raceEndEl = document.getElementById('raceEnd');
this._raceEndTimeEl = document.getElementById('raceEndTime');

const btnRestart = document.getElementById('btnRestart');
if (btnRestart) btnRestart.addEventListener('click', ()=> this._restartRace());

const btnClose = document.getElementById('btnCloseOverlay');
if (btnClose) btnClose.addEventListener('click', ()=> this._hideRaceEnd());
    // Pequeño tutorial en consola
    // eslint-disable-next-line no-console
    console.log('Controles: izq/der, acelerar/frenar (táctil). Teclado: flechas.');
  }

  update(time, delta){
    const dt = delta / 1000;
if (this.raceFinished) {
  // Mantener HUD con tiempo final
  setHud({lap:this.lap, lapsTotal:this.lapsTotal, timeMs: this.finalTimeMs});
  return;
}
// Mezcla limpia: táctil OR teclado (sin ensuciar el estado táctil)
const input = this.state.input;

const kLeft  = !!(this.keys && this.keys.LEFT.isDown);
const kRight = !!(this.keys && this.keys.RIGHT.isDown);
const kUp    = !!(this.keys && this.keys.UP.isDown);
const kDown  = !!(this.keys && this.keys.DOWN.isDown);

input.left  = input.left  || kLeft;
input.right = input.right || kRight;
input.accel = input.accel || kUp;
input.brake = input.brake || kDown;

    updateCarPhysics(this.car, this.state, dt);

    // HUD
    const timeMs = time - this.startTime;
    setHud({lap:this.lap, lapsTotal:this.lapsTotal, timeMs});

    // Marcas de derrape (MVP visual) cuando hay velocidad + giro
    const speed = this.car.body.velocity.length();
    const steering = (this.inputState.left ? 1 : 0) + (this.inputState.right ? 1 : 0);
    if (speed > 260 && steering) {
      this._emitSkid();
    }

    _showRaceEnd(timeMs){
  if (!this._raceEndEl || !this._raceEndTimeEl) return;

  this._raceEndTimeEl.textContent = `Tiempo: ${this._formatMs(timeMs)}`;
  this._raceEndEl.classList.remove('hidden');
  this._raceEndEl.setAttribute('aria-hidden', 'false');
}

_hideRaceEnd(){
  if (!this._raceEndEl) return;
  this._raceEndEl.classList.add('hidden');
  this._raceEndEl.setAttribute('aria-hidden', 'true');
}

_restartRace(){
  // Reset lógico
  this.raceFinished = false;
  this.finalTimeMs = 0;

  // Reset vueltas
  this.lap = 1;
  this._canCountLap = true;
  this._checkpointOK = false;

  // Reset tiempo
  this.startTime = this.time.now;

  // Reset coche a salida (ajusta si quieres otra posición)
  this.car.setPosition(320, this.worldH/2);
  this.car.setVelocity(0,0);
  this.car.rotation = 0;

  // Ocultar overlay
  this._hideRaceEnd();
}

_formatMs(ms){
  const total = Math.max(0, Math.floor(ms));
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const t = total % 1000;

  const mm = String(m).padStart(2,'0');
  const ss = String(s).padStart(2,'0');
  const tt = String(t).padStart(3,'0');
  return `${mm}:${ss}.${tt}`;
}
  }

  _addWallRect(x, y, w, h){
    const r = this.add.rectangle(x + w/2, y + h/2, w, h, 0xff6a00, 0.12);
    r.setStrokeStyle(2, 0xff6a00, 0.22);
    this.walls.add(r);
    this.physics.add.existing(r, true);
  }

  _emitSkid(){
    if (!this._skidG) {
      this._skidG = this.add.graphics();
      this._skidG.setDepth(2);
    }

    // draw small marks behind car
    const back = new Phaser.Math.Vector2(
      Math.cos(this.car.rotation + Math.PI),
      Math.sin(this.car.rotation + Math.PI)
    );
    const p = new Phaser.Math.Vector2(this.car.x, this.car.y).add(back.scale(14));

    this._skidG.fillStyle(0x000000, 0.20);
    this._skidG.fillRect(p.x - 2, p.y - 2, 4, 4);

    // fade out cheaply
    this._skidG.alpha = Math.max(0.15, this._skidG.alpha - 0.0008);
  }
}
