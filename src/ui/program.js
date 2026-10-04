// program.js — Zona de programa del usuario
// Renderiza los 3 slots (main, p1, p2) con los chips de
// instrucciones. Permite eliminar chips y cambiar de slot activo.

import { EMOJI } from '../game/config.js';
import { gameStore } from '../game/gameState.js';

// ---- Configuración de los slots ----
const SLOTS = [
  { id: 'main', label: 'main' },
  { id: 'p1',   label: 'P1'   },
  { id: 'p2',   label: 'P2'   }
];

/**
 * Renderiza la zona de programa completa dentro del contenedor.
 * @param {HTMLElement} container - El elemento donde se dibuja
 */
export function renderProgram(container) {
  container.innerHTML = '';
  container.classList.add('program');

  SLOTS.forEach((slot) => {
    const slotEl = createSlot(slot);
    container.appendChild(slotEl);
  });

  // Sincronizar con el estado actual
  syncProgram(container);
}

/**
 * Crea un slot individual con su label y sus chips.
 */
function createSlot(slot) {
  const el = document.createElement('div');
  el.className = 'program-slot';
  el.dataset.slot = slot.id;

  // Label del slot
  const label = document.createElement('div');
  label.className = 'program-slot-label';
  label.textContent = slot.label;
  el.appendChild(label);

  // Contenedor de chips
  const chips = document.createElement('div');
  chips.className = 'program-chips';
  chips.dataset.slot = slot.id;
  el.appendChild(chips);

  // Click en el slot → activarlo
  el.addEventListener('click', (event) => {
    // Si el click fue en un chip, no activar el slot
    if (event.target.classList.contains('program-chip')) return;
    gameStore.getState().setActiveSlot(slot.id);
  });

  return el;
}

/**
 * Sincroniza la vista con el estado actual.
 * Se llama cada vez que el estado cambia.
 */
export function syncProgram(container) {
  const state = gameStore.getState();
  const { program, activeSlot } = state;

  SLOTS.forEach((slot) => {
    // Actualizar clase "active" según el slot activo
    const slotEl = container.querySelector(`.program-slot[data-slot="${slot.id}"]`);
    if (slotEl) {
      slotEl.classList.toggle('active', slot.id === activeSlot);
    }

    // Re-renderizar los chips del slot
    const chipsContainer = container.querySelector(`.program-chips[data-slot="${slot.id}"]`);
    if (!chipsContainer) return;

    chipsContainer.innerHTML = '';

    program[slot.id].forEach((instr, index) => {
      const chip = createChip(instr, index, slot.id);
      chipsContainer.appendChild(chip);
    });
  });
}

/**
 * Crea un chip individual de instrucción.
 */
function createChip(instr, index, slotId) {
  const chip = document.createElement('div');
  chip.className = 'program-chip';
  chip.dataset.index = index;
  chip.textContent = EMOJI[instr.type] || '?';
  chip.setAttribute('title', 'Clic para eliminar');

  chip.addEventListener('click', (event) => {
    event.stopPropagation();

    // Eliminar el chip del slot correspondiente
    const state = gameStore.getState();
    const previousSlot = state.activeSlot;

    // Cambiar temporalmente al slot del chip para eliminar ahí
    if (previousSlot !== slotId) {
      state.setActiveSlot(slotId);
    }

    gameStore.getState().removeInstruction(index);

    // Restaurar el slot activo previo
    if (previousSlot !== slotId) {
      gameStore.getState().setActiveSlot(previousSlot);
    }
  });

  return chip;
}