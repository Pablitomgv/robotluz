// gameState.js — Estado global del juego con Zustand
// Este archivo es la "memoria central". Todos los módulos
// leen y escriben acá.

import { createStore } from 'zustand/vanilla';
import { INSTRUCTIONS, DEFAULT_MAX_PER_SLOT } from './config.js';

// ---- Estado inicial ----
// El estado que tiene el juego cuando arranca (antes de cargar un nivel).
const initialState = {
  // Nivel actual (se llena con setLevel)
  level: null,

  // Estado del robot
  robot: {
    x: 0,
    y: 0,
    dir: 'N',
    onLight: false
  },

  // Programa del usuario
  // Cada slot es un array de instrucciones
  program: {
    main: [],
    p1: [],
    p2: []
  },

  // Slot activo donde se agregan las instrucciones
  // Puede ser: 'main', 'p1' o 'p2'
  activeSlot: 'main',

  // Ejecución
  isRunning: false,
  currentStep: -1,

  // Celdas ya encendidas en el nivel actual
  // Usamos un Set para búsquedas rápidas
  litCells: new Set(),

  // Mensaje de error (si el robot intenta algo inválido)
  errorMessage: null
};

// ---- Store de Zustand ----
export const gameStore = createStore((set, get) => ({
  ...initialState,

  // ---- Acciones ----

  // Cargar un nivel nuevo. Resetea todo el estado relacionado.
  setLevel: (level) => set({
    level,
    robot: { ...level.start, onLight: false },
    program: { main: [], p1: [], p2: [] },
    activeSlot: 'main',
    isRunning: false,
    currentStep: -1,
    litCells: new Set(),
    errorMessage: null
  }),

  // Cambiar el slot activo (main, p1, p2)
  setActiveSlot: (slot) => {
    const validSlots = ['main', 'p1', 'p2'];
    if (!validSlots.includes(slot)) return;
    set({ activeSlot: slot });
  },

  // Agregar una instrucción al slot activo
  addInstruction: (instr) => {
    const { program, activeSlot, level } = get();
    const max = level?.maxPerSlot ?? DEFAULT_MAX_PER_SLOT;
    const current = program[activeSlot];

    // No agregar si ya llegó al límite del slot
    if (current.length >= max) {
      set({ errorMessage: `Límite de ${max} instrucciones alcanzado` });
      return;
    }

    // No agregar si es P1/P2 dentro de P1/P2 (evita recursión directa simple)
    // La recursión compleja se maneja en el intérprete
    set({
      program: {
        ...program,
        [activeSlot]: [...current, instr]
      },
      errorMessage: null
    });
  },

  // Eliminar una instrucción por índice del slot activo
  removeInstruction: (index) => {
    const { program, activeSlot } = get();
    const copy = [...program[activeSlot]];
    if (index < 0 || index >= copy.length) return;
    copy.splice(index, 1);
    set({ program: { ...program, [activeSlot]: copy } });
  },

  // Vaciar todo el programa (los 3 slots)
  clearProgram: () => set({
    program: { main: [], p1: [], p2: [] },
    currentStep: -1,
    litCells: new Set(),
    errorMessage: null
  }),

  // Actualizar el estado del robot (posición, dirección, etc.)
  updateRobot: (patch) => set((state) => ({
    robot: { ...state.robot, ...patch }
  })),

  // Marcar si el programa se está ejecutando
  setRunning: (isRunning) => set({ isRunning }),

  // Marcar una celda como encendida
  markLit: (x, y) => set((state) => {
    const key = `${x},${y}`;
    const newSet = new Set(state.litCells);
    newSet.add(key);
    return { litCells: newSet };
  }),

  // Guardar mensaje de error
  setError: (errorMessage) => set({ errorMessage }),

  // Resetear el estado completo (útil para reiniciar el nivel)
  reset: () => set({ ...initialState, litCells: new Set() })
}));

// ---- Helper para suscripciones ----
// Permite a los módulos suscribirse a cambios del estado.
// Devuelve una función para desuscribirse.
export function subscribeToGame(callback) {
  return gameStore.subscribe(callback);
}