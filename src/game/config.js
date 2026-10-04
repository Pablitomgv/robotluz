// config.js — Constantes globales del juego
// Este archivo es la base de todo el motor. Todos los demás
// módulos importan desde acá.

// ---- Direcciones del robot ----
// Cada dirección tiene un vector de movimiento (dx, dy) y
// un ángulo en grados para Phaser (donde 0° = arriba).
export const DIRS = {
    N: { dx: 0,  dy: -1, angle: 0 },
    E: { dx: 1,  dy: 0,  angle: 90 },
    S: { dx: 0,  dy: 1,  angle: 180 },
    W: { dx: -1, dy: 0,  angle: 270 }
  };
  
  // ---- Rotaciones ----
  // Si el robot mira al Norte y gira a la izquierda, ahora mira al Oeste.
  // Si gira a la derecha, mira al Este.
  export const TURN_LEFT = {
    N: 'W',
    W: 'S',
    S: 'E',
    E: 'N'
  };
  
  export const TURN_RIGHT = {
    N: 'E',
    E: 'S',
    S: 'W',
    W: 'N'
  };
  
  // ---- Tamaño de celda ----
  // Cada baldosa del tablero mide 64x64 píxeles.
  export const TILE = 64;
  
  // ---- Tipos de instrucciones ----
  // Estos son los comandos que el usuario puede arrastrar a los slots.
  export const INSTRUCTIONS = {
    FORWARD: 'forward',   // ⬆️ avanzar 1 celda
    LEFT: 'left',         // ↩️ girar a la izquierda
    RIGHT: 'right',       // ↪️ girar a la derecha
    JUMP: 'jump',         // ⤴️ saltar 1 celda (sube o baja 1 nivel)
    LIGHT: 'light',       // 💡 encender la baldosa actual
    P1: 'p1',             // 🔧 llamar al procedimiento 1
    P2: 'p2'              // 🔧 llamar al procedimiento 2
  };
  
  // ---- Emojis para los botones ----
  // Mapeo de tipo de instrucción a su representación visual.
  export const EMOJI = {
    forward: '⬆️',
    left: '↩️',
    right: '↪️',
    jump: '⤴️',
    light: '💡',
    p1: 'P1',
    p2: 'P2'
  };
  
  // ---- Paleta de colores oficial ----
  // Todos los colores del juego, centralizados acá para
  // mantener consistencia visual.
  export const COLORS = {
    // Robot
    robotBody:    0xf59e0b,  // naranja principal
    robotBodyLight: 0xfbbf24, // naranja claro (gradiente)
    robotBorder:  0x78350f,  // marrón oscuro (bordes)
    robotVisor:   0x22d3ee,  // cian del visor
    robotAntenna: 0xef4444,  // rojo de la antena
  
    // Tablero
    tileBase:     0x64748b,  // gris de las baldosas
    tileStep:     0x101010,  // cuánto se aclara cada nivel de altura
    lightOff:     0x1e40af,  // azul oscuro (luz apagada)
    lightOn:      0xfde047,  // amarillo (luz encendida)
  
    // UI
    bg:           0x0f172a,  // fondo general
    panel:        0x1e293b,  // panel de la paleta y programa
    border:       0x334155,  // bordes
    accent:       0x38bdf8,  // color de acento (chips, hover)
    text:         0xe2e8f0   // texto
  };
  
  // ---- Límites ----
  // Cuántas instrucciones puede tener el usuario como máximo
  // en cada slot. Esto se puede sobrescribir por nivel.
  export const DEFAULT_MAX_PER_SLOT = 12;
  
  // ---- Velocidad de ejecución ----
  // Cuántos milisegundos espera entre cada instrucción al ejecutar.
  // Valores bajos = rápido, valores altos = lento (mejor para aprender).
  export const STEP_DELAY = 350;
  
  // ---- Profundidad máxima de recursión ----
  // Para evitar que P1 se llame infinitamente a sí mismo.
  export const MAX_RECURSION_DEPTH = 8;