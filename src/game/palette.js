// palette.js — Paleta de instrucciones
// Renderiza los botones de comandos que el usuario puede
// agregar al programa. Cada botón agrega una instrucción
// al slot activo (main, p1 o p2).

import { INSTRUCTIONS, EMOJI } from '../game/config.js';
import { gameStore } from '../game/gameState.js';

// ---- Orden y agrupación de los botones ----
// Cada grupo se renderiza en una fila separada.
const GROUPS = [
  // Fila 1: instrucciones básicas
  [INSTRUCTIONS.FORWARD, INSTRUCTIONS.LEFT, INSTRUCTIONS.RIGHT, INSTRUCTIONS.JUMP],
  // Fila 2: encender + procedimientos
  [INSTRUCTIONS.LIGHT, INSTRUCTIONS.P1, INSTRUCTIONS.P2]
];

// ---- Etiquetas accesibles (para lectores de pantalla) ----
const LABELS = {
  forward: 'Avanzar',
  left: 'Girar a la izquierda',
  right: 'Girar a la derecha',
  jump: 'Saltar',
  light: 'Encender',
  p1: 'Procedimiento 1',
  p2: 'Procedimiento 2'
};

/**
 * Renderiza la paleta completa dentro de un contenedor.
 * @param {HTMLElement} container - El elemento donde se dibuja la paleta
 */
export function renderPalette(container) {
  container.innerHTML = '';
  container.classList.add('palette');

  GROUPS.forEach((group) => {
    const row = document.createElement('div');
    row.className = 'palette-row';

    group.forEach((type) => {
      const btn = createPaletteButton(type);
      row.appendChild(btn);
    });

    container.appendChild(row);
  });
}

/**
 * Crea un botón individual de la paleta.
 */
function createPaletteButton(type) {
  const btn = document.createElement('button');
  btn.className = 'palette-btn';
  btn.dataset.type = type;
  btn.textContent = EMOJI[type];
  btn.setAttribute('aria-label', LABELS[type] || type);
  btn.setAttribute('title', LABELS[type] || type);

  btn.addEventListener('click', () => {
    gameStore.getState().addInstruction({ type });
  });

  return btn;
}

/**
 * Actualiza el estado visual de la paleta.
 * Por ahora solo deshabilita los botones de P1 y P2
 * si el nivel no los permite (fase futura).
 */
export function updatePaletteState(level) {
  const p1Btn = document.querySelector('.palette-btn[data-type="p1"]');
  const p2Btn = document.querySelector('.palette-btn[data-type="p2"]');

  const allowsProcs = level?.allowsProcedures !== false;

  if (p1Btn) p1Btn.disabled = !allowsProcs;
  if (p2Btn) p2Btn.disabled = !allowsProcs;
}