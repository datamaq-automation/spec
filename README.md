# 📐 Plantilla de SRS & Especificaciones Técnicas (FastAPI + Clean Architecture)

Este repositorio provee las herramientas y plantillas estándar para diseñar, gobernar y validar proyectos backend en Python utilizando **FastAPI**, **Clean Architecture (Puertos y Adaptadores)** y principios de **Domain-Driven Design (DDD)** para el ecosistema DataMaq.

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

### 2️⃣ Descargar el Test de Arquitectura Limpia (`test_architecture.py`)

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

### ⚡ Descargar ambos archivos de una sola vez

#### 🐧 Linux / macOS (Bash / Zsh)
```bash
mkdir -p docs tests && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o docs/srs-spec-fastapi.md && \
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py -o tests/test_architecture.py
```

#### 🪟 Windows (PowerShell)
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; if (!(Test-Path tests)) { New-Item -ItemType Directory -Path tests }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "docs/srs-spec-fastapi.md"; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/test_architecture.py" -OutFile "tests/test_architecture.py"
```

---

## 📂 Contenido del Repositorio

| Archivo | Descripción |
| :--- | :--- |
| **[`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md)** | Plantilla rectora SSOT (Single Source of Truth) en 5 secciones modulares con placeholders `{reemplazar_...}`. |
| **[`test_architecture.py`](file:///home/agustin/proyectos_software/spec/test_architecture.py)** | Suite de pruebas de conformidad arquitectónica mediante análisis estático AST (compatible con Pytest y ejecución CLI sin dependencias externas). |

---

## 🧱 Estructura Modular de 5 Secciones de la Plantilla SSOT

| Sección | Descripción |
| :--- | :--- |
| **1. Contexto Estratégico & Propuesta de Valor** | Foco de mercado, Buyer/User Personas, Trinomio "Fierros + Datos + Dinero", Operaciones y Agenda. |
| **2. Modelo de Negocio Canvas (BMC 9 Bloques)** | Matriz visual de 9 bloques, Organigrama de Agentes IA y Escalera de Conversión (Financiación cruzada). |
| **3. Requisitos del Sistema (SRS)** | Requisitos Funcionales (FR-01 al FR-xx) y No Funcionales (NFR-01 al NFR-xx: rendimiento, concurrencia, seguridad). |
| **4. Stack Tecnológico, Arquitectura & Convenciones** | Clean Architecture (4 capas), Estructura Canónica, APIs, Schemas y **Las 6 Reglas Innegociables**. |
| **5. Gobernanza Normativa, Calidad & Matriz de Pruebas** | Marco ISO 9001 / ISO 27001 y Batería de verificación automatizada (`ruff`, `pyright`, AST `test_architecture.py`, `pytest`). |

---

## 🧪 Validador de Arquitectura (`test_architecture.py`)

El archivo [`test_architecture.py`](file:///home/agustin/proyectos_software/spec/test_architecture.py) analiza el Árbol de Sintaxis Abstracta (AST) de todos los archivos en `src/` para asegurar que se respeten al 100% las reglas de diseño:

1. **Regla de Dominio (`src/domain`):** Núcleo puro. Prohibido importar `application`, `adapters`, `infrastructure`, frameworks web (`FastAPI`, `Starlette`) y drivers/ORMs (`SQLAlchemy`, `pymysql`, `redis`, etc.).
2. **Regla de Aplicación (`src/application`):** Casos de uso. Prohibido importar `adapters`, `infrastructure`, frameworks web y ORMs/drivers de persistencia.
3. **Regla de Adaptadores (`src/adapters`):** Agnosticismo web. Prohibido importar `infrastructure` ni `fastapi`/`starlette`.
4. **Regla de Thin Controllers (`src/infrastructure/fastapi/routers`):** Prohibido importar `sqlalchemy` directamente en routers (deben delegar en la capa de aplicación).
5. **Imports Absolutos:** Prohibidos imports relativos (`from . import ...` o `from .. import ...`). Todos deben ser `from src...`.
6. **Archivos `__init__.py`:** Comprueba que todos los `__init__.py` tengan 0 bytes.

### Ejecución:

```bash
# Como test automatizado en Pytest
pytest tests/test_architecture.py

# O como script CLI independiente
python3 tests/test_architecture.py
```

---

## 🚀 Cómo Usar en un Proyecto Nuevo

1. **Descargar los archivos:** Usa los comandos de descarga rápida de arriba para traer la spec a `docs/` y el validador a `tests/`.
2. **Completar los Placeholders:** Reemplaza `{...}` en [`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md) con las reglas y diseño específicos de tu producto (ej. webapp, telemetría IoT o microservicio).
3. **Desarrollar y Validar Continuamente:**
   ```bash
   # 1. Linter y Formato
   ruff check .
   ruff format --check .

   # 2. Chequeo de Tipos Estricto
   pyright

   # 3. Validación AST de Arquitectura
   python3 tests/test_architecture.py

   # 4. Suite Completa de Tests
   pytest
   ```

---

## 🛠️ Stack Tecnológico Recomendado

- **Lenguaje:** Python 3.10+ (tipado estricto con `typing` y `Annotated`)
- **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/)
- **Validación & Schemas:** [Pydantic v2](https://docs.pydantic.dev/)
- **ORM / Persistencia:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Testing:** [Pytest](https://docs.pytest.org/) + `pytest-asyncio` + `httpx`
- **Linters & Tipado:** [Ruff](https://docs.astral.sh/ruff/) + [Pyright](https://github.com/microsoft/pyright)
