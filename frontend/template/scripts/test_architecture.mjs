/**
 * test_architecture.mjs — El Guantelete de Restricciones Extremas (Feature-Sliced Design & SPA).
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
// 1. Verificación de Dependencias de Capas (Feature-Sliced Design)
// ==============================================================================

function checkLayerDependencies(files, root) {
  const errors = []

  for (const file of files) {
    const rel = relToSrc(file, root)
    const imports = extractAliasImports(file)

    for (const imp of imports) {
      const target = imp.slice(2) // quitar prefijo "@/"

      if (rel.startsWith('shared/') && (target.startsWith('core/') || target.startsWith('features/') || target.startsWith('app/'))) {
        errors.push(`[CAPA VIOLADA] ${rel} importa '${imp}' (shared no puede depender de capas superiores).`)
        continue
      }

      if (rel.startsWith('core/') && (target.startsWith('features/') || target.startsWith('app/'))) {
        errors.push(`[CAPA VIOLADA] ${rel} importa '${imp}' (core solo puede depender de shared).`)
        continue
      }

      if (rel.startsWith('features/')) {
        if (target.startsWith('app/')) {
          errors.push(`[CAPA VIOLADA] ${rel} importa '${imp}' (features no puede depender de app).`)
          continue
        }
        const ownFeature = rel.match(/^features\/([^/]+)\//)
        if (target.startsWith('features/')) {
          const targetFeature = target.match(/^features\/([^/]+)\//)
          if (ownFeature && targetFeature && ownFeature[1] !== targetFeature[1]) {
            errors.push(`[CAPA VIOLADA] ${rel} importa '${imp}' (cross-feature prohibido; use core o shared).`)
          }
        }
      }
    }
  }

  return errors
}

// ==============================================================================
// 2. Verificación de Prohibición de `any` y Supresiones de Tipado
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
  const suppressPattern = /@ts-(ignore|nocheck|expect-error)/

  for (const file of files) {
    const rel = relToSrc(file, root)
    const lines = readContent(file).split('\n')
    let inBlockComment = false

    for (let index = 0; index < lines.length; index++) {
      let line = lines[index]

      // Manejo simplificado de bloques de comentario multilínea /* ... */
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
      if (trimmed === '') continue

      const suppression = line.match(suppressPattern)
      if (suppression) {
        errors.push(`[SUPRESIÓN DE TIPADO] ${rel}:${index + 1} usa '${suppression[0]}' (prohibido).`)
        continue
      }

      if (trimmed.startsWith('//')) continue

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

  const suites = [
    ['1. Dependencias de Capas (Feature-Sliced Design)', checkLayerDependencies(files, root)],
    ['2. Tipado Estricto (Cero `any` / supresiones)', checkNoExplicitAny(files, root)],
    ['3. Control de Barriles (export *)', checkBarrelControl(files, root)],
    ['4. Imports Absolutos (alias @/)', checkAbsoluteImports(files, root)],
    ['5. Seguridad & Secretos (Cero hardcoded)', checkNoHardcodedSecrets(files, root)],
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
  checkAbsoluteImports,
  checkBarrelControl,
  checkLayerDependencies,
  checkNoExplicitAny,
  checkNoHardcodedSecrets,
  findProjectRoot,
  walk,
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
