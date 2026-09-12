"""src/infrastructure/fastapi/templates.py — Configuración de Jinja2Templates y funciones globales."""

from __future__ import annotations

from datetime import datetime
from typing import Any, cast

from fastapi.templating import Jinja2Templates

from src.infrastructure.settings.config import get_settings

_settings = get_settings()

templates = Jinja2Templates(directory=str(_settings.TEMPLATES_DIR))
templates.env.trim_blocks = True
templates.env.lstrip_blocks = True

# Variables y funciones globales accesibles en todos los templates
globals_dict = cast(dict[str, Any], templates.env.globals)
globals_dict["project_name"] = _settings.PROJECT_NAME
globals_dict["year"] = datetime.now().year
