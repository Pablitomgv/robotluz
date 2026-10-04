# 00 — Visión

## 1. Resumen ejecutivo

**Robotluz** es un juego web educativo que enseña pensamiento computacional
mediante puzles de programación secuencial. El jugador da instrucciones a un
robot para que encienda todas las baldosas azules de cada nivel. El juego es
gratuito, sin publicidad, sin registro, sin tracking, multiidioma y de código
abierto.

## 2. Problema

Existen excelentes juegos para enseñar a programar (Light-Bot, Scratch, Code.org),
pero presentan barreras para el público hispanohablante:

- **Light-Bot original** (CoolioNiato, 2010) está en inglés, fue hecho en Flash
  (tecnología muerta) y su versión en Armor Games muestra publicidad.
- **Scratch** es excelente, pero su enfoque es creación libre, no resolución de
  puzles progresivos.
- **Code.org** requiere conexión constante y tiene currículas largas, difíciles
  de integrar en una clase de 40 minutos.
- **Recursos educativos** de calidad suelen estar detrás de muros de pago o
  requieren registro institucional.

**Resultado:** un docente hispano que quiere enseñar pensamiento computacional
en 30 minutos no tiene una opción simple, gratuita, sin ads y en su idioma.

## 3. Solución

**Robotluz** llena ese vacío:

- 🌐 **Web pura:** funciona en cualquier navegador moderno, sin instalar nada.
- 🆓 **Gratis y sin publicidad, para siempre.** Sostenido por donaciones si
  llega a hacer falta, nunca por ads.
- 🔓 **Sin registro.** El progreso vive en el navegador del usuario.
- 🌎 **Español neutro** desde el día 1, con inglés y portugués en Fase 4.
- 🎓 **30 niveles** con progresión pedagógica clara, jugables en 20-30 minutos.
- 📱 **Instalable como PWA** en celulares y tablets sin pasar por tiendas.
- 📖 **Open source (MIT):** cualquiera puede auditar, traducir, mejorar.

## 4. Público objetivo

### Primario

- **Niños y niñas de 8 a 14 años** sin experiencia previa en programación.
- **Docentes de primaria y ciclo básico del secundario** que enseñan
  pensamiento computacional, robótica o tecnología.

### Secundario

- **Padres** que quieren introducir a sus hijos en la programación.
- **Adultos** que quieren entender conceptos básicos jugando.
- **Escuelas rurales** con conexión limitada (por eso el bundle es liviano).

## 5. Propuesta de valor única

| Característica | Light-Bot 2.0 | Scratch | Code.org | **Robotluz** |
|---|---|---|---|---|
| Gratis | ✅ (con ads) | ✅ | ✅ | ✅ **sin ads** |
| Sin registro | ❌ | ❌ | ❌ | ✅ |
| Sin tracking | ❌ | ❌ | ❌ | ✅ |
| Español neutro | ❌ | Parcial | Parcial | ✅ |
| Instalable sin tienda | ❌ | ❌ | ❌ | ✅ (PWA) |
| Código abierto | ❌ | ✅ | Parcial | ✅ |
| Sesión de 30 min | ✅ | ❌ | ❌ | ✅ |
| Funciona offline | ❌ | ❌ | ❌ | ✅ (PWA) |

## 6. Principios rectores

Estos principios son **no negociables** y guían cada decisión del proyecto:

1. **Gratis, sin publicidad, para siempre.** Si el proyecto crece, se sostiene
   con donaciones voluntarias o becas educativas. Nunca con ads.
2. **Sin tracking.** Ni Google Analytics, ni píxeles de Facebook, ni nada que
   identifique al usuario. Métricas agregadas y anónimas, opt-in, si acaso.
3. **Sin registro obligatorio.** El progreso se guarda localmente. Compartir
   entre dispositivos es opcional y vía exportar/importar JSON.
4. **Código abierto (MIT).** Cualquier persona puede auditar, traducir,
   modificar y redistribuir, siempre manteniendo la licencia abierta.
5. **Multiidioma desde el día 1.** Español neutro primero, después en y pt.
6. **Accesibilidad real.** Contraste WCAG AA mínimo, no depender solo del color
   para transmitir información, narración opcional para pre-lectores.
7. **Cero dependencias propietarias.** Nada de Flash, nada de SDKs cerrados,
   nada de servicios que puedan desaparecer.
8. **Arte y contenido propios.** Inspirado en Light-Bot, nunca copiado.

## 7. Qué NO es Robotluz

Para evitar malentendidos:

- **No es un curso de programación completo.** Es una introducción lúdica a
  conceptos: secuencia, bucle, procedimiento, condicional, recursión.
- **No reemplaza a Scratch, Code.org ni Robótica.** Es complementario. Ideal
  como primera hora de una clase o como actividad de cierre.
- **No usa texto de código real.** La metáfora es visual: el jugador arrastra
  íconos, no escribe `for (let i = 0; i < 3; i++)`.
- **No es competitivo ni tiene puntajes globales.** Sin rankings, sin presión.

## 8. Referencia: Light-Bot 2.0

**Light-Bot 2.0** (CoolioNiato, Armor Games, 2010) es la inspiración directa.
Mecánicas que adoptamos como referencia funcional:

- Iluminar baldosas azules con un robot.
- Instrucciones visuales arrastrables: avanzar, girar, saltar, encender.
- Procedimientos (P1, P2).
- Condicionales (si/si no).
- Recursión.
- Niveles progresivos con dificultad creciente.

Mecánicas que **NO copiamos** y reinventamos:

- Aspecto visual del robot (el nuestro es SVG isométrico original).
- Paleta de colores (nuestra paleta es naranja + cian sobre fondo azul oscuro).
- Música y sonidos (usaremos CC0 inicialmente, originales en el futuro).
- Niveles (los 30 nuestros están diseñados desde cero).
- Nombres e identidad de marca.

## 9. Métricas de éxito

Consideraremos el proyecto exitoso si al final de la Fase 6:

- ✅ **30 niveles jugables** y balanceados.
- ✅ **3 idiomas completos** (es, en, pt).
- ✅ **0 KB de publicidad**, 0 scripts de tracking.
- ✅ **Carga < 2 segundos** en conexión 3G.
- ✅ **Bundle < 250 KB gzip.**
- ✅ **Feedback positivo de al menos 10 docentes reales** antes del lanzamiento.
- ✅ **Funciona en Chrome, Firefox, Safari y Edge**, desktop y móvil.
- ✅ **Instalable como PWA** en Android e iOS.
- ✅ **Repositorio público** con al menos 1 contribución externa (traducción,
  nivel, bugfix o sugerencia aceptada).

## 10. Decisiones clave registradas

| Decisión | Valor | Razón |
|---|---|---|
| Motor de juego | Phaser 3 | Maduro, liviano, ideal para grillas y tweens |
| Bundler | Vite | Rápido, PWA oficial, sin configuración compleja |
| Estado | Zustand | Mínimo, sin boilerplate |
| i18n | i18next | Estándar, JSON simple, plurales automáticos |
| Arte del robot | SVG isométrico 2D | Liviano, iterable, accesible a colaboradores |
| Grilla del tablero | Isométrica | Firma visual del género, migrar después es doloroso |
| Música inicial | CC0 (Free Music Archive) | Gratis, legal, con atribución |
| Música futura | Compositor original | Diferencial de calidad en Fase 5+ |
| Editor de niveles | Fase 5 | El motor debe estar estable primero |
| Nombre del proyecto | Robotluz | Claro en español, descriptivo, único en GitHub |
| Licencia | MIT | Máxima apertura, compatible con uso escolar |

Estas decisiones se documentan formalmente como ADRs en
[`09-decisiones.md`](./09-decisiones.md).

## 11. Visión a largo plazo (2 años)

- **Año 1:** Lanzamiento de los 30 niveles base en español, inglés y portugués.
  Publicación en GitHub Pages, itch.io y comunidades docentes.
- **Año 1.5:** Editor de niveles in-game, niveles de la comunidad,
  modo "aula" con panel docente (opcional, sin registro).
- **Año 2:** Versión HD opcional con robot voxel 3D, más idiomas (francés,
  italiano, alemán, catalán, guaraní), colaboración con ministerios de
  educación provinciales.

**El norte siempre es el mismo:** que un niño o niña hispanohablante, en
cualquier rincón del mundo, pueda aprender a pensar como programador jugando,
gratis, sin publicidad, sin ceder sus datos.