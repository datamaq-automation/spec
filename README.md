# 📐 Plantillas de SRS & Especificaciones Técnicas (SSOT + Constraint Gauntlet)

Este repositorio provee las herramientas y plantillas estándar para diseñar, gobernar y validar proyectos de software bajo los paradigmas **Spec-Driven Development (SDD)**, **Clean Architecture / Feature-Sliced Design**, **Domain-Driven Design (DDD)** y la filosofía de **restricciones extremas (*Constraint Gauntlet*)** de Robert C. Martin ("Uncle Bob").

Incluye plantillas SSOT (*Single Source of Truth*) para **backend** y **frontend**, cada una con su validador de arquitectura estático de cero dependencias.

---

## 📥 Descarga Rápida (Sin clonar el repositorio)

### 1️⃣ Backend — FastAPI + Clean Architecture

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
# Descargar dentro de docs/ y tests/
mkdir -p docs tests && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/srs-spec-backend-fastapi.md -o docs/srs-spec-backend-fastapi.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/test_architecture.py -o tests/test_architecture.py
```

#### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path tests)) { New-Item -ItemType Directory -Path tests }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/srs-spec-backend-fastapi.md" -OutFile "docs/srs-spec-backend-fastapi.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/test_architecture.py" -OutFile "tests/test_architecture.py"
```

---

### 2️⃣ Frontend — Vue 3 + Vite (SPA)

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
# Descargar dentro de docs/ y scripts/
mkdir -p docs scripts && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/srs-spec-frontend-vue-vite.md -o docs/srs-spec-frontend-vue-vite.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/test_architecture.mjs -o scripts/test_architecture.mjs
```

#### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path scripts)) { New-Item -ItemType Directory -Path scripts }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/srs-spec-frontend-vue-vite.md" -OutFile "docs/srs-spec-frontend-vue-vite.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/test_architecture.mjs" -OutFile "scripts/test_architecture.mjs"
```

---

## 📂 Contenido del Repositorio

| Archivo / Carpeta | Tipo | Descripción |
| :--- | :--- | :--- |
| **[`backend/srs-spec-backend-fastapi.md`](backend/srs-spec-backend-fastapi.md)** | Spec | Plantilla SSOT de backend en 5 secciones modulares con placeholders `{reemplazar_...}`. |
| **[`backend/test_architecture.py`](backend/test_architecture.py)** | Validador | Guantelete AST de Clean Architecture y verificación de `__init__.py` de 0 bytes (Python, zero-deps). |
| **[`backend/template/`](backend/template/)** | Scaffolding | Estructura canónica completa de carpetas, `__init__.py` vacíos, `config.py`, `logger.py` y `main.py`. |
| **[`frontend/srs-spec-frontend-vue-vite.md`](frontend/srs-spec-frontend-vue-vite.md)** | Spec | Plantilla SSOT de frontend SPA (Vue + Vite) en 5 secciones modulares. |
| **[`frontend/test_architecture.mjs`](frontend/test_architecture.mjs)** | Validador | Guantelete estático de Feature-Sliced Design y secretos (Node.js, zero-deps). |
| **[`frontend/template/`](frontend/template/)** | Scaffolding | Estructura canónica FSD completa con `package.json`, cliente HTTP Axios tipado y schemas base. |
| **[`.gitignore`](.gitignore)** | Config | Exclusiones estándar para entornos virtuales, `.env`, `node_modules`, cachés y editores. |

---

## 🧱 Estructura Modular de 5 Secciones de las Plantillas SSOT

| Sección | Descripción |
| :--- | :--- |
| **1. Contexto Estratégico & Propuesta de Valor** | Foco de mercado, Buyer/User Personas, Pilares de Valor de la solución, Operaciones y Habilitaciones. |
| **2. Modelo de Negocio Canvas (BMC 9 Bloques)** | Matriz visual de 9 bloques, Organigrama de Agentes IA y Escalera de Valor. |
| **3. Requisitos del Sistema (SRS)** | Requisitos Funcionales (FR-01 al FR-xx) y No Funcionales (NFR-01 al NFR-xx: p95, throughput, seguridad). |
| **4. Stack Tecnológico, Arquitectura & Convenciones** | Arquitectura por capas, Configuración centralizada, Logging, y **Las 7 Reglas Innegociables**. |
| **5. Gobernanza Normativa, Calidad & Matriz de Pruebas** | Estándares de calidad ISO, Conventional Commits y Matriz de Verificación. |

---

## 🛡️ Filosofía: El Guantelete de Restricciones Extremas (*The Constraint Gauntlet*)

> *"Mi estrategia actual es no leer el código generado por mis agentes. Lo que hago en su lugar es rodearlos de **restricciones extremas**: Unit tests, QA procedures, métricas de calidad, mutation testing, coverage... Al final, tengo una confianza altísima en el código porque tuvo que superar todo mi guantelete de restricciones."*
> — **Robert C. Martin ("Uncle Bob")**

Este repositorio implementa esa filosofía mediante un pipeline automatizado y determinista donde los agentes de IA y los desarrolladores deben superar el 100% de las pruebas estáticas de arquitectura antes de que el código sea aceptado.

---

## 🧪 Backend — Las 5 Baterías del Guantelete (`test_architecture.py`)

El archivo [`backend/test_architecture.py`](file:///home/agustin/proyectos_software/spec/backend/test_architecture.py) analiza el Árbol de Sintaxis Abstracta (AST) de todos los archivos en `src/` y `tests/` con **cero dependencias externas**:

1. **`test_init_files_must_be_empty()`:** Comprueba que el 100% de los archivos `__init__.py` tengan exactamente 0 bytes (sin código, docstrings o imports) para prevenir dependencias circulares.
2. **`test_clean_architecture_compliance()`:** Valida la regla de dependencia de capas (Domain puro, Application desacoplada, Adapters agnósticos, Routers delgados).
3. **`test_no_relative_imports()`:** Prohíbe imports relativos en `src/` (`from . import ...` o `from .. import ...`), obligando al uso de imports absolutos (`from src...`).
4. **`test_all_functions_have_type_annotations()`:** Exige que el 100% de las funciones en `src/domain` y `src/application` declaren Type Hints en todos sus parámetros y tipo de retorno.
5. **`test_no_hardcoded_secrets()`:** Detecta y bloquea contraseñas, tokens JWT, API keys o connection strings quemadas en código fuente.

### Modos de Ejecución:

```bash
# Como suite de pruebas en Pytest
pytest tests/test_architecture.py -v

# O como script CLI autónomo (zero-dependencies adicionales)
python3 tests/test_architecture.py
```

---

## 🧪 Frontend — Las 5 Baterías del Guantelete (`test_architecture.mjs`)

El archivo [`frontend/test_architecture.mjs`](file:///home/agustin/proyectos_software/spec/frontend/test_architecture.mjs) analiza estáticamente el árbol de archivos de `src/` (TypeScript + Vue) con **cero dependencias externas**:

1. **`check_layer_dependencies()`:** Valida la regla de dependencia de capas FSD (`shared` puro, `core` acotado, `features` desacopladas, `app` orquestadora).
2. **`check_no_explicit_any()`:** Prohíbe `any`, `@ts-ignore`, `@ts-nocheck` y `@ts-expect-error` en `src/`.
3. **`check_barrel_control()`:** Solo permite `index.ts` como barril de API pública dentro de `features/`; prohíbe `export *` en cascada fuera de ese contexto.
4. **`check_absolute_imports()`:** Prohíbe imports relativos entre capas (`../`), exigiendo el alias `@/`.
5. **`check_no_hardcoded_secrets()`:** Detecta y bloquea API keys, tokens JWT o credenciales quemadas en código fuente.

### Modo de Ejecución:

```bash
# Como script CLI autónomo (zero-dependencies adicionales)
node scripts/test_architecture.mjs
```

---

## 🚀 Cómo Usar en un Proyecto Nuevo

1. **Descargar los archivos:** Usa los comandos de descarga rápida de arriba para traer la spec a `docs/` y el validador a `tests/` (backend) o `scripts/` (frontend).
2. **Configurar el entorno:** Crea los archivos `.env`/`.env.local`, `.env.example` y `.gitignore` en la raíz de tu proyecto según la estructura canónica de cada plantilla.
3. **Completar los Placeholders:** Reemplaza `{...}` en la plantilla SSOT con el diseño específico de tu producto.
4. **Desarrollar y Validar Continuamente:** Ejecuta la matriz de verificación de la plantilla correspondiente.

### Backend (FastAPI)

```bash
# 1. Linter y Formato
ruff check .
ruff format --check .

# 2. Chequeo de Tipos Estricto
pyright

# 3. Validación AST de Arquitectura y __init__.py vacíos
python3 tests/test_architecture.py

# 4. Suite Completa de Tests
pytest
```

### Frontend (Vue + Vite)

```bash
# 1. Linter
npm run lint

# 2. Chequeo de Tipos Estricto
npm run type-check        # vue-tsc --noEmit

# 3. Verificación de Formato
npm run format:check      # prettier --check .

# 4. Validación de Arquitectura y Guantelete de Restricciones
node scripts/test_architecture.mjs

# 5. Suite de Pruebas con cobertura >= 85%
npm run test:unit -- --coverage

# 6. Pruebas End-to-End (Playwright)
npm run test:e2e
```

---

## 🛠️ Stack Tecnológico Recomendado

### Backend — FastAPI + Clean Architecture

- **Lenguaje:** Python 3.10+ (tipado estricto con `typing` y `Annotated`)
- **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/)
- **Validación & Schemas:** [Pydantic v2](https://docs.pydantic.dev/)
- **Configuración:** [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **ORM / Persistencia:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Testing:** [Pytest](https://docs.pytest.org/) + `pytest-asyncio` + `httpx`
- **Linters & Tipado:** [Ruff](https://docs.astral.sh/ruff/) + [Pyright](https://github.com/microsoft/pyright)

### Frontend — Vue 3 + Vite (SPA)

- **Lenguaje:** TypeScript 5.x (modo estricto: `strict`, `noUncheckedIndexedAccess`, `noImplicitAny`)
- **Framework UI:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup lang="ts">`)
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
- **Enrutamiento:** [Vue Router 4](https://router.vuejs.org/)
- **Estado Global:** [Pinia](https://pinia.vuejs.org/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Validación & Schemas:** [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) + [Playwright](https://playwright.dev/)
- **Linters & Tipado:** [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) + [vue-tsc](https://github.com/vuejs/language-tools) + [Prettier](https://prettier.io/)
