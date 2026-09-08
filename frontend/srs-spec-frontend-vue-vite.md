# SRS-SPECS: {nombre_del_sistema_o_proyecto} — Single Source of Truth (SSOT) & Especificación del Sistema (Frontend SPA)

> **Documento:** `srs-spec-frontend-vue-vite.md`
> **Versión:** `{version_documento_ej_1_0_0}`
> **Estado:** `{borrador_en_revision_aprobado}`
> **Fecha:** `{fecha_actual_o_release}`
> **Autor(es):** `{autor_o_equipo_responsable}`
> **Repositorio / Módulo:** `{organizacion_o_usuario}/{nombre_del_repositorio}`
> **Tipo de Aplicación:** Frontend puro (SPA) — consume APIs externas mediante HTTP; sin SSR ni backend embebido.

---

## 1. Contexto Estratégico & Propuesta de Valor

### 1.1. Foco Estratégico & Alcance
* **Mercado Objetivo:** `{definicion_de_industria_o_nicho_objetivo}`.
* **Buyer Persona (Decisor / Cliente Ideal):** `{perfil_del_comprador_o_tomador_de_decision}`.
* **User Persona (Operador / Usuario Final):** `{perfil_del_usuario_final_que_interactua_con_la_SPA}`.
* **Alcance Geográfico & Modalidad:** `{ej_Web_cloud_global_responsive_o_intranet_corporativa}`.
* **APIs Externas Consumidas:** `{lista_de_endpoints_backends_o_servicios_terceros_consumidos}`.
* **Fuera de Alcance (*Out of Scope*):** `{lista_de_elementos_o_features_excluidas_en_esta_etapa}`.

### 1.2. Pilares de Valor de la Solución
| Pilar | Enfoque | Implementación en este Sistema |
| :--- | :--- | :--- |
| **1. Experiencia & Interfaz de Usuario** | Navegación fluida, responsive y accesible (a11y) sobre la SPA. | `{descripcion_de_la_experiencia_y_flujos_de_interaccion}` |
| **2. Estado & Lógica de Presentación** | Consumo de APIs, normalización de datos, estado global (Pinia) y validación de DTOs (Zod). | `{descripcion_del_flujo_de_datos_cliente_api_y_estado}` |
| **3. Impacto Económico & ROI** | Conversión, retención o eficiencia operativa del usuario final. | `{descripcion_del_impacto_economico_o_ahorro_esperado}` |

### 1.3. Coordinación Operativa, Roles & Seguridad
* **Liderazgo Técnico / Responsable:** `{responsable_tecnico_o_lead_developer}`.
* **Ventanas Operativas & Disponibilidad:** `{restricciones_horarias_y_ventanas_de_mantenimiento_o_soporte}`.
* **Habilitaciones, Normativas & Seguridad:** `{certificaciones_normativas_accesibilidad_wcag_y_requisitos_de_acceso}`.

---

## 2. Modelo de Negocio Canvas (BMC de 9 Bloques) & Gobernanza

### 2.1. Matriz del Business Model Canvas
| Bloque Canvas | Definición Estratégica | Componentes Clave en el Software |
| :--- | :--- | :--- |
| **1. Socios Clave (KP)** | `{alianzas_backends_apis_terceras_cdn_o_integradores}` | `{integraciones_api_o_servicios_externos_consumidos}` |
| **2. Actividades Clave (KA)** | `{renderizado_consumo_api_estado_distribuido_soporte}` | `{vistas_casos_de_uso_y_composables_principales}` |
| **3. Recursos Clave (KR)** | `{componentes_propiedad_intelectual_biblioteca_ui_design_system}` | `{shared_components_schemas_y_tipos}` |
| **4. Propuesta de Valor (VP)** | `{beneficio_unico_que_resuelve_el_problema_del_cliente}` | `{vistas_publicas_flujos_clave_y_experiencias}` |
| **5. Relación con Clientes (CR)** | `{autoservicio_automatizada_soporte_dedicado_alertas}` | `{notificadores_websockets_toasts_o_emails}` |
| **6. Canales de Distribución (CH)** | `{web_responsive_pwa_mobile_web}` | `{router_vue_router_4_y_rutas_protegidas}` |
| **7. Segmentos de Clientes (CS)** | `{tipos_de_clientes_o_audiencias_objetivo}` | `{roles_rbac_y_guardias_de_ruta_router_guards}` |
| **8. Estructura de Costos (CS)** | `{cdn_build_hosting_terceros_licencias}` | `{optimizacion_de_bundle_y_cacheo_eficiente}` |
| **9. Fuentes de Ingresos (RS)** | `{suscripcion_saas_pago_por_uso_licencias_servicios}` | `{integración_de_pasarelas_o_gestión_de_suscripciones}` |

### 2.2. Organigrama Operativo / Gobernanza de Agentes IA (Opcional)
* **`agente-orquestador` / `agente-lead`:** Gobernanza general, alineación técnica y resolución de conflictos entre módulos.
* **`agente-core-ui`:** Supervisión del design system, componentes base (`shared/`) y accesibilidad (a11y).
* **`agente-estado-datos`:** Gestión de stores (Pinia), schemas de validación (Zod) y contratos con APIs externas.
* **`agente-integraciones-api`:** Clientes HTTP tipados (Axios), interceptores y manejo de errores de red.
* **`agente-qa-calidad`:** Validación continua del Guantelete de Restricciones (`test_architecture.mjs`), `vue-tsc` y tests.

### 2.3. Escalera de Valor / Modelo de Conversión
* **Nivel de Entrada (*Lead Magnet* / Tier Gratuito):** `{ej_Landing_publica_demo_o_tier_gratuito}`.
* **Servicio Core (*Core Offering*):** `{ej_SPA_principal_funcionalidades_core_o_servicio_profesional}`.
* **Nivel Avanzado (*Enterprise* / Retención):** `{ej_SLA_dedicado_analitica_avanzada_soporte_24_7}`.

---

## 3. Especificación de Requisitos de Software (SRS)

### 3.1. Requisitos Funcionales (FR)
* **FR-01 - Consumo de APIs Externas:** La SPA debe consumir `{endpoints_backend}` mediante un cliente HTTP tipado (`axios`) con interceptores de autenticación y manejo centralizado de errores.
* **FR-02 - Validación de DTOs en Cliente:** Los datos recibidos de `{fuente_api}` deben validarse estrictamente mediante `zod` antes de ingresar al estado global (Pinia).
* **FR-03 - Gestión de Estado Global:** El sistema debe centralizar el estado compartido en stores `{stores_pinia}` con selectores y mutaciones tipados.
* **FR-04 - Enrutamiento & Guardias de Acceso:** El sistema debe enrutar vistas con `{vue_router_4}` y restringir el acceso mediante guardias basadas en `{modelo_seguridad_ej_JWT_roles}`.
* **FR-05 - Accesibilidad & Responsive:** La interfaz debe cumplir `{nivel_wcag_ej_AA}` y renderizarse correctamente en `{breakpoints_objetivo}`.
* **FR-06 - `{nombre_requisito_especifico_1}`:** El sistema debe `{descripcion_de_accion_y_resultado_esperado}`.
* **FR-07 - `{nombre_requisito_especifico_2}`:** El sistema debe `{descripcion_de_accion_y_resultado_esperado}`.

### 3.2. Requisitos No Funcionales (NFR)
* **NFR-01 - Rendimiento de Carga:** LCP inferior a `{lcp_maximo_ms}` ms y CLS inferior a `{cls_maximo}` en `{red_de_referencia}`.
* **NFR-02 - Tamaño de Bundle:** Bundle JS inicial inferior a `{bundle_maximo_kb}` kB (gzip) con code-splitting por ruta.
* **NFR-03 - Disponibilidad & Resiliencia:** Degradación elegante ante caídas de APIs externas con `{estrategia_ej_retry_backoff_circuit_breaker}` y mensajes de error amigables.
* **NFR-04 - Seguridad:** Cero secretos expuestos en el bundle cliente; variables de entorno solo con prefijo `VITE_` y sin datos sensibles; sanitización de entradas y mitigación OWASP (XSS, inyección de HTML).
* **NFR-05 - Conformidad Arquitectónica:** 100% de cumplimiento en pruebas automáticas del Guantelete (`test_architecture.mjs`), `vue-tsc` y `eslint` en cada commit o PR.

---

## 4. Stack Tecnológico, Arquitectura & Convenciones (CONVENTIONS)

### 4.1. Stack Tecnológico Base
* **Lenguaje:** TypeScript 5.x (modo estricto: `strict`, `noUncheckedIndexedAccess`, `noImplicitAny`).
* **Framework UI:** Vue 3 (Composition API, `<script setup lang="ts">`).
* **Bundler & Dev Server:** Vite 5+.
* **Enrutamiento:** Vue Router 4.
* **Estado Global:** Pinia.
* **Cliente HTTP:** Axios (instancia única tipada con interceptores).
* **Validación & Schemas:** Zod.
* **Testing:** Vitest (`@vue/test-utils`) + Playwright (E2E).
* **Linters & Tipado:** ESLint (`typescript-eslint`, `eslint-plugin-vue`), Prettier y `vue-tsc`.

### 4.2. Estructura Canónica de Directorios (Feature-Sliced Design)

```
.
├── .env.local                                   # Variables de entorno (NUNCA en git)
├── .env.example                                 # Plantilla canónica de variables VITE_*
├── .gitignore                                   # Exclusiones estándar (ignora .env.local, node_modules, dist)
│
├── src/
│   ├── app/                                     # CAPA 1: Bootstrap & Composición (equiv. infrastructure)
│   │   ├── router/
│   │   │   └── index.ts                         # .ts — Rutas y guardias (Vue Router 4)
│   │   ├── stores/
│   │   │   └── session.ts                       # .ts — Store global Pinia (sesión/tema)
│   │   ├── providers/
│   │   │   └── i18n.ts                          # .ts — Plugins globales (i18n, vuetify, etc.)
│   │   └── styles/
│   │       └── main.css                         # Estilos globales y variables de tema
│   │
│   ├── core/                                    # CAPA 2: Lógica Pura & Contratos — 100% .ts (sin .vue)
│   │   ├── types/
│   │   │   └── user.ts                          # .ts — Interfaces de dominio y contratos API
│   │   ├── schemas/
│   │   │   └── user.ts                          # .ts — Schemas Zod de validación de DTOs
│   │   ├── http/
│   │   │   └── client.ts                        # .ts — Instancia Axios + interceptores
│   │   ├── services/
│   │   │   └── auth.ts                          # .ts — Servicios (consumo de APIs)
│   │   └── composables/
│   │       └── useApi.ts                        # .ts — Composables genéricos reutilizables
│   │
│   ├── features/                                # CAPA 3: Módulos de Negocio Autocontenidos (equiv. bounded contexts)
│   │   └── auth/                                # Ejemplo de feature (grita su dominio)
│   │       ├── index.ts                         # .ts — Barril de API pública (único permitido)
│   │       ├── components/
│   │       │   └── LoginForm.vue                # .vue — Presentación (consume composables)
│   │       ├── composables/
│   │       │   └── useLogin.ts                  # .ts — Lógica de la feature
│   │       ├── stores/
│   │       │   └── authStore.ts                 # .ts — Estado Pinia de la feature
│   │       └── views/
│   │           └── LoginView.vue                # .vue — Página/vista (destino de router)
│   │
│   ├── shared/                                  # CAPA 4: UI Reutilizable & Utilidades (equiv. shared/adapters)
│   │   ├── ui/
│   │   │   └── BaseButton.vue                   # .vue — Componentes base del design system
│   │   ├── utils/
│   │   │   └── format.ts                        # .ts — Funciones puras compartidas
│   │   └── config/
│   │       └── constants.ts                     # .ts — Constantes de UI y configuración pública
│   │
│   ├── main.ts                                  # .ts — Entrypoint (createApp + router + pinia)
│   └── App.vue                                  # .vue — Componente raíz
│
├── vite.config.ts                               # Config Vite con alias @/ → src/
├── tsconfig.json                                # Config TypeScript estricto
├── .eslintrc.cjs                                # Config ESLint + typescript-eslint
├── .prettierrc.json                             # Config Prettier
├── playwright.config.ts                         # Config Playwright (E2E)
│
└── tests/
    ├── unit/                                    # .test.ts — Vitest (lógica pura: composables, stores, services)
    ├── component/                               # .spec.ts — Vitest + Vue Test Utils (montaje de SFC)
    └── e2e/                                     # .spec.ts — Playwright (flujos de navegación)
```

### 4.2.1. Regla de Separación de Archivos `.ts` vs `.vue`

| Extensión | Rol | Dónde reside |
| :--- | :--- | :--- |
| **`.ts`** | Lógica pura y estado: tipos, schemas Zod, servicios, stores Pinia, composables, rutas. | `core/**` (100%), `app/router/`, `app/stores/`, `app/providers/`, `features/*/composables/`, `features/*/stores/`, `shared/utils/`, `shared/config/` |
| **`.vue` (SFC)** | Presentación/plantilla: `<template>` + `<script setup>` que **consume** la lógica `.ts`. | `App.vue` (+ layouts en `app/`), `features/*/components/`, `features/*/views/`, `shared/ui/` |

**Principio rector:** un `.vue` **nunca** contiene lógica de negocio; solo orquesta datos y renderiza. Toda la lógica reutilizable vive en `.ts` (composables/stores/services), lo que permite testearla con Vitest sin montar componentes. `core/` es 100% `.ts` y no admite `.vue`.


### 4.3. Especificación de Configuración & Entorno

#### A. Gestión de Entorno (`.env.local`, `.env.example`, `.gitignore`)
* **Regla de Seguridad:** `.env.local` contiene variables de desarrollo y **NUNCA** se commitea. El archivo [`.gitignore`](file:///home/agustin/proyectos_software/spec/.gitignore) excluye `.env.local`, `node_modules`, `dist` y `coverage`.
* **Regla Crítica de Vite:** Solo las variables con prefijo `VITE_` se exponen al bundle del cliente. **Está prohibido** usar `VITE_*` para secretos (API keys privadas, tokens, claves de firma); estos residen exclusivamente en el backend o en variables de servidor no expuestas.

#### B. `vite.config.ts` (alias `@/` → `src/`)
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

#### C. `tsconfig.json` (modo estricto)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

---

### 4.4. Las Siete Reglas Innegociables de Arquitectura Frontend

1. **Regla de Dependencia de Capas (Validada por `test_architecture.mjs`):**
   * `shared` no importa de `core`, `features` ni `app`.
   * `core` solo importa de `shared`.
   * `features` importa de `core` y `shared` (nunca de `app` ni de otras features; comunicación entre features vía core/composables).
   * `app` puede importar de `features`, `core` y `shared` (nunca al revés).
2. **Barriles Controlados (`index.ts`):**
   * El re-export en cascada (`export *`) solo se permite como barril de API pública en `features/{feature}/index.ts`.
   * Fuera de `features/`, los archivos `index.ts` (p. ej. `app/router/index.ts`) son módulos normales: prohibido `export *`; solo se permiten exports explícitos (`export { nombre }`) o símbolos definidos localmente.
3. **Imports Absolutos:**
   * Prohibidos los imports relativos entre capas (`../`); se exige alias `@/` (equivalente a `from src...` del backend).
4. **Tipado Estricto Exhaustivo:**
   * Prohibido `any`, `@ts-ignore`, `@ts-nocheck` y `as` casts sin restricción. `vue-tsc --noEmit` debe reportar 0 diagnósticos.
5. **Controladores/Componentes Delgados (*Thin Views*):**
   * Las vistas (`views/`) no contienen lógica de negocio; delegan en composables, stores y servicios de `core/`.
6. **Gobernanza Antialucinación de Parámetros Críticos:**
   * URLs de APIs, feature flags, timeouts y constantes de integración provienen de variables `VITE_*` (públicas) o de configuración en `shared/config/`, nunca hardcodeadas.
7. **Cero Secretos en el Cliente:**
   * Prohibido hardcodear tokens, API keys privadas o credenciales en `src/`. El bundle cliente solo expone lo estrictamente público.
8. **Cabecera de Path Relativo (Trazabilidad):**
   * Todo archivo fuente (`.ts`, `.tsx`, `.vue`, `.js`, `.jsx`, `.mjs`) en `src/`, `scripts/` y `tests/` debe comenzar con un comentario indicando su ruta relativa exacta respecto a la raíz del repositorio (e.g. `// src/main.ts` o `<!-- src/App.vue -->`).

---

## 5. Gobernanza Normativa, Calidad & Matriz de Pruebas

### 5.1. Filosofía de Desarrollo Asistido por Agentes IA ("The Constraint Gauntlet")
> *"Mi estrategia actual es no leer el código generado por mis agentes. Lo que hago en su lugar es rodearlos de **restricciones extremas**: Unit tests, QA procedures, métricas de calidad, mutation testing, coverage... Tengo muy alta confianza en el código porque tiene que superar todo mi guantelete de restricciones."*
> — **Robert C. Martin ("Uncle Bob")**

Bajo este paradigma, el equipo de ingeniería y los agentes de IA operan dentro de un marco de verificación estricto, automatizado y determinista donde ningún código se fusiona a producción sin superar el 100% de los invariantes formales.

### 5.2. Las 7 Baterías del Guantelete (`test_architecture.mjs`)
1. **`check_layer_dependencies`:** Valida la regla de dependencia de capas FSD (shared puro, core acotado, features desacopladas, app orquestadora).
2. **`check_no_explicit_any`:** Prohíbe `any`, `@ts-ignore`, `@ts-nocheck` y `@ts-expect-error` en `src/`.
3. **`check_barrel_control`:** Prohíbe `export *` en cascada fuera de `features/`; el barril de API pública (`export *`) solo se permite en `features/{feature}/index.ts`.
4. **`check_absolute_imports`:** Prohíbe imports relativos entre capas (`../`), exigiendo alias `@/`.
5. **`check_no_hardcoded_secrets`:** Detecta y bloquea API keys, tokens JWT o credenciales quemadas en código fuente.
6. **`check_no_vue_in_core`:** Garantiza que `src/core/` sea 100% TypeScript puro (.ts) prohibiendo componentes `.vue`.
7. **`check_relative_path_headers`:** Exige que todo archivo `.ts`, `.js`, `.mjs`, `.vue` en `src/`, `scripts/` y `tests/` comience con un comentario indicando su ruta relativa exacta.

### 5.3. Estándares de Calidad, Trazabilidad & Commits Atómicos
* **Marco de Referencia:** Alineación con buenas prácticas de calidad de producto (ISO/IEC 25010), accesibilidad (WCAG 2.1) y seguridad de la información (ISO/IEC 27001).
* **Lineamiento de Commits Atómicos (Principio de Responsabilidad Única en Git):**
  * **Una Unidad Lógica por Commit:** Cada commit debe representar un cambio único, autocontenido, indivisible y con propósito claro. Queda estrictamente prohibido agrupar en un único commit features nuevas, refactorizaciones, corrección de bugs no relacionados y ajustes de formato cosmético.
  * **Integridad del Repositorio:** Cada commit individual debe dejar el proyecto en un estado compilable, estable y pasando el 100% de la suite de tests, linters y type-checkers (cero commits con código roto o a medio implementar).
  * **Aislamiento para Bisect y Revert:** La granularidad atómica asegura que cualquier regresión se aísle inmediatamente mediante `git bisect` y pueda revertirse con `git revert` limpiamente sin efectos secundarios ni destrucción de código colateral.
  * **Regla del Conector "Y" (*And Rule*):** Si la descripción del commit necesita la conjunción "y" o "además" para describir lo realizado (e.g. `feat: add navbar user menu and fix button styling`), el commit NO es atómico y debe dividirse en micro-commits independientes.
* **Convención Estricta de Mensajes ([Conventional Commits](https://www.conventionalcommits.org/)):**
  * **Estructura Obligatoria:** `<tipo>(<alcance opcional>): <descripción concisa e imperativa>`
  * **Tipos Permitidos:**
    * `feat`: Nueva funcionalidad o componente para el usuario o sistema.
    * `fix`: Corrección de un defecto, bug visual o lógico.
    * `refactor`: Cambio estructural de componentes o lógica sin alteración del comportamiento externo.
    * `test`: Creación o modificación de pruebas unitarias, de integración o de arquitectura.
    * `docs`: Cambios exclusivos en documentación o especificaciones.
    * `chore`: Mantenimiento de paquetes, dependencias o tooling sin impacto en runtime de producción.
    * `perf`: Optimizaciones de renderizado, bundle size o tiempos de carga.
    * `style`: Ajustes cosméticos o de formato sin impacto funcional.

### 5.4. Matriz de Verificación Automatizada Previa a Despliegues

Todos los cambios deben superar el 100% de la siguiente batería de comandos antes de integrarse a la rama principal o desplegarse a producción:

```bash
# 1. Linter
npm run lint

# 2. Chequeo de Tipos Estricto
npm run type-check        # vue-tsc --noEmit

# 3. Verificación de Formato
npm run format:check      # prettier --check .

# 4. Validación de Arquitectura y Guantelete de Restricciones
node test_architecture.mjs

# 5. Suite de Pruebas (Unit + Component) con cobertura >= 85%
npm run test:unit -- --coverage

# 6. Pruebas End-to-End (Playwright)
npm run test:e2e
```
