// hud.js — Barra superior con botones y contador de nivel
// También contiene la lógica de ejecución del programa paso a paso.

import { STEP_DELAY, INSTRUCTIONS } from '../game/config.js';
import { gameStore } from '../game/gameState.js';
import {
  compile,
  step,
  isLevelComplete,
  getErrorMessage
} from '../game/interpreter.js';
import { LEVELS, getNextLevelId } from '../game/levels.js';

/**
 * Renderiza el HUD completo dentro del contenedor.
 */
export function renderHUD(container) {
  container.innerHTML = '';
  container.classList.add('hud');

  // ---- Botones ----
  const runBtn = document.createElement('button');
  runBtn.id = 'btn-run';
  runBtn.className = 'hud-btn primary';
  runBtn.textContent = '▶ Ejecutar';
  runBtn.setAttribute('aria-label', 'Ejecutar el programa');

  const resetBtn = document.createElement('button');
  resetBtn.id = 'btn-reset';
  resetBtn.className = 'hud-btn';
  resetBtn.textContent = '⟲ Reiniciar';
  resetBtn.setAttribute('aria-label', 'Reiniciar el programa y el robot');

  // ---- Contador de nivel ----
  const levelCounter = document.createElement('span');
  levelCounter.id = 'level-counter';
  levelCounter.className = 'hud-level';
  levelCounter.textContent = 'Nivel 1/1';

  // ---- Área de mensajes ----
  const message = document.createElement('span');
  message.id = 'hud-message';
  message.className = 'hud-message';

  // ---- Ensamblar ----
  container.appendChild(runBtn);
  container.appendChild(resetBtn);
  container.appendChild(levelCounter);
  container.appendChild(message);

  // ---- Conectar eventos ----
  runBtn.addEventListener('click', () => runProgram());
  resetBtn.addEventListener('click', () => resetLevel());

  // Sincronizar con el estado actual
  syncHUD(container);
}

/**
 * Sincroniza el HUD con el estado actual.
 */
export function syncHUD(container) {
  const state = gameStore.getState();
  const { level, isRunning, errorMessage } = state;

  // Actualizar contador de nivel
  const counter = container.querySelector('#level-counter');
  if (counter && level) {
    const total = LEVELS.length;
    const index = LEVELS.findIndex((l) => l.id === level.id) + 1;
    counter.textContent = `Nivel ${index}/${total}`;
  }

  // Actualizar botón Ejecutar
  const runBtn = container.querySelector('#btn-run');
  if (runBtn) {
    runBtn.disabled = isRunning;
    runBtn.textContent = isRunning ? '⏳ Ejecutando...' : '▶ Ejecutar';
  }

  // Mostrar mensaje de error si hay
  const messageEl = container.querySelector('#hud-message');
  if (messageEl) {
    if (errorMessage) {
      messageEl.textContent = errorMessage;
      messageEl.classList.add('error');
    } else {
      messageEl.textContent = '';
      messageEl.classList.remove('error');
    }
  }
}

/**
 * Muestra un mensaje temporal en el HUD.
 */
export function showMessage(container, text, type = 'info', duration = 2500) {
  const messageEl = container.querySelector('#hud-message');
  if (!messageEl) return;

  messageEl.textContent = text;
  messageEl.className = `hud-message ${type}`;

  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'hud-message';
  }, duration);
}

// ============================================================
// EJECUCIÓN DEL PROGRAMA
// ============================================================

/**
 * Ejecuta el programa del usuario paso a paso.
 * Compila, aplica cada instrucción, y detecta la victoria.
 */
export async function runProgram() {
  const state = gameStore.getState();

  // No ejecutar si ya está corriendo o no hay nivel
  if (state.isRunning || !state.level) return;

  // ---- Compilar ----
  let flat;
  try {
    flat = compile(state.program);
  } catch (err) {
    gameStore.getState().setError(err.message);
    return;
  }

  // Si no hay instrucciones, avisar y salir
  if (flat.length === 0) {
    gameStore.getState().setError('El programa está vacío');
    return;
  }

  // ---- Preparar ejecución ----
  gameStore.getState().setRunning(true);
  gameStore.getState().setError(null);

  // Resetear estado del robot al inicio del nivel
  const level = state.level;
  const litCells = new Set();

  gameStore.getState().updateRobot({
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    onLight: false
  });
  gameStore.setState({ litCells });

  // Pequeña pausa para que el robot vuelva a su posición inicial
  await sleep(300);

  // ---- Ejecutar cada instrucción ----
  let currentRobot = {
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    onLight: false
  };

  for (let i = 0; i < flat.length; i++) {
    const instr = flat[i];

    // Actualizar índice de paso actual
    gameStore.setState({ currentStep: i });

    // Aplicar la instrucción
    const result = step(currentRobot, level, instr);

    if (!result.ok) {
      // Error: mostrar mensaje y detener
      gameStore.getState().setError(getErrorMessage(result.reason));
      gameStore.getState().setRunning(false);
      return;
    }

    currentRobot = result.robot;
    gameStore.getState().updateRobot(currentRobot);

    // Si encendió una luz, marcarla
    if (result.effect === 'light') {
      gameStore.getState().markLit(currentRobot.x, currentRobot.y);
    }

    // Pausa entre instrucciones
    await sleep(STEP_DELAY);
  }

  // ---- Verificar victoria ----
  const finalLit = gameStore.getState().litCells;
  if (isLevelComplete(level, finalLit)) {
    showMessage(
      document.getElementById('hud'),
      '¡Nivel completado! 🎉',
      'success',
      3000
    );
    // TODO Fase 3: guardar progreso, desbloquear siguiente nivel
  } else {
    showMessage(
      document.getElementById('hud'),
      'Faltan luces por encender',
      'info',
      2500
    );
  }

  gameStore.getState().setRunning(false);
}

/**
 * Reinicia el nivel actual: limpia programa y vuelve el robot al inicio.
 */
export function resetLevel() {
  const state = gameStore.getState();
  if (!state.level) return;

  gameStore.getState().clearProgram();
  gameStore.getState().updateRobot({
    x: state.level.start.x,
    y: state.level.start.y,
    dir: state.level.start.dir,
    onLight: false
  });
  gameStore.setState({ litCells: new Set() });
}

// ============================================================
// HELPERS
// ============================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// API PÚBLICA (para main.js)
// ============================================================

/**
 * Carga el siguiente nivel (útil para el botón "Siguiente" en el futuro).
 */
export function loadNextLevel() {
  const state = gameStore.getState();
  if (!state.level) return;

  const nextId = getNextLevelId(state.level.id);
  if (nextId === null) return;

  const nextLevel = LEVELS.find((l) => l.id === nextId);
  if (nextLevel) {
    gameStore.getState().setLevel(nextLevel);
  }
}