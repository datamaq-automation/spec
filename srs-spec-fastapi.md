# SRS-SPECS: {nombre_del_sistema_o_proyecto} — Single Source of Truth (SSOT) & Especificación del Sistema

> **Documento:** `srs-spec-fastapi.md`  
> **Versión:** `{version_documento_ej_1_0_0}`  
> **Estado:** `{borrador_en_revision_aprobado}`  
> **Fecha:** `{fecha_actual_o_release}`  
> **Autor(es):** `{autor_o_equipo_responsable}`  
> **Repositorio / Módulo:** `{organizacion_o_usuario}/{nombre_del_repositorio}`  

---

## 1. Contexto Estratégico & Propuesta de Valor

### 1.1. Foco Estratégico & Alcance
* **Mercado Objetivo:** `{definicion_de_industria_o_nicho_objetivo}`.
* **Buyer Persona (Decisor / Cliente Ideal):** `{perfil_del_comprador_o_tomador_de_decision}`.
* **User Persona (Operador / Usuario Final):** `{perfil_del_usuario_final_u_operador_del_sistema}`.
* **Alcance Geográfico & Modalidad:** `{ej_Servicio_cloud_global_o_despliegue_on_premise_hibrido}`.
* **Fuera de Alcance (*Out of Scope*):** `{lista_de_elementos_o_features_excluidas_en_esta_etapa}`.

### 1.2. Pilares de Valor de la Solución
| Pilar | Enfoque | Implementación en este Sistema |
| :--- | :--- | :--- |
| **1. Activos & Entorno Operativo** | Infraestructura física, dispositivos, hardware o fuentes de datos base. | `{descripcion_interaccion_con_activos_o_dispositivos}` |
| **2. Software & Lógica de Negocio** | Captura, procesamiento en tiempo real, persistencia y APIs. | `{descripcion_del_flujo_de_datos_api_o_interfaz}` |
| **3. Impacto Económico & ROI** | Optimización de costos, generación de ingresos o eficiencia operativa. | `{descripcion_del_impacto_economico_o_ahorro_esperado}` |

### 1.3. Coordinación Operativa, Roles & Seguridad
* **Liderazgo Técnico / Responsable:** `{responsable_tecnico_o_lead_developer}`.
* **Ventanas Operativas & Disponibilidad:** `{restricciones_horarias_y_ventanas_de_mantenimiento_o_soporte}`.
* **Habilitaciones, Normativas & Seguridad:** `{certificaciones_normativas_legales_y_requisitos_de_acceso}`.

---

## 2. Modelo de Negocio Canvas (BMC de 9 Bloques) & Gobernanza

### 2.1. Matriz del Business Model Canvas
| Bloque Canvas | Definición Estratégica | Componentes Clave en el Software |
| :--- | :--- | :--- |
| **1. Socios Clave (KP)** | `{alianzas_proveedores_cloud_o_integradores_externos}` | `{integraciones_apis_o_pasarelas_asociadas}` |
| **2. Actividades Clave (KA)** | `{procesamiento_core_desarrollo_soporte_operaciones}` | `{servicios_y_casos_de_uso_principales}` |
| **3. Recursos Clave (KR)** | `{algoritmos_propiedad_intelectual_bases_de_datos_servidores}` | `{infraestructura_y_modelos_de_datos}` |
| **4. Propuesta de Valor (VP)** | `{beneficio_unico_que_resuelve_el_problema_del_cliente}` | `{endpoints_publicos_dashboards_o_servicios}` |
| **5. Relación con Clientes (CR)** | `{automatizada_autoservicio_soporte_dedicado_alertas}` | `{notificadores_webhooks_email_mensajeria}` |
| **6. Canales de Distribución (CH)** | `{web_api_rest_mobile_brokers_de_mensajeria}` | `{routers_fastapi_controladores_y_suscriptores}` |
| **7. Segmentos de Clientes (CS)** | `{tipos_de_clientes_o_audiencias_objetivo}` | `{roles_rbac_y_politicas_de_autorizacion}` |
| **8. Estructura de Costos (CS)** | `{costos_cloud_licencias_mantenimiento_procesamiento}` | `{optimizacion_de_consultas_y_eficiencia_de_recursos}` |
| **9. Fuentes de Ingresos (RS)** | `{suscripcion_saas_pago_por_uso_licencias_servicios}` | `{pasarelas_de_pago_o_gestion_de_suscripciones}` |

### 2.2. Organigrama Operativo / Gobernanza de Agentes IA (Opcional)
* **`agente-orquestador` / `agente-lead`:** Gobernanza general, alineación técnica y resolución de conflictos entre módulos.
* **`agente-core-dominio`:** Supervisión de la lógica de negocio pura, entidades y reglas de dominio.
* **`agente-integraciones-api`:** Gestión de endpoints, controladores, validación de schemas y contratos externos.
* **`agente-persistencia-datos`:** Modelado de datos, migraciones, optimización de queries y repositorios.
* **`agente-qa-calidad`:** Validación continua de tests AST (`test_architecture.py`), Pyright y cobertura de pruebas.

### 2.3. Escalera de Valor / Modelo de Conversión
* **Nivel de Entrada (*Lead Magnet* / Tier Gratuito):** `{ej_Demo_publica_tier_gratuito_o_herramienta_de_evaluacion}`.
* **Servicio Core (*Core Offering*):** `{ej_Plataforma_principal_funcionalidades_core_o_servicio_profesional}`.
* **Nivel Avanzado (*Enterprise* / Retención):** `{ej_SLA_dedicado_analitica_avanzada_soporte_24_7}`.

---

## 3. Especificación de Requisitos de Software (SRS)

### 3.1. Requisitos Funcionales (FR)
* **FR-01 - Ingesta y Validación de Datos:** El sistema debe procesar eventos/solicitudes de `{fuente_de_entrada}` validando estrictamente los schemas mediante Pydantic v2.
* **FR-02 - Persistencia Transaccional:** El sistema debe almacenar las transacciones en `{motor_bd_ej_PostgreSQL_MySQL_SQLite}` mediante el patrón Repository tipado.
* **FR-03 - Emisión de Eventos y Notificaciones:** El sistema debe emitir alertas/eventos asíncronos vía `{canales_ej_Webhooks_SMTP_MessageBroker}` cuando `{condicion_disparadora}`.
* **FR-04 - Control de Acceso y Autorización:** El sistema debe restringir el acceso a los recursos mediante `{modelo_seguridad_ej_JWT_OAuth2_API_Keys}` y permisos basados en roles (`{roles_del_sistema}`).
* **FR-05 - Seguridad y Anti-Abuso:** El sistema debe implementar rate limiting, sanitización estricta de entradas y mitigación de vulnerabilidades OWASP (SQLi, XSS, SSRF).
* **FR-06 - `{nombre_requisito_especifico_1}`:** El sistema debe `{descripcion_de_accion_y_resultado_esperado}`.
* **FR-07 - `{nombre_requisito_especifico_2}`:** El sistema debe `{descripcion_de_accion_y_resultado_esperado}`.

### 3.2. Requisitos No Funcionales (NFR)
* **NFR-01 - Latencia y Rendimiento:** La latencia p95 en lecturas debe ser inferior a `{latencia_maxima_ms}` ms bajo condiciones normales de operación.
* **NFR-02 - Concurrencia & Throughput:** Capacidad para procesar `{rps_o_mensajes_por_segundo}` `{solicitudes_o_mensajes_por_segundo}` concurrentes sin degradación.
* **NFR-03 - Disponibilidad & Resiliencia:** SLA objetivo del `{sla_porcentaje_ej_99_9}`% con reconexión automática y degradación elegante ante caídas de dependencias externas.
* **NFR-04 - Seguridad y Cifrado:** Cifrado en tránsito (TLS 1.3) y en reposo para datos sensibles; gestión de secretos aislada vía variables de entorno (`.env`).
* **NFR-05 - Conformidad Arquitectónica:** 100% de cumplimiento en pruebas automáticas de AST (`tests/test_architecture.py`) en cada commit o PR.

---

## 4. Stack Tecnológico, Arquitectura & Convenciones (CONVENTIONS)

### 4.1. Stack Tecnológico Base
* **Lenguaje:** Python 3.10+ (Tipado estricto con `typing`, `Annotated`, `dataclasses`).
* **Framework Web:** FastAPI (asíncrono, OpenAPI autodocumentado).
* **Validación & Schemas:** Pydantic v2 (`BaseModel`, `Field`, `ConfigDict`).
* **ORM & Persistencia:** `{reemplazar_orm_ej_SQLAlchemy_2_0_SQLModel}` con soporte asíncrono.
* **Broker & Mensajería (Opcional):** `{reemplazar_broker_ej_MQTT_Kafka_RabbitMQ_Redis}` con `{driver_broker_ej_aiokafka_paho_redis_asyncio}`.
* **Testing:** Pytest (`pytest-asyncio`, `httpx`).
* **Linters & Tipado:** Ruff y Pyright (modo estricto).

### 4.2. Estructura Canónica de Directorios

```
src/
├── domain/                                      # 1. Capa de Dominio Pura (Solo stdlib + dataclasses + Pydantic)
│   └── {bounded_context_tematico}/              # Bounded Context temático
│       ├── __init__.py                          # (0 bytes)
│       ├── entities.py                          # Entidades de negocio con identidad única
│       ├── value_objects.py                     # Value Objects inmutables con validación intrínseca
│       ├── services.py                          # Lógica de dominio multi-entidad / reglas de cálculo
│       ├── ports.py                             # Interfaces abstractas (Protocol / ABC) para persistencia y eventos
│       └── exceptions.py                        # Excepciones de negocio de dominio puro
│
├── application/                                 # 2. Capa de Aplicación (Casos de Uso, DTOs y Mappers)
│   ├── use_cases/                               # Orquestación de lógica de negocio (1 caso de uso = 1 clase/archivo)
│   ├── dtos/                                    # RequestDTO y ResponseDTO tipados con Pydantic
│   └── mappers/                                 # Transformación bidireccional DTO <-> Entity
│
├── adapters/                                    # 3. Capa de Adaptadores (Agnósticos de Frameworks Web)
│   ├── controllers/                             # Controladores de aplicación que coordinan use cases
│   ├── gateways/                                # Adaptadores hacia servicios externos / emisores
│   └── presenters/                              # Mapeo a formatos de salida o códigos de error HTTP/gRPC
│
├── infrastructure/                              # 4. Capa de Infraestructura (Detalles Externos y Frameworks)
│   ├── fastapi/                                 # Servidor FastAPI, routers y dependencias
│   │   ├── routers/                             # Endpoints web (Thin Controllers)
│   │   └── dependencies.py                      # Inyección de dependencias (Depends)
│   ├── {orm_driver_dir}/                        # Modelos ORM y repositorios concretos (ej. sqlalchemy)
│   │   ├── models/                              # DeclarativeBase y esquemas de tablas
│   │   └── repositories/                        # Implementaciones concretas de domain/ports.py
│   ├── {broker_driver_dir}/                     # Daemons/suscriptores para mensajería (si aplica)
│   └── settings/                                # Configuración con pydantic-settings y logging estructurado
│
└── main.py                                      # Entrypoint ASGI (app = create_app())
```

### 4.3. Las Seis Reglas Innegociables de Arquitectura

1. **Regla de Dependencia de Capas (Validada por AST):**
   * `domain` nunca importa de capas externas (`application`, `adapters`, `infrastructure`).
   * `application` solo depende de `domain` y `pydantic`.
   * `adapters` depende de `application` y `domain` (nunca de `infrastructure` ni de FastAPI/ORM).
   * `infrastructure` aísla frameworks, bases de datos y librerías externas.
2. **Desacople Absoluto de Datos (`data/`):**
   * Fuentes de verdad estáticas (JSON, Markdown, YAML) residen en `data/` desacopladas del código ejecutable.
3. **Gobernanza Antialucinación de Parámetros Críticos:**
   * Precios, constantes de ingeniería, reglas tarifarias y fórmulas clave deben provenir de configuración centralizada o base de datos, nunca *hardcoded* en código fuente.
4. **Controladores Delgados (*Thin Controllers*):**
   * Los routers en `infrastructure/fastapi/routers/` no contienen lógica de negocio ni importan ORMs directamente; delegan exclusivamente en `application/use_cases/`.
5. **Imports Absolutos:**
   * Prohibidos los imports relativos (`from . import ...` o `from .. import ...`). Se exige siempre sintaxis absoluta `from src....`.
6. **Tipado Estricto Exhaustivo:**
   * Prohibidas colecciones o variables sin tipo explícito (e.g. `list` sin parámetro genérico `list[str]`, `dict` sin tipar `dict[str, Any]`). Toda función debe especificar tipos de parámetros y retorno validados por Pyright.

---

## 5. Gobernanza Normativa, Calidad & Matriz de Pruebas

### 5.1. Estándares de Calidad de Software
* **Marco de Referencia:** Alineación con buenas prácticas de calidad de software (ISO/IEC 25010 para calidad de producto, ISO/IEC 27001 para seguridad).
* **Trazabilidad de Cambios:** Commits bajo la convención estándar [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

### 5.2. Matriz de Verificación Automatizada Previa a Despliegues

Todos los cambios deben superar el 100% de la siguiente batería de verificación antes de integrarse a la rama principal o desplegarse a producción:

```bash
# 1. Linter y Verificación de Formato
ruff check .
ruff format --check .

# 2. Análisis Estático de Tipos Estricto
pyright

# 3. Validación de Reglas de Clean Architecture y DDD (AST)
python3 tests/test_architecture.py

# 4. Ejecución de la Suite Completa de Pruebas (Unit, Integration, E2E)
pytest --maxfail=1 --disable-warnings -v
```
