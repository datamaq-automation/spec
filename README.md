# 📐 Plantillas de SRS & Especificaciones Técnicas (SSOT + Constraint Gauntlet)

Este repositorio provee las herramientas y plantillas estándar para diseñar, gobernar y validar proyectos de software bajo los paradigmas **Spec-Driven Development (SDD)**, **Clean Architecture / Feature-Sliced Design**, **Domain-Driven Design (DDD)** y la filosofía de **restricciones extremas (*Constraint Gauntlet*)** de Robert C. Martin ("Uncle Bob").

Incluye plantillas SSOT (*Single Source of Truth*) para **backend** y **frontend**, cada una con su validador de arquitectura estático de cero dependencias.

---

## 📥 Inicialización & Descarga Rápida (Sin clonar el repositorio)

### 🚀 Opción Recomendada: Scaffolding Completo en 1 Comando

Inicializa de inmediato toda la estructura canónica (`src/`, `tests/`, `config.py`, `logger.py`, `.env.example`, `.gitignore`, spec SRS y validador de arquitectura) ejecutando el Guantelete de Restricciones automáticamente:

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
# Para Backend (FastAPI + Clean Architecture)
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- backend mi-backend-app

# Para Frontend (Vue 3 + Vite + FSD)
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- frontend mi-frontend-app

# Para inicializar en el directorio actual:
# curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- backend .
```

#### 🪟 Windows (PowerShell)
```powershell
# Para Backend (FastAPI + Clean Architecture)
& ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type backend -TargetDir mi-backend-app

# Para Frontend (Vue 3 + Vite + FSD)
& ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type frontend -TargetDir mi-frontend-app

# Para inicializar en el directorio actual:
# & ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type backend -TargetDir .
```

##### 🔄 Actualización de Proyectos Existentes (`--upgrade` / `-Upgrade`)
Si tu repositorio ya cuenta con una versión anterior o ya personalizaste tus archivos de especificación, actualiza el ferramental de auditoría (`test_architecture` y `test_god_components`) sin sobreescribir `docs/` ni `src/`:

```bash
# Linux / macOS (Bash)
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- backend . --upgrade

# Windows (PowerShell)
& ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type backend -TargetDir . -Upgrade
```

##### ⚠️ Sobreescritura Forzada con Backup Automático (`--force` / `-Force`)
Si necesitas reinstalar el scaffolding completo sobreescribiendo archivos existentes, el inicializador resguarda automáticamente una copia de seguridad con timestamp de tus especificaciones (`docs/*.backup.<timestamp>`):

```bash
# Linux / macOS (Bash)
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.sh | bash -s -- backend . --force

# Windows (PowerShell)
& ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type backend -TargetDir . -Force
```

---

### 📦 Opción Alternativa: Descarga Mínima (Solo Spec + Validador)

Si ya contás con un proyecto armado y solo necesitás auditarlo o adoptar la especificación técnica:

#### 1️⃣ Backend — FastAPI + Clean Architecture

##### 🐧 Linux / macOS (Bash / Zsh)
```bash
mkdir -p docs tests && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/srs-spec-backend-fastapi.md -o docs/srs-spec-backend-fastapi.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/template/tests/test_architecture.py -o tests/test_architecture.py
```

##### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path tests)) { New-Item -ItemType Directory -Path tests }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/srs-spec-backend-fastapi.md" -OutFile "docs/srs-spec-backend-fastapi.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/backend/template/tests/test_architecture.py" -OutFile "tests/test_architecture.py"
```

---

#### 2️⃣ Frontend — Vue 3 + Vite (SPA)

##### 🐧 Linux / macOS (Bash / Zsh)
```bash
mkdir -p docs scripts && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/srs-spec-frontend-vue-vite.md -o docs/srs-spec-frontend-vue-vite.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/template/scripts/test_architecture.mjs -o scripts/test_architecture.mjs
```

##### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path scripts)) { New-Item -ItemType Directory -Path scripts }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/srs-spec-frontend-vue-vite.md" -OutFile "docs/srs-spec-frontend-vue-vite.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/frontend/template/scripts/test_architecture.mjs" -OutFile "scripts/test_architecture.mjs"
```

---

## 📂 Contenido del Repositorio

| Archivo / Carpeta | Tipo | Descripción |
| :--- | :--- | :--- |
| **[`scripts/init.sh`](scripts/init.sh)** | Script CLI (Bash) | Inicializador canónico para Linux/macOS (descarga scaffolding, spec y corre el Guantelete + God Components). |
| **[`scripts/init.ps1`](scripts/init.ps1)** | Script CLI (PowerShell) | Inicializador canónico para Windows PowerShell (descarga scaffolding, spec y corre el Guantelete + God Components). |
| **[`backend/srs-spec-backend-fastapi.md`](backend/srs-spec-backend-fastapi.md)** | Spec | Plantilla SSOT de backend en 5 secciones modulares con placeholders `{reemplazar_...}`. |
| **[`backend/template/`](backend/template/)** | Scaffolding | Estructura canónica completa de carpetas, `__init__.py` vacíos, `config.py`, `logger.py`, `main.py`, `test_architecture.py`, `test_god_components.py` y `test_clean_design.py`. |
| **[`frontend/srs-spec-frontend-vue-vite.md`](frontend/srs-spec-frontend-vue-vite.md)** | Spec | Plantilla SSOT de frontend SPA (Vue + Vite) en 5 secciones modulares. |
| **[`frontend/template/`](frontend/template/)** | Scaffolding | Estructura canónica FSD completa con `package.json`, cliente Axios, `test_architecture.mjs`, `test_god_components.mjs` y `test_clean_design.mjs`. |
| **[`.gitignore`](.gitignore)** | Config | Exclusiones estándar para entornos virtuales, `.env`, `node_modules`, cachés y editores. |

---

## 🧱 Estructura Modular de 5 Secciones de las Plantillas SSOT

| Sección | Descripción |
| :--- | :--- |
| **1. Contexto Estratégico & Propuesta de Valor** | Foco de mercado, Buyer/User Personas, Pilares de Valor de la solución, Operaciones y Habilitaciones. |
| **2. Modelo de Negocio Canvas (BMC 9 Bloques)** | Matriz visual de 9 bloques, Organigrama de Agentes IA y Escalera de Valor. |
| **3. Requisitos del Sistema (SRS)** | Requisitos Funcionales (FR-01 al FR-xx) y No Funcionales (NFR-01 al NFR-xx: p95, throughput, seguridad). |
| **4. Stack Tecnológico, Arquitectura & Convenciones** | Arquitectura por capas, Configuración centralizada, Logging, y **Las 8 Reglas Innegociables**. |
| **5. Gobernanza Normativa, Calidad & Matriz de Pruebas** | Estándares de calidad ISO, Commits Atómicos (Conventional Commits) y Matriz de Verificación. |

---

## 🛡️ Filosofía: El Guantelete de Restricciones Extremas (*The Constraint Gauntlet*)

> *"Mi estrategia actual es no leer el código generado por mis agentes. Lo que hago en su lugar es rodearlos de **restricciones extremas**: Unit tests, QA procedures, métricas de calidad, mutation testing, coverage... Al final, tengo una confianza altísima en el código porque tuvo que superar todo mi guantelete de restricciones."*
> — **Robert C. Martin ("Uncle Bob")**

Este repositorio implementa esa filosofía mediante un pipeline automatizado y determinista donde los agentes de IA y los desarrolladores deben superar el 100% de las pruebas estáticas de arquitectura antes de que el código sea aceptado.

---

## 🧪 Backend — Las 6 Baterías del Guantelete (`test_architecture.py`)

El archivo [`backend/template/tests/test_architecture.py`](backend/template/tests/test_architecture.py) analiza el Árbol de Sintaxis Abstracta (AST) de todos los archivos en `src/` y `tests/` con **cero dependencias externas**:

1. **`test_init_files_must_be_empty()`:** Comprueba que el 100% de los archivos `__init__.py` tengan exactamente 0 bytes (sin código, docstrings o imports) para prevenir dependencias circulares.
2. **`test_clean_architecture_compliance()`:** Valida la regla de dependencia de capas (Domain puro, Application desacoplada, Adapters agnósticos, Routers delgados).
3. **`test_no_relative_imports()`:** Prohíbe imports relativos en `src/` (`from . import ...` o `from .. import ...`), obligando al uso de imports absolutos (`from src...`).
4. **`test_all_functions_have_type_annotations()`:** Exige que el 100% de las funciones en `src/domain` y `src/application` declaren Type Hints en todos sus parámetros y tipo de retorno.
5. **`test_no_hardcoded_secrets()`:** Detecta y bloquea contraseñas, tokens JWT, API keys o connection strings quemadas en código fuente.
6. **`test_relative_path_headers()`:** Exige que todo archivo `.py` en `src/` y `tests/` comience con un docstring o comentario con su ruta relativa exacta (excluyendo `__init__.py` que debe tener 0 bytes).

### Modos de Ejecución:

```bash
# Como suite de pruebas en Pytest
pytest tests/test_architecture.py -v

# O como script CLI autónomo (zero-dependencies adicionales)
python3 tests/test_architecture.py
```

---

## 🧪 Frontend — Las 7 Baterías del Guantelete (`test_architecture.mjs`)

El archivo [`frontend/template/scripts/test_architecture.mjs`](frontend/template/scripts/test_architecture.mjs) analiza estáticamente el árbol de archivos de `src/`, `scripts/` y `tests/` (TypeScript + Vue) con **cero dependencias externas**:

1. **`check_layer_dependencies()`:** Valida la regla de dependencia de capas FSD (`shared` puro, `core` acotado, `features` desacopladas, `app` orquestadora).
2. **`check_no_explicit_any()`:** Prohíbe `any`, `@ts-ignore`, `@ts-nocheck` y `@ts-expect-error` en `src/`.
3. **`check_barrel_control()`:** Solo permite `index.ts` como barril de API pública dentro de `features/`; prohíbe `export *` en cascada fuera de ese contexto.
4. **`check_absolute_imports()`:** Prohíbe imports relativos entre capas (`../`), exigiendo el alias `@/`.
5. **`check_no_hardcoded_secrets()`:** Detecta y bloquea API keys, tokens JWT o credenciales quemadas en código fuente.
6. **`check_no_vue_in_core()`:** Garantiza que `src/core/` sea 100% TypeScript puro (.ts) prohibiendo componentes `.vue`.
7. **`check_relative_path_headers()`:** Exige que todo archivo `.ts`, `.js`, `.mjs`, `.vue` en `src/`, `scripts/` y `tests/` comience con un comentario de su ruta relativa exacta.

### Modo de Ejecución:

```bash
# Como script CLI autónomo (zero-dependencies adicionales)
node scripts/test_architecture.mjs
```

---

## 🔍 Detección Determinística de Componentes Dios (`test_god_components`)

Ambas plantillas incluyen detectores determinísticos para auditar el crecimiento desmedido de componentes de código fuente (God Files, God Classes y God Functions), arrojando rankings y alertas cuantitativas sobre archivos que requieran evaluación para refactorización.

### Métricas y Umbrales Determinísticos:
- **God Files:** Archivos que superen 400 líneas de código efectivas (sin comentarios/vacíos).
- **God Classes:** Clases con más de 15 métodos o más de 250 líneas.
- **God Functions:** Funciones o métodos con más de 60 líneas o complejidad ciclomática elevada (> 10).

### Formato Dual (Humano & LLM-Ready):
Ambos detectores cuentan con la bandera `--json` pensada para inyectar diagnósticos cuantitativos directamente en el contexto de agentes de IA o LLMs:

```bash
# Backend (Python / Pytest)
python3 tests/test_god_components.py          # Reporte en consola
python3 tests/test_god_components.py --json   # Salida JSON estructurada para LLMs
pytest tests/test_god_components.py -v        # Como suite de Pytest

# Frontend (Node.js)
node scripts/test_god_components.mjs          # Reporte en consola
node scripts/test_god_components.mjs --json   # Salida JSON estructurada para LLMs
```

---

## 🧹 Detección Determinística de Código Muerto y Sobreingeniería (`test_clean_design`)

Ambas plantillas incorporan analizadores estáticos deterministas de zero-dependencies orientados a combatir la **abstracción prematura**, las **interfaces fantasma** y el **código residual** que suelen acumular los agentes de IA (violaciones de YAGNI y KISS):

### Antipatrones Auditados:
- **Backend (Python / AST):**
  - `GHOST_INTERFACE`: Protocolos o clases abstractas (`ABC`/`Protocol`) con 1 sola implementación concreta y sin mocks en tests.
  - `MIDDLE_MAN_METHOD`: Métodos pasamanos de 1 línea que solo delegan argumentos idénticos sin lógica ni política.
  - `DEEP_INHERITANCE`: Clases con profundidad de herencia superior a 2 niveles (`DIT > 2`).
  - `ORPHAN_PRIVATE_SYMBOL`: Funciones, clases o métodos privados no llamados ni referenciados en su módulo.
  - `SPECULATIVE_MICRO_FILE`: Archivos micro-fragmentados (< 10 LOC) que dispersan el contexto.
- **Frontend (Node.js / Grafo de Dependencias):**
  - `UNREACHABLE_FILE`: Archivos huérfanos desconectados del grafo de importación (`main.ts`, router, `App.vue`, tests).
  - `EMPTY_SHELL_COMPONENT`: Componentes SFC de Vue que solo encapsulan un componente hijo sin lógica, props ni slots.
  - `SPECULATIVE_MICRO_FILE`: Archivos `.ts` de menos de 8 LOC fuera de barriles y declaraciones `.d.ts`.

### Comandos de Ejecución:
```bash
# Backend
python3 tests/test_clean_design.py          # Reporte en consola
python3 tests/test_clean_design.py --strict # Modo estricto (falla build si hay violaciones)
python3 tests/test_clean_design.py --json   # Salida JSON para LLMs / agentes
pytest tests/test_clean_design.py -v        # Suite en Pytest

# Frontend
node scripts/test_clean_design.mjs          # Reporte en consola
node scripts/test_clean_design.mjs --strict # Modo estricto
node scripts/test_clean_design.mjs --json   # Salida JSON para LLMs
npm run audit:clean                         # Shortcut npm
```

---

## 📜 Disciplina de Control de Versiones: Commits Atómicos & Semánticos

Tanto para desarrolladores como para agentes de IA que operan en los proyectos, rige el **Principio de Responsabilidad Única aplicado a Git (Commits Atómicos)**:

1. **Una Unidad Lógica Indivisible por Commit:**
   - Queda estrictamente prohibido agrupar en un único commit features nuevas, refactorizaciones, corrección de bugs no relacionados o cambios de formato cosmético.
   - Si la descripción del commit requiere la conjunción **"y"** o **"además"** (e.g. `feat: add auth login and fix button styling`), el commit **no es atómico** y debe dividirse en micro-commits independientes.
2. **Invariante de Compilación & Tests en Verde:**
   - Cada commit individual debe dejar el repositorio en un estado estable, pasando el 100% de los linters, chequeos de tipos y suites de pruebas (cero commits rotos o a medio terminar).
3. **Aislamiento Quirúrgico para Bisect y Revert:**
   - Permite aislar regresiones de forma determinista con `git bisect` y revertir cualquier cambio conflictivo vía `git revert` sin afectar funcionalidades adyacentes.
4. **Convención Estricta [Conventional Commits](https://www.conventionalcommits.org/):**
   - Estructura: `<tipo>(<alcance opcional>): <descripción>`
   - Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`.

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
