#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# init.sh — Scaffolding y Setup Canónico (Uncle Bob & Clean/FSD Spec)
# Repositorio: datamaq-automation/spec
#
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- [backend|frontend] [DIRECTORIO_DESTINO]
#   O localmente:
#   ./scripts/init.sh [backend|frontend] [DIRECTORIO_DESTINO]
# ==============================================================================

REPO="datamaq-automation/spec"
BRANCH="main"
TARBALL_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}"
RAW_BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

TYPE="${1:-}"
TARGET_DIR="${2:-}"

print_usage() {
    echo ""
    echo "Uso: $0 [backend|frontend] [DIRECTORIO_DESTINO]"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backend mi-backend-app"
    echo "  $0 frontend mi-frontend-app"
    echo "  $0 backend .  # (Inicializa en el directorio actual)"
    echo ""
}

if [[ -z "$TYPE" || ( "$TYPE" != "backend" && "$TYPE" != "frontend" ) ]]; then
    echo "❌ [ERROR] Debe especificar el tipo de proyecto: 'backend' o 'frontend'."
    print_usage
    exit 1
fi

if [[ -z "$TARGET_DIR" ]]; then
    TARGET_DIR="."
fi

echo "======================================================================"
echo "🚀 Inicializando proyecto: $TYPE"
echo "📂 Destino: $(mkdir -p "$TARGET_DIR" && cd "$TARGET_DIR" && pwd)"
echo "======================================================================"

mkdir -p "$TARGET_DIR"

# 1. Descargar y extraer el template correspondiente
echo "📦 1/3 Descargando scaffolding del template ($TYPE)..."
curl -sL "$TARBALL_URL" | tar -xzf - --strip-components=3 -C "$TARGET_DIR" "spec-${BRANCH}/${TYPE}/template"

# 2. Descargar la especificación técnica SRS a docs/
echo "📄 2/3 Descargando especificación SRS a docs/..."
mkdir -p "${TARGET_DIR}/docs"

if [[ "$TYPE" == "backend" ]]; then
    curl -fsSL "${RAW_BASE_URL}/backend/srs-spec-backend-fastapi.md" -o "${TARGET_DIR}/docs/srs-spec-backend-fastapi.md"
else
    curl -fsSL "${RAW_BASE_URL}/frontend/srs-spec-frontend-vue-vite.md" -o "${TARGET_DIR}/docs/srs-spec-frontend-vue-vite.md"
fi

# 3. Validar de inmediato el Guantelete de Restricciones
echo "🛡️  3/3 Ejecutando Guantelete de Restricciones sobre el nuevo proyecto..."
(
    cd "$TARGET_DIR"
    if [[ "$TYPE" == "backend" ]]; then
        if command -v python3 >/dev/null 2>&1; then
            python3 tests/test_architecture.py
        else
            echo "⚠️  [AVISO] python3 no disponible para validar localmente en este momento."
        fi
    else
        if command -v node >/dev/null 2>&1; then
            node scripts/test_architecture.mjs
        else
            echo "⚠️  [AVISO] node no disponible para validar localmente en este momento."
        fi
    fi
)

echo ""
echo "======================================================================"
echo "🎉 ¡Proyecto $TYPE inicializado con éxito en $TARGET_DIR!"
echo "======================================================================"
if [[ "$TYPE" == "backend" ]]; then
    echo "Próximos pasos:"
    echo "  1. cd $TARGET_DIR"
    echo "  2. cp .env.example .env"
    echo "  3. pytest tests/test_architecture.py -v"
else
    echo "Próximos pasos:"
    echo "  1. cd $TARGET_DIR"
    echo "  2. cp .env.example .env.local"
    echo "  3. npm install"
    echo "  4. npm run test:architecture"
fi
echo "======================================================================"
