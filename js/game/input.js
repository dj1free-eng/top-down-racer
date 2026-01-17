/**
 * Input táctil por botones (dos esquinas).
 * - Usa Pointer Events
 * - Soporta multitouch
 */
export function createTouchControls(){
  const map = {
    left:false,
    right:false,
    accel:false,
    brake:false
  };

  const bind = (id, key) => {
    const el = document.getElementById(id);
    if(!el) return;

    const setDown = (down) => {
      map[key] = down;
      el.classList.toggle('is-down', down);
    };

    // Pointer events -> multitouch ok
    el.addEventListener('pointerdown', (e)=>{
      e.preventDefault();
      el.setPointerCapture?.(e.pointerId);
      setDown(true);
    }, {passive:false});

    const up = (e)=>{
      e.preventDefault();
      setDown(false);
      try{ el.releasePointerCapture?.(e.pointerId); }catch(_){/*ignore*/}
    };

    el.addEventListener('pointerup', up, {passive:false});
    el.addEventListener('pointercancel', up, {passive:false});
    el.addEventListener('pointerleave', (e)=>{
      // Si sale sin soltar, no lo apagamos forzosamente; pointercapture ya se encarga.
      // Pero por si algún navegador falla:
      if(!e.buttons) setDown(false);
    }, {passive:false});
  };

  bind('btnLeft', 'left');
  bind('btnRight', 'right');
  bind('btnAccel', 'accel');
  bind('btnBrake', 'brake');

  return map;
}
