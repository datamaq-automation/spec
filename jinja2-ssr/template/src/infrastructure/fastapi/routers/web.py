"""src/infrastructure/fastapi/routers/web.py — Enrutador de vistas HTML renderizadas por Jinja2."""

from __future__ import annotations

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from src.infrastructure.fastapi.templates import templates

router = APIRouter(tags=["Web"])


@router.get("/", response_class=HTMLResponse)
async def home(request: Request) -> HTMLResponse:
    """Renderiza la página de inicio."""
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"title": "Inicio"},
    )
