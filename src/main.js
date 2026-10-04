// main.js — Punto de entrada del juego
// Conecta todos los módulos: estado global, Phaser, UI.

import Phaser from 'phaser';

// Motor de juego
import { gameStore } from './game/gameState.js';
import { BoardScene } from './game/board.js';
import { LEVELS } from './game/levels.js';

// UI
import { renderHUD, syncHUD } from './ui/hud.js';
import { renderPalette, updatePaletteState } from './ui/palette.js';
import { renderProgram, syncProgram } from './ui/program.js';

// Estilos
import './styles/main.css';

// ============================================================
// ARRANQUE
// ============================================================

function bootstrap() {
  // ---- 1. Cargar el primer nivel en el estado global ----
  const firstLevel = LEVELS[0];
  gameStore.getState().setLevel(firstLevel);

  // ---- 2. Arrancar Phaser ----
  const phaserGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'stage',
    backgroundColor: '#0f172a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 640
    },
    scene: [BoardScene]
  });

  // ---- 3. Renderizar la UI ----
  const hudEl = document.getElementById('hud');
  const paletteEl = document.getElementById('palette');
  const programEl = document.getElementById('program');

  if (!hudEl || !paletteEl || !programEl) {
    console.error('Faltan elementos HTML: hud, palette o program');
    return;
  }

  renderHUD(hudEl);
  renderPalette(paletteEl);
  renderProgram(programEl);

  // ---- 4. Sincronizar UI con el estado ----
  // Cada vez que el estado global cambia, actualizamos las vistas.
  gameStore.subscribe(() => {
    syncHUD(hudEl);
    syncProgram(programEl);
    updatePaletteState(gameStore.getState().level);
  });

  // ---- 5. Cargar el siguiente nivel al hacer clic en un botón futuro ----
  // (esto está preparado para la Fase 3)

  console.log('🤖 Robotluz iniciado correctamente');
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}