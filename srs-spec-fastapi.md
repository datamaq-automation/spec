# SRS-SPECS: {nombre_del_sistema_o_proyecto} — Single Source of Truth (SSOT) & Especificación del Sistema

> **Documento:** `srs-spec-fastapi.md`  
> **Versión:** `{version_documento_ej_1_0_0}`  
> **Estado:** `{borrador_en_revision_aprobado}`  
> **Fecha:** `{fecha_actual_o_release}`  
> **Autor(es):** `{autor_o_equipo_responsable}`  
> **Repositorio / Módulo:** `datamaq-automation/{nombre_del_repositorio}`  

---

## 1. Contexto Estratégico & Propuesta de Valor

### 1.1. Foco Estratégico Exclusivo
* **Mercado Objetivo:** `{definicion_de_industria_o_nicho_ej_Plantas_industriales_PBA_y_CABA}`.
* **Buyer Persona / Cliente Ideal:** `{perfil_ej_Jefes_de_Mantenimiento_Gerentes_de_Planta_Directores_Tecnicos}`.
* **User Persona (Operador/Usuario Final):** `{perfil_ej_Operarios_de_linea_Tecnicos_electromecanicos_Alumnos_LMS}`.
* **Alcance Geográfico & Modalidad:** `{ej_Atencion_presencial_en_planta_y_servicios_digitales_cloud}`.
* **Fuera de Alcance (*Out of Scope*):** `{lista_de_elementos_o_features_excluidas_en_esta_etapa}`.

### 1.2. Trinomio de Valor ("Fierros + Datos + Dinero")
| Pilar | Enfoque | Implementación en este Sistema |
| :--- | :--- | :--- |
| **1. Fierros (Hardware & Planta)** | Activos físicos, tableros, VFDs, sensores IoT y maquinaria. | `{descripcion_interaccion_con_hardware_o_dispositivos}` |
| **2. Datos (Software & Telemetría)** | Captura, streaming en tiempo real, persistencia y análisis. | `{descripcion_del_flujo_de_datos_api_o_dashboard}` |
| **3. Dinero (ROI & Finanzas)** | Ahorro energético, eliminación de multas y optimización de Opex. | `{descripcion_del_impacto_economico_o_modelo_monetizacion}` |

### 1.3. Atención Directa, Habilitaciones & Coordinación Operativa
* **Liderazgo Técnico:** `{responsable_tecnico_ej_Agustin_Bustos}`.
* **Ventanas Operativas & Agenda:** `{restricciones_horarias_y_ventanas_de_mantenimiento}`.
* **Seguridad y Habilitaciones:** `{certificaciones_seguros_ART_y_permisos_de_ingreso_a_planta}`.

---

## 2. Modelo de Negocio Canvas (BMC Oficial de 9 Bloques)

### 2.1. Matriz Visual del Business Model Canvas
| Bloque Canvas | Definición Estratégica | Componentes Clave en el Software |
| :--- | :--- | :--- |
| **1. Socios Clave (KP)** | `{socios_ej_Proveedores_IoT_Banco_Provincia_Distribuidores}` | `{integraciones_o_pasarelas_asociadas}` |
| **2. Actividades Clave (KA)** | `{actividades_ej_Ingesta_telemetria_Diagnostico_LMS}` | `{servicios_y_casos_de_uso_core}` |
| **3. Recursos Clave (KR)** | `{recursos_ej_Algoritmos_AST_Servidores_MQTT_Base_Datos}` | `{infraestructura_y_modelos_de_datos}` |
| **4. Propuesta de Valor (VP)** | `{propuesta_ej_Monitoreo_electrico_predictivo_en_tiempo_real}` | `{endpoints_publicos_y_dashboards}` |
| **5. Relación con Clientes (CR)** | `{relacion_ej_Atencion_tecnica_directa_y_alertas_multi_canal}` | `{notificadores_telegram_smtp_webhooks}` |
| **6. Canales de Distribución (CH)** | `{canales_ej_API_REST_Web_landing_MQTT_Broker}` | `{routers_fastapi_y_suscriptores}` |
| **7. Segmentos de Clientes (CS)** | `{segmentos_ej_Industrias_manufactura_Alumnos_tecnicos}` | `{roles_rbac_y_permisos_de_acceso}` |
| **8. Estructura de Costos (CS)** | `{costos_ej_Servidores_cloud_Conectividad_Mantenimiento}` | `{optimizacion_de_consultas_y_latencia}` |
| **9. Fuentes de Ingresos (RS)** | `{ingresos_ej_SaaS_Mensual_Auditorias_Presenciales_Cursos}` | `{pasarelas_de_pago_o_lead_capture}` |

### 2.2. Organigrama Ejecutivo de Agentes IA (Asignación por Bloque)
* **`agente-ceo`:** Gobernanza general, alineación estratégica y resolución de conflictos entre módulos.
* **`agente-telemetria` / `agente-core`:** Supervisión de la ingesta de datos, integridad de paquetes y procesamiento de señales.
* **`agente-leads` / `agente-marketing`:** Gestión de formularios de contacto, validación anti-spam y entrega multicanal.
* **`agente-lms` / `agente-educacion`:** Control de acceso a cursos, segregación de material comercial vs. cátedra académica.
* **`agente-qa`:** Validación continua de tests AST (`test_architecture.py`), Pyright y cobertura de pruebas.

### 2.3. Escalera de Conversión & Financiación Cruzada
* **Lead Magnet (Servicios Digitales $0):** `{ej_Simuladores_online_monitoreo_publico_demo_web}`.
* **Servicio Core Presencial (Motor de Financiación):** `{ej_Montaje_IoT_Auditorias_cos_phi_Mantenimiento_VFD}`.
* **Retención & Expansión:** `{ej_Suscripcion_mensual_telemetria_cloud_y_soporte_24_7}`.

---

## 3. Especificación de Requisitos de Software (SRS)

### 3.1. Requisitos Funcionales (FR)
* **FR-01 - Ingesta y Procesamiento Core:** El sistema debe procesar eventos/solicitudes de `{fuente_de_datos}` validando integridad de schema con Pydantic v2.
* **FR-02 - Persistencia Transaccional:** El sistema debe persistir las operaciones en `{motor_bd_ej_MySQL_MariaDB_PostgreSQL}` mediante repositorios tipados.
* **FR-03 - Notificaciones & Multi-canal:** El sistema debe emitir alertas críticas asíncronas vía `{canales_notificacion_ej_Telegram_SMTP_Webhooks}` ante `{condicion_disparadora}`.
* **FR-04 - Control de Acceso y Segregación:** El sistema debe segregar el acceso según roles (`{roles_ej_admin_tecnico_cliente_alumno}`).
* **FR-05 - Seguridad y Anti-Abuso:** El sistema debe contar con rate limiting y sanitización estricta de entradas (prevención de SQLi, XSS y SSRF).
* **FR-06 - `{nombre_requisito_especifico_1}`:** El sistema debe `{accion_especifica_de_negocio}`.
* **FR-07 - `{nombre_requisito_especifico_2}`:** El sistema debe `{accion_especifica_de_negocio}`.

### 3.2. Requisitos No Funcionales (NFR)
* **NFR-01 - Latencia y Rendimiento:** Percentil 95 (p95) inferior a `{latencia_maxima_ms}` ms en consultas y procesamiento en tiempo real.
* **NFR-02 - Concurrencia & Throughput:** Capacidad para soportar `{rps_o_mensajes_por_segundo}` operaciones concurrentes sin degradación.
* **NFR-03 - Disponibilidad & Resiliencia:** SLA objetivo del `{sla_porcentaje_ej_99_9}`% con reconexión automática y colas de reintento.
* **NFR-04 - Seguridad y Cifrado:** Datos en tránsito cifrados vía TLS 1.3 y secretos gestionados mediante variables de entorno aisladas (`.env`).
* **NFR-05 - Conformidad Arquitectónica:** 100% de cumplimiento en pruebas de AST (`tests/test_architecture.py`) en cada commit/PR.

---

## 4. Stack Tecnológico, Arquitectura & Convenciones (CONVENTIONS)

### 4.1. Stack Tecnológico Oficial
* **Lenguaje:** Python 3.10+ (Tipado estricto con `typing`, `Annotated`, `dataclasses`).
* **Framework Web:** FastAPI (asíncrono, OpenAPI autodocumentado).
* **Validación & Schemas:** Pydantic v2 (`BaseModel`, `Field`, `ConfigDict`).
* **ORM & Persistencia:** SQLAlchemy 2.0 (Declarative Base, async sessions) / Drivers nativos.
* **Broker & Streaming (si aplica):** `{broker_ej_Mosquitto_MQTT_Kafka_RabbitMQ}` con `{driver_ej_paho_mqtt_aiokafka}`.
* **Calidad & Linters:** Pytest, Ruff y Pyright (modo estricto).

### 4.2. Estructura Canónica de Directorios

```
src/
├── domain/                                      # 1. Capa de Dominio Pura (Solo stdlib + dataclasses + Pydantic)
│   └── {bounded_context_tematico}/              # Bounded Context temático
│       ├── __init__.py                          # (0 bytes)
│       ├── entities.py                          # Entidades de negocio con identidad única
│       ├── value_objects.py                     # Value Objects inmutables con validación intrínseca
│       ├── services.py                          # Lógica de dominio multi-entidad
│       ├── ports.py                             # Interfaces abstractas (Protocol / ABC) para persistencia y eventos
│       └── exceptions.py                        # Excepciones de negocio de dominio puro
│
├── application/                                 # 2. Capa de Aplicación (Casos de Uso, DTOs y Mappers)
│   ├── use_cases/                               # Orquestación de lógica de negocio (1 caso de uso = 1 archivo/clase)
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
│   ├── sqlalchemy/                              # Modelos ORM y repositorios concretos
│   │   ├── models/                              # DeclarativeBase y esquemas de tablas
│   │   └── repositories/                        # Implementaciones concretas de domain/ports.py
│   ├── {broker_driver_dir}/                     # Daemons/suscriptores para mensajería (MQTT/Kafka)
│   └── settings/                                # Configuración con pydantic-settings y logging estructurado
│
└── main.py                                      # Entrypoint ASGI (app = create_app())
```

### 4.3. Las Seis Reglas Innegociables de Arquitectura

1. **Regla de Dependencia de Capas (Validada por AST):**
   * `domain` nunca importa de capas externas.
   * `application` solo depende de `domain` y `pydantic`.
   * `adapters` depende de `application` y `domain` (nunca de `infrastructure` ni de FastAPI/SQLAlchemy).
   * `infrastructure` aísla frameworks, bases de datos y librerías externas.
2. **Desacople Absoluto de Datos (`data/`):**
   * Los datos estáticos o fuentes de verdad (JSON, Markdown, YAML) residen en `data/` desacoplados de la lógica.
3. **Gobernanza Antialucinación de Precios / Parámetros Críticos:**
   * Precios, coeficientes de ingeniería y fórmulas financieras provienen de configuración centralizada o base de datos, nunca quemados en código (*hardcoded*).
4. **Controladores Delgados (*Thin Controllers*):**
   * Las rutas en `infrastructure/fastapi/routers/` no contienen lógica de negocio ni importan SQLAlchemy directamente; delegan en `application/use_cases/`.
5. **Imports Absolutos:**
   * Prohibidos los imports relativos (`from . import ...` o `from .. import ...`). Siempre `from src....`.
6. **Tipado Estricto Exhaustivo:**
   * Prohibidas colecciones sin tipo (e.g. `list` sin genérico `list[str]`, `dict` sin tipar `dict[str, Any]`). Todos los parámetros y retornos deben incluir Type Hints validados por Pyright.

---

## 5. Gobernanza Normativa, Calidad & Matriz de Pruebas

### 5.1. Sistema de Gestión de Calidad (SGC)
* **Certificación y Marco de Referencia:** Alineación con políticas de calidad ISO 9001:2015 (Gestión de Calidad) e ISO/IEC 27001 (Seguridad de la Información).
* **Trazabilidad de Cambios:** Commits bajo la convención [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

### 5.2. Matriz de Verificación Automatizada Previa a Despliegues

Todos los cambios deben superar el 100% de la siguiente batería de verificación antes de integrarse a `main` o desplegarse:

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
