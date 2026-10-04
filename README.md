# 🤖 Robotluz

> Entorno de programación secuencial para primaria y ciclo básico del secundario.

**Robotluz** es un juego educativo, gratuito, sin publicidad y de código abierto
que enseña pensamiento computacional a través de puzles. Un pequeño robot debe
encender todas las baldosas azules usando instrucciones visuales:
avanzar, girar, saltar, encender y crear procedimientos.

Inspirado en la mecánica de **Light-Bot 2.0** (CoolioNiato, 2010), pero con arte
propio, motor web moderno y una misión clara: **llegar gratis a toda la
comunidad hispana, y después al mundo.**

## ✨ Principios

- 🆓 **Gratis, sin publicidad, para siempre.**
- 🚫 **Sin registro obligatorio.**
- 🔒 **Sin tracking de usuarios.**
- 🌎 **Multiidioma desde el día 1** (es, en, pt).
- ♿ **Accesible**: contraste, daltonismo, narración opcional.
- 📖 **Código abierto** (licencia MIT).
- 🎨 **Arte propio**, inspirado pero no copiado.

## 🎮 Cómo jugar (una vez terminado)

1. Mirá el nivel: un robot, baldosas de distintas alturas, luces azules.
2. Arrastrá instrucciones a los slots: `main`, `P1`, `P2`.
3. Presioná **Ejecutar**.
4. El robot sigue tus instrucciones.
5. Si todas las luces se encienden: nivel superado. ⭐

## 🚧 Estado del proyecto

**Fase 1 — Documentación y estructura base.**

- [x] Repositorio creado
- [x] Proyecto Vite configurado
- [x] Estructura de carpetas
- [ ] Documentación completa (`docs/`)
- [ ] Motor jugable (Fase 2)
- [ ] 30 niveles (Fase 3)
- [ ] Multiidioma es/en/pt (Fase 4)
- [ ] Editor de niveles (Fase 5)

Ver [roadmap completo](./docs/08-roadmap.md).

## 🛠 Stack técnico

- **[Phaser 3](https://phaser.io/)** — motor de juego 2D
- **[Vite](https://vitejs.dev/)** — bundler y dev server
- **[Zustand](https://zustand-demo.pmnd.rs/)** — estado global
- **[i18next](https://www.i18next.com/)** — internacionalización
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** — instalable como app
- **Vanilla JavaScript** — sin frameworks pesados

## 🚀 Cómo correrlo localmente

Requisitos: Node.js ≥ 20, npm ≥ 10.

```bash
git clone https://github.com/Pablitomgv/robotluz.git
cd robotluz
npm install
npm run dev