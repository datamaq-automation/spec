# 📐 Plantilla de SRS & Especificaciones Técnicas (FastAPI + Clean Architecture)

Este repositorio provee las herramientas y plantillas estándar para diseñar, gobernar y validar proyectos backend en Python utilizando **FastAPI**, **Clean Architecture (Puertos y Adaptadores)** y principios de **Domain-Driven Design (DDD)**.

---

## 📥 Descarga Rápida (Sin clonar el repositorio)

Puedes incorporar los archivos directamente en tu proyecto existente ejecutando los siguientes comandos en tu terminal:

### 1️⃣ Descargar la Especificación SRS (`srs-spec-fastapi.md`)

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
# En la raíz del proyecto
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o srs-spec-fastapi.md

# O directamente dentro de docs/
mkdir -p docs && curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o docs/srs-spec-fastapi.md
```

#### 🪟 Windows (PowerShell)
```powershell
# En la raíz del proyecto
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "srs-spec-fastapi.md"

# O directamente dentro de docs/
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "docs/srs-spec-fastapi.md"
```

---

### 2️⃣ Descargar el Test de Arquitectura y __init__.py (`test_architecture.py`)

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
# Descargar dentro de tests/
mkdir -p tests && curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py -o tests/test_architecture.py
```

#### 🪟 Windows (PowerShell)
```powershell
# Descargar dentro de tests/
if (!(Test-Path tests)) { New-Item -ItemType Directory -Path tests }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py" -OutFile "tests/test_architecture.py"
```

---

### 3️⃣ Descargar la Plantilla de Variables de Entorno (`.env.example`)

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/.env.example -o .env.example
```

#### 🪟 Windows (PowerShell)
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/.env.example" -OutFile ".env.example"
```

---

### ⚡ Descargar el Pack Completo de una Sola Vez

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
mkdir -p docs tests && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o docs/srs-spec-fastapi.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py -o tests/test_architecture.py && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/.env.example -o .env.example
```

#### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path tests)) { New-Item -ItemType Directory -Path tests }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "docs/srs-spec-fastapi.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py" -OutFile "tests/test_architecture.py"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/.env.example" -OutFile ".env.example"
```

---

## 📂 Contenido del Repositorio

| Archivo | Descripción |
| :--- | :--- |
| **[`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md)** | Plantilla rectora SSOT (Single Source of Truth) en 5 secciones modulares con placeholders `{reemplazar_...}`. |
| **[`test_architecture.py`](file:///home/agustin/proyectos_software/spec/test_architecture.py)** | Suite de pruebas de conformidad arquitectónica y verificación de `__init__.py` de 0 bytes vía análisis estático AST. |
| **[`.env.example`](file:///home/agustin/proyectos_software/spec/.env.example)** | Plantilla canónica de variables de entorno fuertemente tipadas consumidas por `pydantic-settings`. |
| **[`.gitignore`](file:///home/agustin/proyectos_software/spec/.gitignore)** | Exclusiones estándar para entornos virtuales, `.env`, cachés de linters y editores. |

---

## ⚙️ Configuración y Logging Centralizado

La plantilla especifica el patrón canónico para la capa de infraestructura de settings:

* **`src/infrastructure/settings/config.py`:** Define la clase `Settings` con `pydantic_settings.BaseSettings` y singleton `@lru_cache() def get_settings() -> Settings:`. Carga variables de entorno desde `.env` con tipado estricto.
* **`src/infrastructure/settings/logger.py`:** Inicializa el logging estructurado de la aplicación desacoplado y gobernado por `settings.LOG_LEVEL`.
* **Gobernanza de Seguridad:** El archivo `.env` **nunca** se versiona en Git (protegido por `.gitignore`). El archivo `.env.example` guía la configuración en entornos locales y pipelines CI/CD.

---

## 🧪 Validador de Arquitectura (`test_architecture.py`)

El archivo [`test_architecture.py`](file:///home/agustin/proyectos_software/spec/test_architecture.py) analiza el AST de todos los archivos en `src/` y `tests/` para garantizar el 100% de cumplimiento de:

1. **`test_init_files_must_be_empty()`:** Verifica que el 100% de los archivos `__init__.py` tengan exactamente 0 bytes (sin imports, lógica o docstrings) para evitar dependencias circulares.
2. **`test_clean_architecture_compliance()`:**
   - **Domain (`src/domain`):** Núcleo puro. Prohibido importar `application`, `adapters`, `infrastructure`, frameworks web (`FastAPI`) y librerías de BD/IO (`SQLAlchemy`, `pymysql`, `redis`, etc.).
   - **Application (`src/application`):** Casos de uso. Prohibido importar `adapters`, `infrastructure`, frameworks web y ORMs.
   - **Adapters (`src/adapters`):** Agnosticismo web. Prohibido importar `infrastructure` ni `fastapi`/`starlette`.
   - **Thin Controllers (`src/infrastructure/fastapi/routers`):** Prohibido importar ORMs directamente en endpoints.
   - **Imports Absolutos:** Prohibidos imports relativos (`from . import ...` o `from .. import ...`). Todos deben ser `from src...`.

### Modos de Ejecución:

```bash
# Como suite de pruebas en Pytest (ambos tests automáticos)
pytest tests/test_architecture.py

# O como script CLI autónomo (zero-dependencies adicionales)
python3 tests/test_architecture.py
```

---

## 🧱 Estructura Modular de 5 Secciones de la Plantilla SSOT

| Sección | Descripción |
| :--- | :--- |
| **1. Contexto Estratégico & Propuesta de Valor** | Foco de mercado, Buyer/User Personas, Pilares de Valor de la solución, Operaciones y Habilitaciones. |
| **2. Modelo de Negocio Canvas (BMC 9 Bloques)** | Matriz visual de 9 bloques, Organigrama de Agentes IA y Escalera de Valor. |
| **3. Requisitos del Sistema (SRS)** | Requisitos Funcionales (FR-01 al FR-xx) y No Funcionales (NFR-01 al NFR-xx: p95, throughput, seguridad). |
| **4. Stack Tecnológico, Arquitectura & Convenciones** | Clean Architecture (4 capas), Settings con Pydantic Settings, Logging, y **Las 7 Reglas Innegociables**. |
| **5. Gobernanza Normativa, Calidad & Matriz de Pruebas** | Estándares de calidad ISO, Conventional Commits y Matriz de Verificación (`ruff`, `pyright`, AST `test_architecture.py`, `pytest`). |

---

## 🚀 Cómo Usar en un Proyecto Nuevo

1. **Descargar el pack:** Usa los comandos de descarga rápida de arriba para traer la spec a `docs/`, el validador a `tests/` y `.env.example` a la raíz.
2. **Configurar el entorno:** Copia `.env.example` a `.env` y ajusta los valores locales.
3. **Completar los Placeholders:** Reemplaza `{...}` en [`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md) con el diseño específico de tu producto.
4. **Desarrollar y Validar Continuamente:**
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

---

## 🛠️ Stack Tecnológico Recomendado

- **Lenguaje:** Python 3.10+ (tipado estricto con `typing` y `Annotated`)
- **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/)
- **Validación & Schemas:** [Pydantic v2](https://docs.pydantic.dev/)
- **Configuración:** [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **ORM / Persistencia:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Testing:** [Pytest](https://docs.pytest.org/) + `pytest-asyncio` + `httpx`
- **Linters & Tipado:** [Ruff](https://docs.astral.sh/ruff/) + [Pyright](https://github.com/microsoft/pyright)
