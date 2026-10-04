// levels.js — Definición de niveles
// Cada nivel tiene: grid, start, lights, maxPerSlot
export const LEVELS = [
  {
    id: 1,
    name: 'level.1.name',
    grid: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    start: { x: 1, y: 2, dir: 'N' },
    lights: [{ x: 1, y: 0 }],
    maxPerSlot: 6
  }
];
