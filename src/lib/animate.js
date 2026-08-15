export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function countUpFrames(target, steps) {
  const frames = [];
  for (let i = 1; i <= steps; i++) {
    const v = Math.round(target * easeOutCubic(i / steps));
    frames.push(v);
  }
  frames[frames.length - 1] = target;
  return frames;
}
