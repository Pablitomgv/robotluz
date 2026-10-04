// levels.js — Definición de niveles
// Cada nivel tiene:
//   - id: número único
//   - name: clave de traducción
//   - grid: matriz de alturas (0 = vacío, 1 = piso, 2 = altura 2...)
//   - start: { x, y, dir } posición y dirección inicial del robot
//   - lights: array de { x, y } con las baldosas a encender
//   - maxPerSlot: máximo de instrucciones por slot (main, p1, p2)

export const LEVELS = [
  // ---- Nivel 1: introducción ----
  // El robot arranca abajo al centro, mira al Norte.
  // Hay un hueco en el centro: no puede avanzar directo.
  // Tiene que rodear: girar, avanzar, girar, avanzar, avanzar, encender.
  // La luz está arriba al centro.
  {
    id: 1,
    name: 'level.1.name',
    grid: [
      [1, 1, 1],   // fila 0 (arriba):  [piso][piso][piso]
      [1, 0, 1],   // fila 1 (medio):   [piso][hueco][piso]
      [1, 1, 1]    // fila 2 (abajo):   [piso][piso][piso]
    ],
    start: { x: 1, y: 2, dir: 'N' },   // abajo al centro, mirando arriba
    lights: [{ x: 1, y: 0 }],          // luz arriba al centro
    maxPerSlot: 8
  }

  // ---- Próximos niveles (Fase 3) ----
  // Se irán agregando acá. Ejemplos previstos:
  //
  // {
  //   id: 2,
  //   name: 'level.2.name',
  //   grid: [
  //     [1, 1, 1, 1],
  //     [1, 2, 2, 1],
  //     [1, 1, 1, 1]
  //   ],
  //   start: { x: 0, y: 0, dir: 'E' },
  //   lights: [{ x: 3, y: 1 }],
  //   maxPerSlot: 8
  // }
];

// Helper: obtener un nivel por ID
export function getLevelById(id) {
  return LEVELS.find((l) => l.id === id) || null;
}

// Helper: saber si un ID es el último nivel disponible
export function isLastLevel(id) {
  const lastLevel = LEVELS[LEVELS.length - 1];
  return lastLevel && lastLevel.id === id;
}

// Helper: obtener el siguiente ID de nivel
export function getNextLevelId(currentId) {
  const index = LEVELS.findIndex((l) => l.id === currentId);
  if (index === -1 || index === LEVELS.length - 1) return null;
  return LEVELS[index + 1].id;
}