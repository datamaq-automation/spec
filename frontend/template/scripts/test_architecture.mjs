/**
 * scripts/test_architecture.mjs — El Guantelete de Restricciones Extremas (Feature-Sliced Design & SPA).
 *
 * Inspirado en la filosofía de Robert C. Martin ("Uncle Bob") sobre el desarrollo asistido por agentes IA:
 * "Rodear a los agentes de restricciones extremas para tener máxima confianza en el código producido."
 *
 * Este archivo ejecuta un análisis estático exhaustivo sobre el árbol de archivos de una SPA
 * (TypeScript + Vue) usando únicamente la librería estándar de Node.js (zero-dependencies).
 *
 * Batería de Pruebas ("The Constraint Gauntlet"):
 *   1. check_layer_dependencies:
 *      - shared no importa de core, features ni app.
 *      - core no importa de features ni app.
 *      - features no importa de app ni de otras features (solo core y shared).
 *      - app puede importar de features, core y shared (nunca al revés).
 *   2. check_no_explicit_any:
 *      - Prohíbe terminantemente `any`, `@ts-ignore`, `@ts-nocheck` y `@ts-expect-error`.
 *   3. check_barrel_control:
 *      - Prohíbe re-exports en cascada (`export *`) fuera de `features/`.
 *   4. check_absolute_imports:
 *      - Prohíbe imports relativos entre capas (`../`); exige el alias `@/`.
 *   5. check_no_hardcoded_secrets:
 *      - Detecta API keys, tokens JWT o credenciales quemadas en código fuente.
 *   6. check_no_vue_in_core:
 *      - Capa core 100% TypeScript puro (cero componentes .vue).
 *   7. check_relative_path_headers:
 *      - Exige que todo archivo comience con un comentario de su ruta relativa exacta.
 *
 * Uso:
 *   - Como Script:  node test_architecture.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Extensiones de archivos fuente analizados por el validador. */
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.vue', '.js', '.jsx']

function findProjectRoot(startPath = null) {
  if (startPath) {
    let current = resolve(startPath)
    while (true) {
      if (existsSync(join(current, 'src'))) return current
      const parent = dirname(current)
      if (parent === current) return resolve(startPath)
      current = parent
    }
  }

  // Priorizar ancestros del directorio del script
  let scriptCurrent = __dirname
  while (true) {
    if (existsSync(join(scriptCurrent, 'src'))) return scriptCurrent
    const parent = dirname(scriptCurrent)
    if (parent === scriptCurrent) break
    scriptCurrent = parent
  }

  let current = resolve(process.cwd())
  while (true) {
    if (existsSync(join(current, 'src'))) return current
    const parent = dirname(current)
    if (parent === current) return resolve(process.cwd())
    current = parent
  }
}

function walk(dir, extensions) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walk(full, extensions))
    } else if (extensions.some((ext) => entry.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

function relToSrc(file, root) {
  return relative(join(root, 'src'), file).replace(/\\/g, '/')
}

function readContent(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

/** Extrae los imports con alias `@/` desde un archivo (from/import/require). */
function extractAliasImports(file) {
  const content = readContent(file)
  const out = []
  const re = /(?:from\s*|import\s*|require\s*\(\s*)['"](@\/[^'"]+)['"]/g
  let match
  while ((match = re.exec(content)) !== null) {
    out.push(match[1])
  }
  return out
}

/** Extrae los imports relativos (`./` y `../`) desde un archivo. */
function extractRelativeImports(file) {
  const content = readContent(file)
  const out = []
  const re = /(?:from\s*|import\s*|require\s*\(\s*)['"](\.[./][^'"]+)['"]/g
  let match
  while ((match = re.exec(content)) !== null) {
    out.push(match[1])
  }
  return out
}

// ==============================================================================
// 1. Verificación de Jerarquía Vertical de Capas (Feature-Sliced Design)
// ==============================================================================

function checkVerticalLayerHierarchy(files, root) {
  const errors = []

  for (const file of files) {
    const rel = relToSrc(file, root)
    const imports = extractAliasImports(file)

    for (const imp of imports) {
      const target = imp.slice(2) // quitar prefijo "@/"

      if (rel.startsWith('shared/') && (target.startsWith('core/') || target.startsWith('features/') || target.startsWith('app/'))) {
        errors.push(`[JERARQUÍA DE CAPAS] ${rel} importa '${imp}' (shared no puede depender de capas superiores).`)
        continue
      }

      if (rel.startsWith('core/') && (target.startsWith('features/') || target.startsWith('app/'))) {
        errors.push(`[JERARQUÍA DE CAPAS] ${rel} importa '${imp}' (core solo puede depender de shared).`)
        continue
      }

      if (rel.startsWith('features/') && target.startsWith('app/')) {
        errors.push(`[JERARQUÍA DE CAPAS] ${rel} importa '${imp}' (features no puede depender de app).`)
        continue
      }
    }
  }

  return errors
}

// ==============================================================================
// 2. Verificación de Aislamiento Horizontal entre Features (Cross-Feature Imports)
// ==============================================================================

function checkCrossFeatureImports(files, root) {
  const errors = []

  for (const file of files) {
    const rel = relToSrc(file, root)
    const imports = extractAliasImports(file)

    if (rel.startsWith('features/')) {
      const ownFeature = rel.match(/^features\/([^/]+)\//)
      for (const imp of imports) {
        const target = imp.slice(2) // quitar prefijo "@/"
        if (target.startsWith('features/')) {
          const targetFeature = target.match(/^features\/([^/]+)\//)
          if (ownFeature && targetFeature && ownFeature[1] !== targetFeature[1]) {
            errors.push(`[AISLAMIENTO DE FEATURES] ${rel} importa '${imp}' (cross-feature prohibido; eleve el código a core o shared).`)
          }
        }
      }
    }
  }

  return errors
}

// ==============================================================================
// 5. Verificación de Prohibición de `any` Explícito
// ==============================================================================

function checkNoExplicitAny(files, root) {
  const errors = []
  const anyPatterns = [
    /:\s*any\b/,
    /<\s*any\s*>/,
    /\bas\s+any\b/,
    /Array<\s*any\s*>/,
    /\bany\s*\[\]/,
    /\bany\s*\|/,
    /\|\s*any\b/,
  ]

  for (const file of files) {
    const rel = relToSrc(file, root)
    const lines = readContent(file).split('\n')
    let inBlockComment = false

    for (let index = 0; index < lines.length; index++) {
      let line = lines[index]

      if (inBlockComment) {
        const end = line.indexOf('*/')
        if (end === -1) continue
        line = line.slice(end + 2)
        inBlockComment = false
      }

      const blockStart = line.indexOf('/*')
      if (blockStart !== -1) {
        const blockEnd = line.indexOf('*/', blockStart + 2)
        if (blockEnd === -1) {
          inBlockComment = true
          line = line.slice(0, blockStart)
        } else {
          line = line.slice(0, blockStart) + line.slice(blockEnd + 2)
        }
      }

      const trimmed = line.trim()
      if (trimmed === '' || trimmed.startsWith('//')) continue

      for (const pattern of anyPatterns) {
        const found = line.match(pattern)
        if (found) {
          errors.push(`[ANY PROHIBIDO] ${rel}:${index + 1} usa 'any' explícito ('${found[0].trim()}').`)
          break
        }
      }
    }
  }

  return errors
}

// ==============================================================================
// 6. Verificación de Integridad del Compilador (Cero Directivas de Supresión)
// ==============================================================================

function checkNoTypeSuppression(files, root) {
  const errors = []
  const suppressPattern = /@ts-(ignore|nocheck|expect-error)/

  for (const file of files) {
    const rel = relToSrc(file, root)
    const lines = readContent(file).split('\n')

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      const suppression = line.match(suppressPattern)
      if (suppression) {
        errors.push(`[SUPRESIÓN DE COMPILADOR] ${rel}:${index + 1} usa '${suppression[0]}' (prohibido).`)
      }
    }
  }

  return errors
}

// ==============================================================================
// 3. Verificación de Control de Barriles (index.ts)
// ==============================================================================

function checkBarrelControl(files, root) {
  const errors = []

  for (const file of files) {
    const rel = relToSrc(file, root)

    if (!rel.startsWith('features/')) {
      const content = readContent(file)
      if (/export\s*\*/.test(content)) {
        errors.push(`[RE-EXPORT EN CASCADA] ${rel}: 'export *' fuera de 'features/' está prohibido (barril de API pública).`)
      }
    }
  }

  return errors
}

// ==============================================================================
// 4. Verificación de Imports Absolutos (alias @/)
// ==============================================================================

function checkAbsoluteImports(files, root) {
  const errors = []

  for (const file of files) {
    const rel = relToSrc(file, root)
    const relativeImports = extractRelativeImports(file)

    for (const imp of relativeImports) {
      if (imp.startsWith('../')) {
        errors.push(`[IMPORT RELATIVO] ${rel} usa '${imp}' (prohibido entre capas; use el alias '@/').`)
      }
    }
  }

  return errors
}

// ==============================================================================
// 5. Verificación de Secretos Hardcodeados
// ==============================================================================

function checkNoHardcodedSecrets(files, root) {
  const errors = []
  const suspiciousPatterns = [
    [/(?:api[_-]?key|secret[_-]?key|password|token)\b[^;\n=]*=\s*['"][A-Za-z0-9_\-]{8,}['"]/gi, 'Posible credencial/token quemado en código'],
    [/(?:postgres|mysql|mariadb|mongodb):\/\/[^:]+:[^@]+@/gi, 'Connection string con contraseña en código fuente'],
    [/['"]eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/gi, 'Token JWT quemado en código fuente'],
  ]

  for (const file of files) {
    const rel = relToSrc(file, root)

    // Excluir configuración pública donde se definan defaults de desarrollo seguros.
    if (rel.startsWith('shared/config/')) continue

    const lines = readContent(file).split('\n')
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      const trimmed = line.trim()
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('*')) continue

      for (const [pattern, desc] of suspiciousPatterns) {
        if (pattern.test(line)) {
          errors.push(`[SECRETO HARDCODEADO] ${rel}:${index + 1} ${desc}. Centralice en variables de entorno (VITE_* públicas) o en el backend.`)
        }
      }
    }
  }

  return errors
}

// ==============================================================================
// 6. Verificación de Exclusión de Componentes (.vue) en Capa Core (100% .ts)
// ==============================================================================

function checkNoVueInCore(files, root) {
  const errors = []
  for (const file of files) {
    const rel = relToSrc(file, root)
    if (rel.startsWith('core/') && rel.endsWith('.vue')) {
      errors.push(`[SFC PROHIBIDO EN CORE] ${rel} es un archivo .vue. La capa core debe ser 100% TypeScript puro (.ts) sin componentes de presentación.`)
    }
  }
  return errors
}

// ==============================================================================
// 7. Verificación de Cabecera con Path Relativo (Trazabilidad)
// ==============================================================================

function checkRelativePathHeaders(files, root) {
  const errors = []
  for (const file of files) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const firstChunk = content.slice(0, 300).trim()
      let hasHeader = false
      if (file.endsWith('.vue')) {
        hasHeader = firstChunk.startsWith(`<!-- ${relPath}`) || firstChunk.startsWith(`<!--${relPath}`)
      } else {
        hasHeader = (
          firstChunk.startsWith(`// ${relPath}`) ||
          firstChunk.startsWith(`//${relPath}`) ||
          firstChunk.startsWith(`/* ${relPath}`) ||
          firstChunk.startsWith(`/** ${relPath}`) ||
          firstChunk.startsWith(`/*\n * ${relPath}`) ||
          firstChunk.startsWith(`/**\n * ${relPath}`)
        )
      }
      if (!hasHeader) {
        errors.push(
          `[CABECERA FALTANTE] ${relPath} debe comenzar con un comentario indicando su ruta relativa exacta (ej: // ${relPath} o <!-- ${relPath} -->).`
        )
      }
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

/**
 * 8. Regla de Accesibilidad A11y (Imágenes y Medios):
 * - Exige que las imágenes `<img>` cuenten con el atributo `alt` para lectores de pantalla.
 */
function checkA11yMediaAccessibility(files, root) {
  const errors = []
  const vueFiles = files.filter(f => f.endsWith('.vue'))

  for (const file of vueFiles) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const lineNum = idx + 1
        // Detectar imágenes <img> sin atributo alt
        const imgNoAltPattern = /<img\b(?![^>]*\balt=)[^>]*>/i
        if (imgNoAltPattern.test(line)) {
          errors.push(
            `[ACCESIBILIDAD A11Y] ${relPath}:${lineNum}: Etiqueta <img> sin atributo 'alt' para lectores de pantalla.`
          )
        }
      })
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

/**
 * 9. Regla UI/UX de Semántica en Elementos Interactivos:
 * - Prohíbe manejadores de clic en elementos no interactivos (<div> o <span> con @click) a menos que tengan role="button" o tabindex.
 */
function checkUIInteractiveSemantics(files, root) {
  const errors = []
  const vueFiles = files.filter(f => f.endsWith('.vue'))

  for (const file of vueFiles) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const lineNum = idx + 1
        // Detectar @click o v-on:click en div o span sin role="button" o tabindex
        const nonInteractiveClickPattern = /<(div|span)\b[^>]*\b(@click|v-on:click)\b[^>]*>/i
        if (nonInteractiveClickPattern.test(line)) {
          if (!line.includes('role=') && !line.includes('tabindex=')) {
            errors.push(
              `[SEMÁNTICA UI/UX] ${relPath}:${lineNum}: Elemento no interactivo (<div/span>) con evento @click sin 'role' ni 'tabindex'. Usa un <button> o agrega role="button" tabindex="0".`
            )
          }
        }
      })
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

/**
 * 10. Regla de Observabilidad: Prohibición de console.log no estructurado y rastreo de errores
 * - Prohíbe `console.log` directo en código de producción (`src/`). Requiere el uso de logger centralizado o `console.error`/`console.warn` estructurado.
 */
function checkObservability(files, root) {
  const errors = []

  for (const file of files) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const lineNum = idx + 1
        // Detectar console.log desatendido (permitiendo console.warn, console.error, console.debug)
        if (/\bconsole\.log\s*\(/.test(line)) {
          errors.push(
            `[OBSERVABILIDAD] ${relPath}:${lineNum}: Uso de 'console.log' no estructurado en producción. Utilice el servicio de Logger/Telemetría centralizado o console.error/console.warn.`
          )
        }
      })
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

/**
 * 11. Regla de Seguridad OWASP: Cero v-html no sanitizado (Prevención de XSS)
 * - Prohíbe el uso de la directiva `v-html` en plantillas `.vue` para mitigar vectores de Cross-Site Scripting.
 */
function checkNoUnsafeVHtml(files, root) {
  const errors = []
  const vueFiles = files.filter(f => f.endsWith('.vue'))

  for (const file of vueFiles) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const lineNum = idx + 1
        if (/\bv-html\b/.test(line)) {
          errors.push(
            `[SEGURIDAD XSS] ${relPath}:${lineNum}: Uso de 'v-html' detectado. Prohibido por riesgo de XSS (OWASP). Renderice mediante interpolación mustache {{ }} o componentes estructurados.`
          )
        }
      })
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

/**
 * 12. Regla de Integridad de Entorno: Variables de Entorno Públicas (Prefijo VITE_)
 * - En Vite, solo las variables `VITE_*` son públicas en cliente. Detecta accesos a `import.meta.env.*` sin dicho prefijo (excepto MODE, BASE_URL, PROD, DEV, SSR).
 */
function checkViteEnvPrefix(files, root) {
  const errors = []
  const standardViteProps = new Set(['MODE', 'BASE_URL', 'PROD', 'DEV', 'SSR'])

  for (const file of files) {
    const relPath = relative(root, file).replace(/\\/g, '/')
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')

      lines.forEach((line, idx) => {
        const lineNum = idx + 1
        const matches = line.matchAll(/import\.meta\.env\.([A-Za-z0-9_]+)/g)
        for (const match of matches) {
          const varName = match[1]
          if (!varName.startsWith('VITE_') && !standardViteProps.has(varName)) {
            errors.push(
              `[ENTORNO VITE INVÁLIDO] ${relPath}:${lineNum}: 'import.meta.env.${varName}' no tiene el prefijo 'VITE_'. En Vite, las variables cliente deben llamarse 'VITE_*'.`
            )
          }
        }
      })
    } catch (err) {
      errors.push(`[ERROR LECTURA] ${relPath}: ${err.message}`)
    }
  }
  return errors
}

// ==============================================================================
// CLI Runner Independiente
// ==============================================================================

function main() {
  const root = findProjectRoot()
  const srcDir = join(root, 'src')

  console.log('='.repeat(70))
  console.log('🛡️  EJECUTANDO EL GUANTELETE DE RESTRICCIONES (Uncle Bob Paradigm) — SPA')
  console.log('='.repeat(70))

  if (!existsSync(srcDir)) {
    console.log(`❌ [ERROR] No se encontró el directorio de código fuente: ${srcDir}`)
    console.log('='.repeat(70))
    process.exit(1)
  }

  const files = walk(srcDir, SOURCE_EXTENSIONS)

  const allProjectDirs = [srcDir]
  const scriptsDir = join(root, 'scripts')
  if (existsSync(scriptsDir)) allProjectDirs.push(scriptsDir)
  const testsDir = join(root, 'tests')
  if (existsSync(testsDir)) allProjectDirs.push(testsDir)

  const headerExtensions = ['.ts', '.tsx', '.vue', '.js', '.jsx', '.mjs']
  const allHeaderFiles = []
  for (const d of allProjectDirs) {
    allHeaderFiles.push(...walk(d, headerExtensions))
  }

  const suites = [
    ['1. Seguridad & Secretos (Cero hardcoded)', checkNoHardcodedSecrets(files, root)],
    ['2. Seguridad OWASP (Cero v-html no sanitizado / XSS)', checkNoUnsafeVHtml(files, root)],
    ['3. Integridad de Entorno Vite (Prefijo VITE_ en variables cliente)', checkViteEnvPrefix(files, root)],
    ['4. Jerarquía Vertical de Capas (Feature-Sliced Design)', checkVerticalLayerHierarchy(files, root)],
    ['5. Aislamiento Horizontal de Dominio (Cross-Feature Imports)', checkCrossFeatureImports(files, root)],
    ['6. Capa Core 100% .ts (Cero .vue en core/)', checkNoVueInCore(files, root)],
    ['7. Tipado Estricto (Cero `any` explícito)', checkNoExplicitAny(files, root)],
    ['8. Integridad del Compilador (Cero supresiones @ts-ignore/@ts-nocheck)', checkNoTypeSuppression(files, root)],
    ['9. Imports Absolutos (alias @/)', checkAbsoluteImports(files, root)],
    ['10. Control de Barriles (export *)', checkBarrelControl(files, root)],
    ['11. Observabilidad y Cero Console.log No Estructurado', checkObservability(files, root)],
    ['12. Semántica UI/UX e Interactividad (Role & Tabindex)', checkUIInteractiveSemantics(files, root)],
    ['13. Accesibilidad A11y en Medios e Imágenes', checkA11yMediaAccessibility(files, root)],
    ['14. Cabecera de Path Relativo (Trazabilidad)', checkRelativePathHeaders(allHeaderFiles, root)],
  ]

  const totalErrors = []

  for (const [name, errors] of suites) {
    if (errors.length > 0) {
      console.log(`\n❌ [FALLÓ] ${name}: ${errors.length} violaciones`)
      for (const err of errors) {
        console.log(`   • ${err}`)
      }
      totalErrors.push(...errors)
    } else {
      console.log(`✅ [APROBADO] ${name}`)
    }
  }

  console.log('\n' + '='.repeat(70))
  if (totalErrors.length > 0) {
    console.log(`💥 RESULTADO FINAL: ${totalErrors.length} violaciones detectadas.`)
    console.log('Los agentes o desarrolladores deben corregir el código para superar el guantelete.')
    console.log('='.repeat(70))
    process.exit(1)
  }

  console.log('🎉 RESULTADO FINAL: 100% de las restricciones arquitectónicas fueron superadas con éxito.')
  console.log('='.repeat(70))
  process.exit(0)
}

// Permitir import como módulo para pruebas.
export {
  checkA11yMediaAccessibility,
  checkAbsoluteImports,
  checkBarrelControl,
  checkCrossFeatureImports,
  checkNoExplicitAny,
  checkNoHardcodedSecrets,
  checkNoTypeSuppression,
  checkNoUnsafeVHtml,
  checkNoVueInCore,
  checkObservability,
  checkRelativePathHeaders,
  checkUIInteractiveSemantics,
  checkVerticalLayerHierarchy,
  checkViteEnvPrefix,
  findProjectRoot,
  walk,
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
