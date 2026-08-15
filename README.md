# 📐 Plantilla de SRS & Especificaciones Técnicas (FastAPI + Clean Architecture)

Este repositorio contiene la plantilla estándar de **Especificación de Requisitos de Software (SRS)** y **Especificaciones Técnicas de Diseño** para proyectos backend desarrollados en Python utilizando **FastAPI**, **Clean Architecture (Puertos y Adaptadores)** y principios de **Domain-Driven Design (DDD)**.

---

## 📥 Descargar la Plantilla Directamente (Sin clonar el repo)

Si deseas incorporar únicamente el archivo de especificación en un proyecto existente, ejecuta el comando correspondiente según tu entorno de terminal:

### 🐧 Linux / macOS (Bash / Zsh)

**Con `curl`:**
```bash
curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o srs-spec-fastapi.md
```

**Con `wget`:**
```bash
wget -O srs-spec-fastapi.md https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md
```

**Descargar directamente en carpeta `docs/`:**
```bash
mkdir -p docs && curl -fsSL https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md -o docs/srs-spec-fastapi.md
```

---

### 🪟 Windows (PowerShell)

**Con `Invoke-WebRequest`:**
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "srs-spec-fastapi.md"
```

**Sintaxis corta (`iwr`):**
```powershell
iwr "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "srs-spec-fastapi.md"
```

**Descargar directamente en carpeta `docs/`:**
```powershell
if (!(Test-Path docs)) { New-Item -ItemType Directory -Path docs }; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/datamaq-automation/spec/main/srs-spec-fastapi.md" -OutFile "docs/srs-spec-fastapi.md"
```

---

## 🎯 Propósito

El objetivo de esta plantilla ([`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md)) es servir como guía unificada y contrato técnico previo a la implementación. Facilita:
- Definir con claridad el alcance, actores y requerimientos funcionales (FR) y no funcionales (NFR).
- Estandarizar la arquitectura y estructura de carpetas modular y desacoplada.
- Especificar contratos de API, modelos de dominio, casos de uso y esquemas de base de datos antes de escribir código.
- Garantizar buenas prácticas de calidad de código, tipado estricto y testing.

---

## 📂 Contenido del Repositorio

- **[`srs-spec-fastapi.md`](file:///home/agustin/proyectos_software/spec/srs-spec-fastapi.md)**: Plantilla completa estructurada en 8 secciones clave con placeholders `{reemplazar_...}` listos para completar según las necesidades del proyecto.

---

## 🧱 Estructura de Secciones de la Plantilla

| Sección | Descripción |
| :--- | :--- |
| **1. Introducción y Visión General** | Propósito, alcance, exclusiones (*Out of Scope*) y roles/actores del sistema. |
| **2. Requisitos del Sistema (SRS)** | Requisitos funcionales (FR) y no funcionales (NFR: latencia, throughput, SLA, seguridad). |
| **3. Stack Tecnológico & Convenciones** | Tecnologías base (FastAPI, Pydantic v2, SQLAlchemy 2.0, etc.) y reglas de dependencia. |
| **4. Estructura de Directorios** | Árbol de carpetas estándar (`domain`, `application`, `adapters`, `infrastructure`). |
| **5. Especificaciones Técnicas** | Modelado de dominio (entidades, Value Objects, puertos) y casos de uso con DTOs. |
| **6. Diseño de APIs & Integraciones** | Endpoints REST, esquemas de entrada/salida y códigos de error HTTP. |
| **7. Persistencia & Base de Datos** | Esquemas SQL/DDL, índices y modelos ORM. |
| **8. Estrategia de Testing y Calidad** | Pirámide de pruebas (Unit, Integration, E2E) y herramientas de análisis estático (`ruff`, `pyright`, `pytest`). |

---

## 🚀 Cómo Usar la Plantilla

1. **Obtener la plantilla:**
   Descárgala con los comandos superiores o cópiala a tu nuevo proyecto (ej. `docs/srs-mi-servicio.md`).

2. **Completar los Placeholders:**
   Busca todas las variables marcadas con `{...}` (ej. `{nombre_del_sistema_o_proyecto}`, `{reemplazar_entidad_1}`, etc.) y reemplázalas con las especificaciones reales de tu sistema.

3. **Respetar las Reglas Arquitectónicas:**
   - **Regla de Dependencia:** `domain` no depende de ninguna otra capa; `application` solo de `domain` y `pydantic`; `adapters` no conoce frameworks web ni ORM; `infrastructure` contiene FastAPI, SQLAlchemy y drivers externos.
   - **Imports Absolutos:** Usa siempre `from src.domain...`, evitando imports relativos.
   - **Archivos `__init__.py`:** Deben tener 0 bytes.
   - **Commits:** Sigue la convención [Conventional Commits](https://www.conventionalcommits.org/).

4. **Validación Continua:**
   Utiliza los comandos de linters, formateadores y tests descritos en la sección 8 durante todo el ciclo de desarrollo:
   ```bash
   ruff check .
   ruff format --check .
   pyright
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
