"""test_architecture.py — Validador AST y Pruebas Automáticas de Clean Architecture & DDD.

Verifica estáticamente mediante el Árbol de Sintaxis Abstracta (AST) de Python que todos los
módulos en `src/` cumplan estrictamente con las reglas de dependencia de Clean Architecture y DDD:

  1. Domain: Núcleo puro de negocio (stdlib + Pydantic / dataclasses).
     - Prohibido importar: Application, Adapters, Infrastructure, frameworks web (FastAPI) y ORMs/drivers (SQLAlchemy).
  2. Application: Casos de uso, DTOs y puertos de entrada/salida.
     - Prohibido importar: Adapters, Infrastructure, frameworks web y ORMs/drivers de persistencia.
  3. Adapters: Controladores, Presenters y Gateways agnósticos de frameworks web.
     - Prohibido importar: Infrastructure ni frameworks web (FastAPI/Starlette).
  4. Infrastructure: Frameworks, drivers de BD y routers web.
     - Routers/endpoints actúan como controladores delgados: no deben importar directamente SQLAlchemy/modelos ORM.
  5. Imports Absolutos: Prohibidos imports relativos (`from . import ...` o `from .. import ...`).
  6. __init__.py: Comprueba que los archivos `__init__.py` tengan 0 bytes.

Uso:
  - Con Pytest:  pytest tests/test_architecture.py
  - Como Script: python3 tests/test_architecture.py
"""

from __future__ import annotations

import ast
import os
import sys
from pathlib import Path
from typing import List, Optional, Tuple


def find_project_root(start_path: Optional[Path] = None) -> Path:
    """Encuentra la raíz del proyecto buscando el directorio 'src' hacia arriba."""
    current = (start_path or Path.cwd()).resolve()
    for parent in [current, *current.parents]:
        if (parent / "src").is_dir():
            return parent
    # Si no se encuentra 'src', retorna el directorio de trabajo actual
    return Path.cwd().resolve()


def extract_imports(file_path: Path) -> List[Tuple[str, int, bool]]:
    """Extrae todos los módulos importados en un archivo Python mediante AST.

    Retorna una lista de tuplas: (modulo_importado, numero_de_linea, es_import_relativo)
    """
    try:
        content = file_path.read_text(encoding="utf-8")
        tree = ast.parse(content, filename=str(file_path))
    except Exception as e:
        print(f"[ERROR] No se pudo parsear {file_path}: {e}", file=sys.stderr)
        return []

    imports: List[Tuple[str, int, bool]] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name:
                    imports.append((alias.name, node.lineno, False))
        elif isinstance(node, ast.ImportFrom):
            is_relative = node.level is not None and node.level > 0
            module_name = node.module or ""
            imports.append((module_name, node.lineno, is_relative))
    return imports


def verify_architecture(
    root_dir: Optional[Path] = None,
    enforce_zero_byte_init: bool = True,
    enforce_absolute_imports: bool = True,
) -> List[str]:
    """Verifica todas las reglas de arquitectura y retorna la lista de errores encontrados."""
    root = root_dir or find_project_root()
    src_dir = root / "src"
    errors: List[str] = []

    if not src_dir.exists() or not src_dir.is_dir():
        errors.append(f"[ERROR] No se encontró el directorio de código fuente: {src_dir}")
        return errors

    # Reglas de módulos prohibidos por capa
    domain_forbidden = (
        "fastapi",
        "starlette",
        "sqlalchemy",
        "sqlmodel",
        "tortoise",
        "httpx",
        "requests",
        "aiohttp",
        "pymysql",
        "psycopg",
        "psycopg2",
        "asyncpg",
        "paho",
        "aiokafka",
        "kafka",
        "redis",
        "celery",
        "src.application",
        "src.adapters",
        "src.infrastructure",
        "src.main",
    )

    application_forbidden = (
        "fastapi",
        "starlette",
        "sqlalchemy",
        "sqlmodel",
        "tortoise",
        "pymysql",
        "psycopg",
        "psycopg2",
        "asyncpg",
        "paho",
        "aiokafka",
        "kafka",
        "redis",
        "src.adapters",
        "src.infrastructure",
        "src.main",
    )

    adapters_forbidden = (
        "fastapi",
        "starlette",
        "src.infrastructure",
        "src.main",
    )

    for current_root, _, files in os.walk(src_dir):
        for file in files:
            full_path = Path(current_root) / file
            rel_path = full_path.relative_to(root).as_posix()

            # 1. Verificación de __init__.py de 0 bytes
            if file == "__init__.py" and enforce_zero_byte_init:
                if full_path.stat().st_size != 0:
                    errors.append(
                        f"[INIT NO VACÍO] {rel_path} debe tener exactamente 0 bytes (tamaño actual: {full_path.stat().st_size} bytes)."
                    )
                continue

            if not file.endswith(".py"):
                continue

            imports = extract_imports(full_path)

            for module_name, lineno, is_relative in imports:
                # 2. Verificación de imports relativos
                if enforce_absolute_imports and is_relative:
                    errors.append(
                        f"[IMPORT RELATIVO PROHIBIDO] {rel_path}:{lineno} contiene un import relativo. Use imports absolutos ('from src...')."
                    )

                # 3. Regla de Dominio: Núcleo puro
                if "src/domain" in rel_path:
                    if any(module_name.startswith(pkg) for pkg in domain_forbidden):
                        errors.append(
                            f"[DOMINIO VIOLADO] {rel_path}:{lineno} importa módulo prohibido '{module_name}'."
                        )

                # 4. Regla de Aplicación: Casos de uso
                elif "src/application" in rel_path:
                    if any(module_name.startswith(pkg) for pkg in application_forbidden):
                        errors.append(
                            f"[APLICACIÓN VIOLADA] {rel_path}:{lineno} importa módulo prohibido '{module_name}'."
                        )

                # 5. Regla de Adaptadores: Controladores y Presenters agnósticos
                elif "src/adapters" in rel_path:
                    if any(module_name.startswith(pkg) for pkg in adapters_forbidden):
                        errors.append(
                            f"[ADAPTADORES VIOLADO] {rel_path}:{lineno} importa módulo prohibido '{module_name}'."
                        )

                # 6. Regla de Routers en Infraestructura (Thin Controllers)
                elif "src/infrastructure/fastapi/routers" in rel_path or "src/infrastructure/fastapi/routes" in rel_path:
                    if any(module_name.startswith(pkg) for pkg in ("sqlalchemy", "sqlmodel")):
                        errors.append(
                            f"[CONTROLADOR NO DELGADO] {rel_path}:{lineno} importa '{module_name}' directamente (debe delegar en Application / Casos de Uso)."
                        )

    return errors


def test_clean_architecture_compliance():
    """Test de Pytest para verificar automáticamente las reglas de arquitectura en CI/CD."""
    errors = verify_architecture()
    assert not errors, (
        f"\n❌ Se detectaron {len(errors)} violaciones de Clean Architecture & DDD:\n\n"
        + "\n".join(f"  • {err}" for err in errors)
        + "\n"
    )


def main() -> None:
    """CLI runner para ejecutar la verificación manualmente."""
    print("🔍 Analizando conformidad arquitectónica en src/...")
    errors = verify_architecture()
    if errors:
        print(f"\n❌ [FAIL] Se detectaron {len(errors)} violaciones de arquitectura:\n")
        for err in errors:
            print(f"  • {err}")
        print("\nRevise las reglas de Clean Architecture y corrija las importaciones.")
        sys.exit(1)
    else:
        print("✅ [PASS] 100% de las reglas de Clean Architecture, Hexagonal y DDD fueron respetadas.")
        sys.exit(0)


if __name__ == "__main__":
    main()
