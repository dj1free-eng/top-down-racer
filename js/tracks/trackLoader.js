export function buildTrack(scene, track){
  // 1) Muros
  for (const [x,y,w,h] of track.walls) {
    scene._addWallRect(x, y, w, h);
  }

  // 2) Obstáculos (si existen)
  for (const [x,y,w,h] of (track.obstacles || [])) {
    scene._addWallRect(x, y, w, h);
  }
}
