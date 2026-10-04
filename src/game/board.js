// board.js — Escena Phaser: tablero isométrico y robot
// Este módulo dibuja todo lo visual: el suelo, las luces y el robot.
// También se sincroniza con el estado global para animar los cambios.

import Phaser from 'phaser';
import { TILE, DIRS, COLORS } from './config.js';
import { gameStore } from './gameState.js';

export class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
    this.robotSprite = null;
    this.lightSprites = new Map(); // key "x,y" → sprite de la luz
    this.tileSprites = [];         // todas las baldosas dibujadas
    this.robotPos = { x: 0, y: 0 }; // posición anterior del robot
    this.unsubscribe = null;
  }

  // ---- Ciclo de vida de Phaser ----

  // init() se ejecuta ANTES de create(). Acá guardamos
  // la referencia al nivel actual.
  init() {
    this.level = gameStore.getState().level;
  }

  // create() se ejecuta al arrancar la escena.
  create() {
    if (!this.level) {
      console.warn('BoardScene: no hay nivel cargado');
      return;
    }

    this.drawGrid();
    this.drawLights();
    this.spawnRobot();

    // Suscribirse a los cambios del estado global
    this.unsubscribe = gameStore.subscribe(() => this.sync());

    // Sincronizar por primera vez
    this.sync();

    // Limpiar suscripción al cerrar la escena
    this.events.on('shutdown', () => {
      if (this.unsubscribe) this.unsubscribe();
    });
  }

  // ---- DIBUJO DEL TABLERO ----

  drawGrid() {
    const { grid } = this.level;

    grid.forEach((row, y) => {
      row.forEach((h, x) => {
        if (h === 0) return; // celda vacía, no dibujar

        // Cuanto más alta la celda, más clara
        const shade = COLORS.tileBase + (h - 1) * COLORS.tileStep;

        // Sombra de la baldosa (offset inferior)
        const shadow = this.add.rectangle(
          x * TILE + TILE / 2 + 2,
          y * TILE + TILE / 2 + 4,
          TILE - 4,
          TILE - 4,
          0x000000,
          0.3
        );
        shadow.setOrigin(0.5);

        // Baldosa principal
        const tile = this.add.rectangle(
          x * TILE + TILE / 2,
          y * TILE + TILE / 2,
          TILE - 4,
          TILE - 4,
          shade
        );
        tile.setOrigin(0.5);
        tile.setStrokeStyle(2, COLORS.border);

        // Guardar para referencia
        this.tileSprites.push({ x, y, sprite: tile, height: h });
      });
    });
  }

  // ---- DIBUJO DE LAS LUCES ----

  drawLights() {
    this.level.lights.forEach(({ x, y }) => {
      const key = `${x},${y}`;

      const light = this.add.circle(
        x * TILE + TILE / 2,
        y * TILE + TILE / 2,
        12,
        COLORS.lightOff
      );

      // Borde sutil
      light.setStrokeStyle(2, 0x1e3a8a);

      // Guardar referencia por clave "x,y"
      this.lightSprites.set(key, light);
    });
  }

  // ---- DIBUJO DEL ROBOT ----

  spawnRobot() {
    const { x, y } = this.level.start;

    // Contenedor: agrupa varias formas como una sola unidad
    this.robotSprite = this.add.container(
      x * TILE + TILE / 2,
      y * TILE + TILE / 2
    );

    // Sombra del robot (elipse bajo los pies)
    const shadow = this.add.ellipse(0, 18, 30, 10, 0x000000, 0.35);

    // Cuerpo del robot (rectángulo naranja redondeado)
    const body = this.add.rectangle(0, 0, 40, 40, COLORS.robotBody);
    body.setStrokeStyle(3, COLORS.robotBorder);

    // "Visor" (un ojo cian)
    const eye = this.add.circle(0, -6, 7, COLORS.robotVisor);
    eye.setStrokeStyle(2, 0x0891b2);

    // Brillo del ojo
    const eyeGlow = this.add.circle(-2, -8, 2, 0xe0f2fe);

    // Antena
    const antenna = this.add.rectangle(0, -26, 3, 12, COLORS.robotBorder);
    const antennaTip = this.add.circle(0, -34, 4, COLORS.robotAntenna);

    // Agregar todas las partes al contenedor
    this.robotSprite.add([shadow, antenna, antennaTip, body, eye, eyeGlow]);

    // Guardar posición inicial
    this.robotPos = { x, y };

    // Aplicar ángulo inicial según la dirección
    this.robotSprite.setAngle(DIRS[this.level.start.dir].angle);
  }

  // ---- SINCRONIZACIÓN CON EL ESTADO ----

  sync() {
    const state = gameStore.getState();
    const { robot, litCells } = state;

    if (!this.robotSprite) return;

    // ¿Cambió la posición? Animar
    if (robot.x !== this.robotPos.x || robot.y !== this.robotPos.y) {
      this.animateMoveTo(robot.x, robot.y);
      this.robotPos = { x: robot.x, y: robot.y };
    }

    // ¿Cambió la dirección? Animar rotación
    const targetAngle = DIRS[robot.dir].angle;
    if (this.robotSprite.angle !== targetAngle) {
      this.animateRotateTo(targetAngle);
    }

    // Actualizar luces encendidas
    this.updateLights(litCells);
  }

  // ---- ANIMACIONES ----

  animateMoveTo(tx, ty) {
    const targetX = tx * TILE + TILE / 2;
    const targetY = ty * TILE + TILE / 2;

    // Movimiento horizontal suave
    this.tweens.add({
      targets: this.robotSprite,
      x: targetX,
      duration: 250,
      ease: 'Sine.easeInOut'
    });

    // Arco de salto (sube y baja)
    this.tweens.add({
      targets: this.robotSprite,
      y: targetY - 15,
      duration: 125,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Asegurar posición final exacta
        this.robotSprite.y = targetY;
      }
    });
  }

  animateRotateTo(targetAngle) {
    this.tweens.add({
      targets: this.robotSprite,
      angle: targetAngle,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  updateLights(litCells) {
    this.lightSprites.forEach((sprite, key) => {
      if (litCells.has(key)) {
        // Encendida: amarillo con glow
        sprite.setFillStyle(COLORS.lightOn);
        sprite.setStrokeStyle(3, 0xfacc15);
        // Pequeño pulso si recién se encendió
        if (!sprite.getData('lit')) {
          sprite.setData('lit', true);
          this.tweens.add({
            targets: sprite,
            scale: { from: 1, to: 1.5 },
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeOut'
          });
        }
      } else {
        // Apagada: azul oscuro
        sprite.setFillStyle(COLORS.lightOff);
        sprite.setStrokeStyle(2, 0x1e3a8a);
      }
    });
  }
}