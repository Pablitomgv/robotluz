#!/usr/bin/env bash
# setup.sh — Crea la estructura base de Robotluz
# Uso: bash setup.sh

set -e

echo "🤖 Creando estructura de Robotluz..."

# Carpetas
mkdir -p docs
mkdir -p src/game
mkdir -p src/ui
mkdir -p src/i18n
mkdir -p src/styles
mkdir -p src/assets/sprites
mkdir -p src/assets/audio
mkdir -p public/icons
mkdir -p tests

# ---- Documentos base ----
declare -a DOCS=(
  "00-vision:Visión del proyecto"
  "01-stack:Stack técnico"
  "02-arquitectura:Arquitectura"
  "03-mecanicas:Mecánicas del juego"
  "04-niveles:Diseño de niveles"
  "05-ui-ux:UI y UX"
  "06-i18n:Internacionalización"
  "07-assets:Assets gráficos y sonoros"
  "08-roadmap:Roadmap y fases"
  "09-decisiones:Decisiones técnicas (ADRs)"
)

for entry in "${DOCS[@]}"; do
  file="${entry%%:*}"
  title="${entry##*:}"
  if [ ! -f "docs/${file}.md" ]; then
    cat > "docs/${file}.md" <<EOF
# ${file} — ${title}

> 🚧 Documento pendiente de redacción.

## Secciones previstas

- (completar)
EOF
    echo "  ✓ docs/${file}.md"
  else
    echo "  · docs/${file}.md ya existe, no se toca"
  fi
done

# ---- Código fuente vacío con encabezado ----
declare -a SRC=(
  "src/game/config.js:config.js — Constantes globales del juego"
  "src/game/gameState.js:gameState.js — Estado global con Zustand"
  "src/game/interpreter.js:interpreter.js — Compila y ejecuta el programa del usuario"
  "src/game/board.js:board.js — Escena Phaser: tablero y robot"
  "src/game/levels.js:levels.js — Definición de niveles"
  "src/ui/palette.js:palette.js — Paleta de instrucciones"
  "src/ui/program.js:program.js — Zona de programa del usuario"
  "src/ui/hud.js:hud.js — Botones y contadores"
  "src/i18n/index.js:i18n/index.js — Configuración i18next"
)

for entry in "${SRC[@]}"; do
  file="${entry%%:*}"
  header="${entry##*:}"
  if [ ! -f "$file" ]; then
    echo "// ${header}" > "$file"
    echo "export {};" >> "$file"
    echo "  ✓ $file"
  else
    echo "  · $file ya existe, no se toca"
  fi
done

# ---- Traducciones base ----
if [ ! -f "src/i18n/es.json" ]; then
  cat > src/i18n/es.json <<'EOF'
{
  "app": {
    "title": "Robotluz",
    "subtitle": "Enseñá a programar jugando"
  },
  "hud": {
    "run": "Ejecutar",
    "reset": "Reiniciar",
    "next": "Siguiente",
    "level": "Nivel"
  }
}
EOF
  echo "  ✓ src/i18n/es.json"
fi

if [ ! -f "src/i18n/en.json" ]; then
  cat > src/i18n/en.json <<'EOF'
{
  "app": {
    "title": "Robotluz",
    "subtitle": "Teach programming by playing"
  },
  "hud": {
    "run": "Run",
    "reset": "Reset",
    "next": "Next",
    "level": "Level"
  }
}
EOF
  echo "  ✓ src/i18n/en.json"
fi

# ---- levels.js con estructura inicial ----
cat > src/game/levels.js <<'EOF'
// levels.js — Definición de niveles
// Cada nivel tiene: grid, start, lights, maxPerSlot
export const LEVELS = [
  {
    id: 1,
    name: 'level.1.name',
    grid: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    start: { x: 1, y: 2, dir: 'N' },
    lights: [{ x: 1, y: 0 }],
    maxPerSlot: 6
  }
];
EOF
echo "  ✓ src/game/levels.js"

echo ""
echo "✅ Estructura creada correctamente."
echo ""
echo "Siguientes pasos:"
echo "  1. Editar README.md y docs/00-vision.md"
echo "  2. git add . && git commit -m 'chore: estructura de docs y carpetas base'"
echo "  3. git push"