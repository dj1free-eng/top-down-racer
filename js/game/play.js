import { createTouchControls } from './input.js';
import { updateCarPhysics } from './physics.js';
import { setHud } from './ui.js';

import { track01 } from '../tracks/track_01_basic_speed.js';
import { track02 } from '../tracks/track_02_mixed_wide_clockwise.js';
import { buildTrack } from '../tracks/trackLoader.js';export default class PlayScene extends Phaser.Scene {
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

// Circuito (datos)
this.track = track02;

// Muros del circuito
buildTrack(this, this.track);
    
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
    // Coche — posición de salida (antes de meta, mirando hacia ARRIBA)
const startX = trackCenterX;
const startY = this.worldH/2 + 120; // un poco antes de la meta

this.car = this.physics.add.sprite(startX, startY, 'car');
this.car.setDamping(false);
this.car.setDrag(0,0);
this.car.setMaxVelocity(9999);
this.car.setCollideWorldBounds(true);
this.car.setBounce(0.2);

// Mirando hacia arriba (−90°)
this.car.rotation = -Math.PI / 2;

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
 if (!this.raceStarted) return;
  const vy = this.car.body.velocity.y;
  if (vy < 60) return;

  // Sector 1: meta -> checkpoint
  const now = this.time.now;

  // Evitar doble registro si te quedas encima del sensor
  if (!this._checkpointOK) {
    this.lastCheckpointTime = now;

    // Guardamos S1 temporalmente en la vuelta actual
    this._currentS1 = now - this.lapStartTime;
  }

  this._checkpointOK = true;
});
// Overlap meta
this.lap = 0;              // aún no estamos en vuelta
this.lapsTotal = 4;
this._canCountLap = true;

// Checkpoint: debe pasar por aquí antes de contar vuelta en meta
this._checkpointOK = false;
    // Timer
    this.startTime = null;      // todavía NO empieza
this.raceStarted = false;  // aún no se ha cruzado la meta
this.raceFinished = false;
this.finalTimeMs = 0;
    // Splits / sectores
this.lapStartTime = this.startTime;      // inicio de la vuelta actual
this.lastCheckpointTime = null;          // tiempo absoluto del último checkpoint
this.lapSplits = [];                     // array de {lap, s1, s2, lapTime}


    this.physics.add.overlap(this.car, this.finishSensor, ()=>{
   // ===== ARRANQUE DE CARRERA (primer cruce de meta) =====
if (!this.raceStarted) {
  const vy = this.car.body.velocity.y;

  // Solo arranca si cruza en sentido correcto (hacia arriba)
  if (vy < -60) {
    this.raceStarted = true;
    this.lap = 1;
    this.startTime = this.time.now;
    this.lapStartTime = this.startTime;

    // Gate para que no cuente dos veces
    this._canCountLap = false;
    this.time.delayedCall(600, ()=>{ this._canCountLap = true; });
  }

  // Este cruce NO cuenta como vuelta
  return;
} 
      // Para evitar contar vueltas "vibrando" encima: gate por salida
      if(!this._canCountLap) return;

// Validación simple: solo cuenta si hay cruce "vertical" con cierta velocidad
const vy = this.car.body.velocity.y;
if (Math.abs(vy) < 60) return;
      // Solo cuenta si antes pasaste por el checkpoint
if(!this._checkpointOK) return;
const now = this.time.now;

// Sector 2: checkpoint -> meta
const s2 = this.lastCheckpointTime ? (now - this.lastCheckpointTime) : 0;

// Lap time: meta -> meta
const lapTime = now - this.lapStartTime;

// Sector 1 (si no existiera por algún motivo)
const s1 = (typeof this._currentS1 === 'number') ? this._currentS1 : (lapTime - s2);

// Guardar registro de la vuelta actual
this.lapSplits.push({ lap: this.lap, s1, s2, lapTime });
      if (this.lap < this.lapsTotal) {
        this.lap += 1;
        // Preparar siguiente vuelta
this.lapStartTime = now;
this.lastCheckpointTime = null;
this._currentS1 = null;
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

    // HUD init
    setHud({lap:this.lap, lapsTotal:this.lapsTotal, timeMs:0});

    // Soporte teclado (por si pruebas en PC, no estorba)
    this.keys = this.input.keyboard?.addKeys('LEFT,RIGHT,UP,DOWN');
// UI overlay fin de carrera
this._raceEndEl = document.getElementById('raceEnd');
this._raceEndTimeEl = document.getElementById('raceEndTime');
this._raceEndDetailsEl = document.getElementById('raceEndDetails');
const btnRestart = document.getElementById('btnRestart');
if (btnRestart) {
  btnRestart.addEventListener('pointerdown', (e)=>{
    e.preventDefault();
    this._restartRace();
  }, { passive:false });

  // backup
  btnRestart.addEventListener('click', ()=> this._restartRace());
}

const btnClose = document.getElementById('btnCloseOverlay');
if (btnClose) {
  btnClose.addEventListener('pointerdown', (e)=>{
    e.preventDefault();
    this._hideRaceEnd();
  }, { passive:false });

  // backup
  btnClose.addEventListener('click', ()=> this._hideRaceEnd());
}
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
    const timeMs = this.startTime ? (time - this.startTime) : 0;
setHud({lap:this.lap, lapsTotal:this.lapsTotal, timeMs});

    // Marcas de derrape (MVP visual) cuando hay velocidad + giro
    const speed = this.car.body.velocity.length();
    const steering = (this.inputState.left ? 1 : 0) + (this.inputState.right ? 1 : 0);
    if (speed > 260 && steering) {
      this._emitSkid();
    }
  }
  _showRaceEnd(timeMs){
    if (!this._raceEndEl || !this._raceEndTimeEl) return;

    this._raceEndTimeEl.textContent = `Tiempo: ${this._formatMs(timeMs)}`;
    this._raceEndEl.classList.remove('hidden');
    this._raceEndEl.setAttribute('aria-hidden', 'false');

    // Pintar tabla de sectores y vueltas
    if (this._raceEndDetailsEl) {
      const rows = this.lapSplits
        .map(r => `<tr>
          <td>Vuelta ${r.lap}</td>
          <td>${this._formatMs(r.s1)}</td>
          <td>${this._formatMs(r.s2)}</td>
          <td><strong>${this._formatMs(r.lapTime)}</strong></td>
        </tr>`)
        .join('');

      this._raceEndDetailsEl.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Vuelta</th>
              <th>S1</th>
              <th>S2</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // Bloquear input del juego mientras el modal está abierto
    this.input.enabled = false;
    if (this.game && this.game.canvas) {
      this.game.canvas.style.pointerEvents = 'none';
    }
  }
_hideRaceEnd(){
  if (!this._raceEndEl) return;
  this._raceEndEl.classList.add('hidden');
  this._raceEndEl.setAttribute('aria-hidden', 'true');

  // Reactivar input del juego
  this.input.enabled = true;
  if (this.game && this.game.canvas) this.game.canvas.style.pointerEvents = 'auto';
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

    // Reset coche a salida
    this.car.setPosition(320, this.worldH/2);
    this.car.setVelocity(0,0);
    this.car.rotation = 0;

    // Ocultar overlay
    this._hideRaceEnd();
    this.lapSplits = [];
this.lapStartTime = this.time.now;
this.lastCheckpointTime = null;
this._currentS1 = null;
    this._checkpointOK = false;
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

  // ===== Exportar “foto” del mapa completo (PNG) =====
  _dumpMapScreenshot(){
    const cam = this.cameras.main;

    // Guardar estado actual
    const prevFollow = cam._follow;
    const prevZoom = cam.zoom;

    // Ajustar cámara al mundo completo
    cam.stopFollow();
    cam.setZoom(1);
    cam.setScroll(0, 0);

    // IMPORTANTE: poner la cámara al tamaño del mundo para capturarlo entero
    cam.setSize(this.worldW, this.worldH);

    cam.snapshot((image) => {
      const a = document.createElement('a');
      a.href = image.src;
      a.download = 'track_debug.png';
      a.click();

      // Restaurar cámara a tamaño pantalla
      cam.setSize(this.scale.width, this.scale.height);
      cam.setZoom(prevZoom);
      if (prevFollow) cam.startFollow(this.car);
    });
  }
}
