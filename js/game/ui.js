export function setHud({lap, lapsTotal, timeMs}){
  const lapEl = document.getElementById('hudLap');
  const timeEl = document.getElementById('hudTime');
  if(lapEl) lapEl.textContent = `Vuelta: ${lap}/${lapsTotal}`;
  if(timeEl) timeEl.textContent = formatTime(timeMs);
}

export function formatTime(ms){
  const total = Math.max(0, Math.floor(ms));
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const r = total % 1000;
  const mm = String(m).padStart(2,'0');
  const ss = String(s).padStart(2,'0');
  const rr = String(r).padStart(3,'0');
  return `${mm}:${ss}.${rr}`;
}
