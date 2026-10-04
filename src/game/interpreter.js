// interpreter.js — Compila y ejecuta el programa del usuario
// Este es el corazón del juego. Convierte el programa visual
// del usuario en acciones concretas y valida cada paso.

import {
    DIRS,
    TURN_LEFT,
    TURN_RIGHT,
    INSTRUCTIONS,
    MAX_RECURSION_DEPTH
  } from './config.js';
  
  // ============================================================
  // COMPILADOR
  // ============================================================
  // Toma el programa del usuario (con P1, P2 y bucles anidados)
  // y lo convierte en una lista plana de instrucciones simples.
  //
  // Ejemplo:
  //   program = {
  //     main: [forward, P1, forward],
  //     p1:   [right, light]
  //   }
  // compile(program) → [forward, right, light, forward]
  //
  // Si hay recursión infinita, se corta con un error.
  
  export function compile(program, maxDepth = MAX_RECURSION_DEPTH) {
    const flat = [];
  
    /**
     * Expande un slot del programa recursivamente.
     * @param {string} slot - 'main' | 'p1' | 'p2'
     * @param {number} depth - profundidad actual (para detectar recursión)
     */
    function expand(slot, depth) {
      if (depth > maxDepth) {
        throw new Error('Recursión demasiado profunda (posible bucle infinito)');
      }
  
      const instructions = program[slot] || [];
  
      for (const instr of instructions) {
        // Si es un procedimiento, expandir su contenido
        if (instr.type === INSTRUCTIONS.P1) {
          expand('p1', depth + 1);
          continue;
        }
        if (instr.type === INSTRUCTIONS.P2) {
          expand('p2', depth + 1);
          continue;
        }
  
        // Si es un bloque "repetir" (para fase futura), expandir N veces
        if (instr.type === 'repeat') {
          const times = instr.times || 1;
          for (let i = 0; i < times; i++) {
            for (const child of instr.body || []) {
              if (child.type === INSTRUCTIONS.P1) {
                expand('p1', depth + 1);
              } else if (child.type === INSTRUCTIONS.P2) {
                expand('p2', depth + 1);
              } else {
                flat.push(child);
              }
            }
          }
          continue;
        }
  
        // Instrucción normal: agregar a la lista plana
        flat.push(instr);
      }
    }
  
    expand('main', 0);
    return flat;
  }
  
  // ============================================================
  // EJECUTOR DE UN PASO
  // ============================================================
  // Aplica una sola instrucción al robot y devuelve el nuevo
  // estado. Si la acción es ilegal, devuelve { ok: false, reason }.
  
  export function step(robot, level, instr) {
    const grid = level.grid;
  
    // Altura de una celda (0 = vacío, 1 = piso, 2 = altura 2, etc.)
    const height = (x, y) => {
      if (y < 0 || y >= grid.length) return 0;
      if (x < 0 || x >= grid[y].length) return 0;
      return grid[y][x];
    };
  
    const next = { ...robot };
  
    switch (instr.type) {
      // ---- Girar a la izquierda ----
      case INSTRUCTIONS.LEFT:
        next.dir = TURN_LEFT[robot.dir];
        return { ok: true, robot: next, effect: 'turn' };
  
      // ---- Girar a la derecha ----
      case INSTRUCTIONS.RIGHT:
        next.dir = TURN_RIGHT[robot.dir];
        return { ok: true, robot: next, effect: 'turn' };
  
      // ---- Encender la luz ----
      case INSTRUCTIONS.LIGHT: {
        // ¿Hay una luz en la celda actual?
        const luz = level.lights.find(
          (l) => l.x === robot.x && l.y === robot.y
        );
        if (!luz) {
          return { ok: false, reason: 'no_light_here' };
        }
        return { ok: true, robot: next, effect: 'light' };
      }
  
      // ---- Avanzar 1 celda ----
      case INSTRUCTIONS.FORWARD: {
        const { dx, dy } = DIRS[robot.dir];
        const nx = robot.x + dx;
        const ny = robot.y + dy;
        const hDest = height(nx, ny);
        const hNow = height(robot.x, robot.y);
  
        // ¿Está fuera del tablero?
        if (hDest === 0) {
          return { ok: false, reason: 'out_of_bounds' };
        }
  
        // ¿Hay un cambio de altura? Necesita saltar.
        if (hDest !== hNow) {
          return { ok: false, reason: 'need_jump' };
        }
  
        next.x = nx;
        next.y = ny;
        return { ok: true, robot: next, effect: 'move' };
      }
  
      // ---- Saltar 1 celda (sube o baja 1 nivel) ----
      case INSTRUCTIONS.JUMP: {
        const { dx, dy } = DIRS[robot.dir];
        const nx = robot.x + dx;
        const ny = robot.y + dy;
        const hDest = height(nx, ny);
        const hNow = height(robot.x, robot.y);
  
        // ¿Está fuera del tablero?
        if (hDest === 0) {
          return { ok: false, reason: 'out_of_bounds' };
        }
  
        // ¿El salto es demasiado alto o demasiado bajo?
        if (hDest - hNow > 1) {
          return { ok: false, reason: 'jump_too_high' };
        }
        if (hNow - hDest > 1) {
          return { ok: false, reason: 'jump_too_deep' };
        }
  
        next.x = nx;
        next.y = ny;
        return { ok: true, robot: next, effect: 'jump' };
      }
  
      // ---- Instrucción desconocida ----
      default:
        return { ok: false, reason: 'unknown_instruction' };
    }
  }
  
  // ============================================================
  // HELPERS DE VALIDACIÓN
  // ============================================================
  
  /**
   * Verifica si el robot está parado sobre una luz que aún
   * no ha sido encendida.
   */
  export function isOnUnlitLight(robot, level, litCells) {
    const luz = level.lights.find(
      (l) => l.x === robot.x && l.y === robot.y
    );
    if (!luz) return false;
    const key = `${robot.x},${robot.y}`;
    return !litCells.has(key);
  }
  
  /**
   * Verifica si el nivel está resuelto:
   * todas las luces encendidas.
   */
  export function isLevelComplete(level, litCells) {
    return level.lights.every((l) => {
      const key = `${l.x},${l.y}`;
      return litCells.has(key);
    });
  }
  
  /**
   * Cuenta cuántas luces faltan encender.
   */
  export function countRemainingLights(level, litCells) {
    return level.lights.filter((l) => {
      const key = `${l.x},${l.y}`;
      return !litCells.has(key);
    }).length;
  }
  
  // ============================================================
  // MENSAJES DE ERROR EN ESPAÑOL
  // ============================================================
  // Traduce los códigos de error del motor a mensajes amigables
  // para mostrar en el HUD.
  
  export const ERROR_MESSAGES = {
    no_light_here: 'No hay una luz en esta baldosa',
    out_of_bounds: 'El robot no puede salir del tablero',
    need_jump: 'Necesita saltar para subir o bajar',
    jump_too_high: 'El salto es demasiado alto',
    jump_too_deep: 'El salto es demasiado profundo',
    unknown_instruction: 'Instrucción desconocida'
  };
  
  /**
   * Devuelve un mensaje en español para un código de error.
   */
  export function getErrorMessage(reason) {
    return ERROR_MESSAGES[reason] || 'Acción inválida';
  }