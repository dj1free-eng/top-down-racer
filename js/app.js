import BootScene from './game/boot.js';
import PreloadScene from './game/preload.js';
import PlayScene from './game/play.js';

function showToast(msg){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> el.classList.add('hidden'), 1400);
}

// Registrar SW (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try{
      await navigator.serviceWorker.register('./sw.js');
      showToast('PWA lista');
    }catch(e){
      // sin drama
      console.warn('SW error', e);
    }
  });
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#070913',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
  default: 'matter',
  matter: {
    debug: false
  }
},
  scene: [BootScene, PreloadScene, PlayScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
