
# SRS & Technical Specs: {nombre_del_sistema_o_proyecto}

> **Documento:** `srs-specs-fastapi.md`  
> **Versión:** `{version_documento_ej_1_0_0}`  
> **Estado:** `{borrador_en_revision_aprobado}`  
> **Fecha:** `{fecha_actual_o_release}`  
> **Autor(es):** `{autor_o_equipo_responsable}`  
> **Repositorio / Módulo:** `{url_o_ruta_del_repositorio}`  

---

## 1. Introducción y Visión General (SRS)

### 1.1. Propósito y Alcance
* **Propósito:** Definir los requisitos funcionales, no funcionales y la especificación técnica de diseño para `{nombre_del_sistema_o_proyecto}` utilizando FastAPI bajo principios de Clean Architecture y Domain-Driven Design (DDD).
* **Alcance del Sistema:** `{descripcion_general_del_alcance_y_problema_que_resuelve}`.
* **Fuera de Alcance (*Out of Scope*):** `{lista_de_elementos_o_features_excluidas_en_esta_etapa}`.

### 1.2. Stakeholders y Actores del Sistema
| Actor / Rol | Descripción | Nivel de Acceso / Interacción |
| :--- | :--- | :--- |
| `{rol_actor_1_ej_administrador}` | `{descripcion_rol_1}` | `{permisos_rol_1}` |
| `{rol_actor_2_ej_cliente_api}` | `{descripcion_rol_2}` | `{permisos_rol_2}` |
| `{rol_actor_3_ej_sistema_externo}` | `{descripcion_rol_3}` | `{permisos_rol_3}` |

---

## 2. Requisitos del Sistema (SRS)

### 2.1. Requisitos Funcionales (FR)
* **FR-01 - `{nombre_requisito_funcional_1}`:** El sistema debe permitir `{accion_que_debe_realizar_el_sistema}` cuando `{condicion_o_evento_disparador}`.
* **FR-02 - `{nombre_requisito_funcional_2}`:** El sistema debe validar que `{regla_de_validacion_de_negocio}`.
* **FR-03 - `{nombre_requisito_funcional_3}`:** El sistema debe procesar eventos asíncronos provenientes de `{origen_del_evento_o_broker}` y persistir `{datos_a_persistir}`.

### 2.2. Requisitos No Funcionales (NFR)
* **NFR-01 - Rendimiento:** La latencia en los endpoints de lectura debe ser inferior a `{tiempo_maximo_ms}` ms para el percentil 95 (p95).
* **NFR-02 - Concurrencia:** Capacidad de procesar hasta `{numero_rps_o_mensajes_por_segundo}` `{solicitudes_o_mensajes_por_segundo}` concurrentes.
* **NFR-03 - Disponibilidad & Resiliencia:** Nivel de servicio esperado de `{sla_esperado_ej_99_9_porciento}` con reconexión automática ante caídas de `{dependencia_critica_ej_broker_o_bd}`.
* **NFR-04 - Seguridad:** Autenticación mediante `{mecanismo_autenticacion_ej_jwt_oauth2_api_key}` y autorización basada en `{modelo_autorizacion_ej_rbac_scopes}`.

---

## 3. Stack Tecnológico y Convenciones Base

### 3.1. Stack Tecnológico
* **Lenguaje:** Python `{version_python_ej_3_10_plus}` con tipado estricto (`typing`, `Annotated`, `dataclasses`).
* **Arquitectura:** Clean Architecture (Ports & Adapters) + Domain-Driven Design (DDD).
* **Framework Web:** FastAPI (asíncrono, OpenAPI autodocumentado).
* **Broker & Ingesta / Mensajería:** `{reemplazar_broker_ej_mosquitto_mqtt_kafka_rabbitmq}` + `{reemplazar_cliente_broker_ej_paho_mqtt_aiokafka}`.
* **Base de Datos & ORM:** `{reemplazar_motor_bd_ej_mysql_postgresql}` + `{reemplazar_orm_ej_sqlalchemy_2_0}`.
* **Validación & Serialización:** Pydantic v2 (`BaseModel`, `Field`, `ConfigDict`).
* **Configuración:** `pydantic-settings` (`BaseSettings`, `SettingsConfigDict`).
* **Testing:** `pytest` (+ `{reemplazar_herramientas_testing_ej_pytest_asyncio_httpx_factory_boy}`).
* **Linter & Formatter:** `ruff` y `pyright`.

### 3.2. Reglas Arquitectónicas Críticas
1. **Regla de Dependencia en Clean Architecture:**
   * Las capas internas (`domain`) nunca deben importar de capas externas (`application`, `adapters`, `infrastructure`).
   * `application` solo depende de `domain` y `pydantic`.
   * `adapters` depende de `application` y `domain` (nunca de `infrastructure` ni de frameworks web como FastAPI/SQLAlchemy).
   * `infrastructure` aísla frameworks, drivers y bases de datos (`fastapi`, `sqlalchemy`, `{reemplazar_cliente_broker}`).
2. **Imports Absolutos:** Siempre `from src....`, prohibidos los imports relativos.
3. **`__init__.py` de 0 bytes:** Todos los archivos `__init__.py` en `src/` y `tests/` deben tener exactamente 0 bytes.
4. **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).

---

## 4. Estructura de Directorios del Proyecto


```

src/
├── domain/                                      # 1. Capa de Dominio Pura (Solo stdlib + dataclasses)
│   └── {reemplazar_bounded_context_tematico}/   # Bounded Context temático
│       ├── **init**.py                          # (0 bytes)
│       ├── entities.py                          # {reemplazar_entidad_1}, {reemplazar_entidad_2}, {reemplazar_entidad_3}
│       ├── value_objects.py                     # {reemplazar_vo_1}, {reemplazar_vo_2}, {reemplazar_vo_3}
│       ├── services.py                          # {reemplazar_servicio_dominio_1}, {reemplazar_servicio_dominio_2}
│       ├── ports.py                             # {reemplazar_puerto_repositorio_1_port}, {reemplazar_puerto_evento_port}
│       └── exceptions.py                        # Excepciones de negocio de dominio puro
│
├── application/                                 # 2. Capa de Aplicación (Casos de Uso, DTOs y Mappers)
│   ├── use_cases/                               # {reemplazar_caso_uso_1}, {reemplazar_caso_uso_2}, {reemplazar_caso_uso_3}
│   ├── dtos/                                    # {reemplazar_dto_1}, {reemplazar_dto_2}, {reemplazar_dto_3}
│   └── mappers/                                 # {reemplazar_mapper_1}, {reemplazar_mapper_2}
│
├── adapters/                                    # 3. Capa de Adaptadores (Agnósticos del Framework Web)
│   ├── controllers/                             # {reemplazar_controlador_1}, {reemplazar_controlador_2}
│   ├── gateways/                                # {reemplazar_adaptador_gateway_ej_in_memory_broadcaster}
│   └── presenters/                              # error_presenter (Mapeo a códigos de error estándar HTTP/gRPC)
│
├── infrastructure/                              # 4. Capa de Infraestructura (Librerías externas y Frameworks)
│   ├── fastapi/                                 # Servidor FastAPI, dependencias y routers (/api/{version}/..., /ws/...)
│   │   ├── routers/                             # Definición de rutas y endpoints FastAPI
│   │   └── dependencies.py                      # Inyección de dependencias FastAPI (Depends)
│   ├── sqlalchemy/                              # Modelos DeclarativeBase {reemplazar_motor_bd}, engine y repositorios
│   │   ├── models/                              # Modelos ORM (tablas y relaciones)
│   │   └── repositories/                        # Implementación de los puertos de domain/ports.py
│   ├── {reemplazar_directorio_driver_broker}/   # Listener/daemon para {reemplazar_broker}
│   └── settings/                                # Configuración con pydantic-settings y logger estructurado
│
└── main.py                                      # Entrypoint ASGI (app = create_app())

```

---

## 5. Especificaciones Técnicas Detalladas (Specs)

### 5.1. Modelo de Dominio (Domain Layer Specs)
* **Entidades Principales (`entities.py`):**
  * `{reemplazar_entidad_1}`: `{descripcion_responsabilidad_atributos_clave}`
  * `{reemplazar_entidad_2}`: `{descripcion_responsabilidad_atributos_clave}`
* **Value Objects (`value_objects.py`):**
  * `{reemplazar_vo_1}`: `{reglas_de_inmutabilidad_y_validacion}`
* **Puertos e Interfaces (`ports.py`):**
  * `{reemplazar_puerto_repositorio_port}`: Define contratos abstractos (`Protocol` o `ABC`) para persistencia.
  * `{reemplazar_puerto_notificador_port}`: Define contratos para emisión de eventos.

### 5.2. Casos de Uso (Application Layer Specs)
#### UC-01: `{nombre_del_caso_de_uso_ej_RegistrarOperacion}`
* **Entrada (DTO):** `{reemplazar_request_dto_nombre}` (`{campo_1}: {tipo_1}`, `{campo_2}: {tipo_2}`)
* **Salida (DTO):** `{reemplazar_response_dto_nombre}`
* **Flujo Principal:**
  1. Recibe DTO de entrada.
  2. Valida reglas de negocio a través de `{reemplazar_servicio_dominio_o_entidad}`.
  3. Invoca puerto `{reemplazar_puerto_repositorio_port}` para persistir.
  4. Publica evento mediante `{reemplazar_puerto_notificador_port}` si aplica.
  5. Retorna DTO de salida mapeado.
* **Excepciones Manejadas:** `{reemplazar_excepcion_dominio_1}`, `{reemplazar_excepcion_dominio_2}`.

---

## 6. Diseño de APIs y Contratos de Integración (Specs)

### 6.1. Endpoints REST (FastAPI)
#### `POST /api/{version_api}/{reemplazar_recurso}`
* **Descripción:** `{descripcion_del_endpoint}`
* **Autenticación:** `{requiere_auth_ej_Bearer_Token}`
* **Request Body:**
  ```json
  {
    "{reemplazar_campo_request_1}": "{reemplazar_ejemplo_valor_1}",
    "{reemplazar_campo_request_2}": 0
  }

```

* **Respuestas:**
* `201 Created`:
```json
{
  "id": "{reemplazar_identificador_generado}",
  "status": "success",
  "data": {}
}

```


* `400 Bad Request`: Error de validación de negocio (`{reemplazar_codigo_error_negocio}`).
* `422 Unprocessable Entity`: Error de schema Pydantic.
* `500 Internal Server Error`: Fallo no controlado.



---

## 7. Persistencia y Esquema de Base de Datos (Specs)

### 7.1. Tablas y Modelos ({reemplazar_motor_bd})

```sql
CREATE TABLE `{reemplazar_tabla_principal}` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `{reemplazar_columna_1}` VARCHAR(255) NOT NULL,
    `{reemplazar_columna_2}` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_{reemplazar_tabla_principal}_{reemplazar_columna_1}` (`{reemplazar_columna_1}`)
);

```

---

## 8. Estrategia de Testing y Calidad

* **Unit Tests (`tests/unit/`):**
* Pruebas aisladas sobre `domain/` y `application/use_cases/` utilizando dobles de prueba / mocks para los puertos (`ports.py`).


* **Integration Tests (`tests/integration/`):**
* Pruebas sobre adaptadores e infraestructura (`infrastructure/sqlalchemy/`, `infrastructure/{reemplazar_directorio_driver_broker}/`).


* **E2E / API Tests (`tests/e2e/`):**
* Pruebas de endpoints FastAPI utilizando `httpx.AsyncClient` y base de datos de test efímera.


* **Comandos de Verificación:**
```bash
# Linter y Formato
ruff check .
ruff format --check .

# Análisis Estático de Tipos
pyright

# Ejecución de Pruebas
pytest --maxfail=1 --disable-warnings -q

```



```

```
