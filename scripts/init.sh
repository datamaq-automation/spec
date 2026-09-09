#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# init.sh — Scaffolding y Setup Canónico (Uncle Bob & Clean/FSD Spec)
# Repositorio: datamaq-automation/spec
#
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- [backend|frontend] [DIRECTORIO_DESTINO] [--upgrade|--force]
#   O localmente:
#   ./scripts/init.sh [backend|frontend] [DIRECTORIO_DESTINO] [--upgrade|--force]
# ==============================================================================

REPO="datamaq-automation/spec"
BRANCH="main"
TARBALL_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}"
RAW_BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

TYPE=""
TARGET_DIR=""
MODE="init"

print_usage() {
    echo ""
    echo "Uso: $0 [backend|frontend] [DIRECTORIO_DESTINO] [--upgrade|--force]"
    echo ""
    echo "Modos:"
    echo "  (por defecto) : Inicialización segura. Se detiene si detecta un proyecto existente."
    echo "  --upgrade     : Actualiza únicamente validadores (tests/scripts) y .pre-commit-config.yaml."
    echo "                  No toca src/, docs/ ni configuraciones personalizadas."
    echo "  --force       : Sobreescribe el template completo realizando backup preventivo de docs/."
    echo ""
    echo "Ejemplos:"
    echo "  $0 backend mi-backend-app"
    echo "  $0 frontend . --upgrade"
    echo "  $0 backend . --force"
    echo ""
}

# Parseo de argumentos
for arg in "$@"; do
    case "$arg" in
        backend|frontend)
            TYPE="$arg"
            ;;
        --upgrade)
            MODE="upgrade"
            ;;
        --force)
            MODE="force"
            ;;
        --help|-h)
            print_usage
            exit 0
            ;;
        *)
            if [[ -z "$TARGET_DIR" ]]; then
                TARGET_DIR="$arg"
            fi
            ;;
    esac
done

if [[ -z "$TYPE" ]]; then
    echo "❌ [ERROR] Debe especificar el tipo de proyecto: 'backend' o 'frontend'."
    print_usage
    exit 1
fi

if [[ -z "$TARGET_DIR" ]]; then
    TARGET_DIR="."
fi

SPEC_FILE_NAME="srs-spec-${TYPE}-fastapi.md"
if [[ "$TYPE" == "frontend" ]]; then
    SPEC_FILE_NAME="srs-spec-frontend-vue-vite.md"
fi
SPEC_PATH="${TARGET_DIR}/docs/${SPEC_FILE_NAME}"

echo "======================================================================"
echo "🚀 Operación: $TYPE (Modo: $MODE)"
echo "📂 Destino: $(mkdir -p "$TARGET_DIR" && cd "$TARGET_DIR" && pwd)"
echo "======================================================================"

mkdir -p "$TARGET_DIR"

# Detección de proyecto preexistente
PROJECT_EXISTS=false
if [[ -f "$SPEC_PATH" || -d "${TARGET_DIR}/src" || -f "${TARGET_DIR}/package.json" || -f "${TARGET_DIR}/requirements.txt" ]]; then
    PROJECT_EXISTS=true
fi

if [[ "$PROJECT_EXISTS" == "true" && "$MODE" == "init" ]]; then
    echo "⚠️  [ADVERTENCIA] Se detectó un proyecto preexistente en '$TARGET_DIR'."
    echo "Para evitar la sobreescritura accidental de tu especificación personalizada y código fuente:"
    echo "  --upgrade : Actualiza únicamente validadores (tests/scripts) y .pre-commit-config.yaml"
    echo "  --force   : Sobreescribe el template completo (realiza backup preventivo de docs/)"
    echo ""
    echo "Ejemplo:"
    echo "  $0 $TYPE $TARGET_DIR --upgrade"
    echo "  $0 $TYPE $TARGET_DIR --force"
    exit 1
fi

if [[ "$MODE" == "upgrade" ]]; then
    echo "🔄 Actualizando validadores arquitectónicos, tooling y guía pedagógica..."
    mkdir -p "${TARGET_DIR}/docs"
    curl -fsSL "${RAW_BASE_URL}/docs/guia-andamiaje-proyectos.md" -o "${TARGET_DIR}/docs/guia-andamiaje-proyectos.md"
    if [[ "$TYPE" == "backend" ]]; then
        mkdir -p "${TARGET_DIR}/tests"
        curl -fsSL "${RAW_BASE_URL}/backend/template/tests/test_architecture.py" -o "${TARGET_DIR}/tests/test_architecture.py"
        curl -fsSL "${RAW_BASE_URL}/backend/template/tests/test_god_components.py" -o "${TARGET_DIR}/tests/test_god_components.py"
        curl -fsSL "${RAW_BASE_URL}/backend/template/tests/test_clean_design.py" -o "${TARGET_DIR}/tests/test_clean_design.py"
        curl -fsSL "${RAW_BASE_URL}/backend/template/.pre-commit-config.yaml" -o "${TARGET_DIR}/.pre-commit-config.yaml"
    else
        mkdir -p "${TARGET_DIR}/scripts"
        curl -fsSL "${RAW_BASE_URL}/frontend/template/scripts/test_architecture.mjs" -o "${TARGET_DIR}/scripts/test_architecture.mjs"
        curl -fsSL "${RAW_BASE_URL}/frontend/template/scripts/test_god_components.mjs" -o "${TARGET_DIR}/scripts/test_god_components.mjs"
        curl -fsSL "${RAW_BASE_URL}/frontend/template/scripts/test_clean_design.mjs" -o "${TARGET_DIR}/scripts/test_clean_design.mjs"
        curl -fsSL "${RAW_BASE_URL}/frontend/template/.pre-commit-config.yaml" -o "${TARGET_DIR}/.pre-commit-config.yaml"
    fi
else
    # Modo init o force
    if [[ "$MODE" == "force" && -f "$SPEC_PATH" ]]; then
        BACKUP_SPEC="${SPEC_PATH}.backup.$(date +%Y%m%d%H%M%S)"
        echo "🛡️  Realizando backup preventivo de la especificación en: $BACKUP_SPEC"
        cp "$SPEC_PATH" "$BACKUP_SPEC"
    fi

    # 1. Descargar y extraer el template correspondiente
    echo "📦 1/3 Descargando scaffolding del template ($TYPE)..."
    curl -sL "$TARBALL_URL" | tar -xzf - --strip-components=3 -C "$TARGET_DIR" "spec-${BRANCH}/${TYPE}/template"

    # 2. Descargar la especificación técnica SRS y guía pedagógica a docs/
    echo "📄 2/3 Descargando especificación SRS y guía pedagógica a docs/..."
    mkdir -p "${TARGET_DIR}/docs"
    if [[ "$TYPE" == "backend" ]]; then
        curl -fsSL "${RAW_BASE_URL}/backend/srs-spec-backend-fastapi.md" -o "$SPEC_PATH"
    else
        curl -fsSL "${RAW_BASE_URL}/frontend/srs-spec-frontend-vue-vite.md" -o "$SPEC_PATH"
    fi
    curl -fsSL "${RAW_BASE_URL}/docs/guia-andamiaje-proyectos.md" -o "${TARGET_DIR}/docs/guia-andamiaje-proyectos.md"
fi

# Validar de inmediato el Guantelete de Restricciones
echo "🛡️  Ejecutando Guantelete de Restricciones sobre el proyecto..."
(
    cd "$TARGET_DIR"
    if [[ "$TYPE" == "backend" ]]; then
        if command -v python3 >/dev/null 2>&1; then
            python3 tests/test_architecture.py
            python3 tests/test_god_components.py
            python3 tests/test_clean_design.py
        else
            echo "⚠️  [AVISO] python3 no disponible para validar localmente en este momento."
        fi
    else
        if command -v node >/dev/null 2>&1; then
            node scripts/test_architecture.mjs
            node scripts/test_god_components.mjs
            node scripts/test_clean_design.mjs
        else
            echo "⚠️  [AVISO] node no disponible para validar localmente en este momento."
        fi
    fi
)

echo ""
echo "======================================================================"
if [[ "$MODE" == "upgrade" ]]; then
    echo "🎉 ¡Validadores y tooling de $TYPE actualizados con éxito en $TARGET_DIR!"
else
    echo "🎉 ¡Proyecto $TYPE inicializado con éxito en $TARGET_DIR!"
fi
echo "======================================================================"
if [[ "$TYPE" == "backend" ]]; then
    echo "Próximos pasos:"
    echo "  1. cd $TARGET_DIR"
    echo "  2. cp .env.example .env (si es un proyecto nuevo)"
    echo "  3. pytest tests/test_architecture.py -v"
else
    echo "Próximos pasos:"
    echo "  1. cd $TARGET_DIR"
    echo "  2. cp .env.example .env.local (si es un proyecto nuevo)"
    echo "  3. npm install"
    echo "  4. npm run test:all"
fi
echo "======================================================================"
