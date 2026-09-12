"""src/infrastructure/settings/config.py — Centralización de variables de entorno."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Entorno
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default="INFO")

    # App Web & SSR
    PROJECT_NAME: str = Field(default="jinja2-ssr-app")
    VERSION: str = Field(default="1.0.0")
    API_V1_PREFIX: str = Field(default="/api/v1")
    ALLOWED_HOSTS: list[str] = Field(default_factory=lambda: ["*"])

    # Rutas de Adaptadores de Presentación Web (Opción 1b: dentro de src/adapters/entrypoints/web/)
    TEMPLATES_DIR: Path = Field(
        default=Path(__file__).resolve().parent.parent.parent
        / "adapters"
        / "entrypoints"
        / "web"
        / "templates"
    )
    STATIC_DIR: Path = Field(
        default=Path(__file__).resolve().parent.parent.parent
        / "adapters"
        / "entrypoints"
        / "web"
        / "static"
    )

    # Seguridad
    SECRET_KEY: str = Field(default="change-this-insecure-secret-key-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)

    # Base de Datos (SQLite por defecto)
    DATABASE_URL: str = Field(default="sqlite+aiosqlite:///./data/app.db")


@lru_cache
def get_settings() -> Settings:
    return Settings()
