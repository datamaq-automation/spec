// scripts/test_clean_design.mjs
/**
 * scripts/test_clean_design.mjs — Detector Determinístico de Código Muerto y Sobreingeniería (FSD & Vue/TS).
 *
 * Analiza el código fuente en src/ utilizando la librería estándar de Node.js (cero dependencias externas).
 *
 * Detecta antipatrones de sobreingeniería y código muerto comunes en código generado por LLMs:
 *   1. UNREACHABLE_FILE: Archivos en src/ que no son alcanzables desde los entrypoints ni tests.
 *   2. EMPTY_SHELL_COMPONENT: Componentes .vue que solo encapsulan un componente hijo sin lógica ni props.
 *   3. SPECULATIVE_MICRO_FILE: Archivos micro-fragmentados (< 8 líneas de código efectivo, no barriles ni .d.ts).
 *
 * Uso:
 *   node scripts/test_clean_design.mjs           # Reporte visual
 *   node scripts/test_clean_design.mjs --strict  # Falla (exit code 1) si hay violaciones críticas
 *   node scripts/test_clean_design.mjs --json    # Salida JSON estructurada para LLMs / agentes
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_MIN_LOC = 8
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
  if (!existsSync(dir)) return []
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

function relToProject(file, root) {
  return relative(root, file).replace(/\\/g, '/')
}

function readContent(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

function countEffectiveLines(content) {
  const lines = content.split('\n')
  return lines.filter((l) => {
    const s = l.trim()
    return s.length > 0 && !s.startsWith('//') && !s.startsWith('/*') && !s.startsWith('*') && !s.startsWith('<!--')
  }).length
}

/** Extrae todos los especificadores de importación de un archivo. */
function extractImportSpecifiers(content) {
  const imports = []
  const re = /(?:from\s*|import\s*|require\s*\(\s*)['"]([^'"]+)['"]/g
  let match
  while ((match = re.exec(content)) !== null) {
    imports.push(match[1])
  }
  const reDyn = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  while ((match = reDyn.exec(content)) !== null) {
    imports.push(match[1])
  }
  return imports
}

/** Resuelve un import specifier a una ruta absoluta de archivo si existe en el proyecto. */
function resolveImportPath(specifier, sourceFile, root) {
  const srcDir = join(root, 'src')
  let candidateBase = null

  if (specifier.startsWith('@/')) {
    candidateBase = join(srcDir, specifier.slice(2))
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    candidateBase = resolve(dirname(sourceFile), specifier)
  } else {
    return null
  }

  // 1. Coincidencia exacta
  if (existsSync(candidateBase) && statSync(candidateBase).isFile()) {
    return candidateBase
  }

  // 2. Probar extensiones estándar
  for (const ext of ['.ts', '.vue', '.tsx', '.js', '.jsx']) {
    const withExt = candidateBase + ext
    if (existsSync(withExt) && statSync(withExt).isFile()) {
      return withExt
    }
  }

  // 3. Probar barril index
  for (const ext of ['.ts', '.js']) {
    const withIndex = join(candidateBase, 'index' + ext)
    if (existsSync(withIndex) && statSync(withIndex).isFile()) {
      return withIndex
    }
  }

  return null
}

/** Detecta si un SFC de Vue es solo una cáscara vacía / wrapper redundante. */
function isEmptyShellComponent(content, relPath = '') {
  if (
    relPath === 'src/App.vue' ||
    content.includes('RouterView') ||
    content.includes('router-view') ||
    content.includes('<slot')
  ) {
    return false
  }

  const clean = content.replace(/<!--[\s\S]*?-->/g, '').trim()
  const templateMatch = clean.match(/<template>([\s\S]*?)<\/template>/)
  if (!templateMatch) return false
  const templateBody = templateMatch[1].trim()

  const tags = templateBody.match(/<[A-Z][a-zA-Z0-9_-]*/g) || []
  if (tags.length !== 1) return false

  const scriptMatch = clean.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/)
  if (!scriptMatch) {
    return true
  }

  const scriptBody = scriptMatch[1].trim()
  const meaningfulLines = scriptBody
    .split('\n')
    .filter((l) => {
      const s = l.trim()
      return (
        s.length > 0 &&
        !s.startsWith('import ') &&
        !s.startsWith('//') &&
        !s.startsWith('/*') &&
        !s.startsWith('*')
      )
    })

  return meaningfulLines.length === 0
}

function scanCleanDesign(rootPath = null, minLoc = DEFAULT_MIN_LOC) {
  const root = findProjectRoot(rootPath)
  const srcDir = join(root, 'src')
  const testsDir = join(root, 'tests')
  const scriptsDir = join(root, 'scripts')

  const issues = []

  if (!existsSync(srcDir)) {
    return {
      rootPath: root,
      totalIssues: 0,
      issues: [],
      summary: { unreachableFiles: 0, emptyShells: 0, microFiles: 0 },
    }
  }

  const allSrcFiles = walk(srcDir, SOURCE_EXTENSIONS)
  const allTestFiles = existsSync(testsDir) ? walk(testsDir, SOURCE_EXTENSIONS) : []
  const allScriptFiles = existsSync(scriptsDir) ? walk(scriptsDir, SOURCE_EXTENSIONS) : []

  // 1. Grafo de Alcance (Reachability Graph)
  const entrypoints = new Set()

  for (const candidate of ['src/main.ts', 'src/main.js', 'src/App.vue', 'src/app/router/index.ts']) {
    const full = join(root, candidate)
    if (existsSync(full)) entrypoints.add(full)
  }

  for (const testFile of allTestFiles) {
    entrypoints.add(testFile)
  }

  for (const srcFile of allSrcFiles) {
    if (srcFile.endsWith('.d.ts')) {
      entrypoints.add(srcFile)
    }
  }

  const visited = new Set()
  const queue = Array.from(entrypoints)

  while (queue.length > 0) {
    const current = queue.shift()
    if (visited.has(current)) continue
    visited.add(current)

    const content = readContent(current)
    const specifiers = extractImportSpecifiers(content)

    for (const spec of specifiers) {
      const resolved = resolveImportPath(spec, current, root)
      if (resolved && !visited.has(resolved)) {
        queue.push(resolved)
      }
    }
  }

  // Chequeo 1: UNREACHABLE_FILE
  for (const file of allSrcFiles) {
    if (!visited.has(file)) {
      const rel = relToProject(file, root)
      issues.push({
        code: 'UNREACHABLE_FILE',
        category: 'Código Muerto',
        filePath: rel,
        lineno: 1,
        symbol: rel,
        message: `El archivo '${rel}' no es alcanzable desde ningún entrypoint (main, router, App.vue) ni suites de tests.`,
        suggestion: 'Elimine el archivo si ya no se utiliza o conéctelo al flujo principal de importaciones.',
      })
    }
  }

  // Chequeo 2: EMPTY_SHELL_COMPONENT & SPECULATIVE_MICRO_FILE
  for (const file of allSrcFiles) {
    const rel = relToProject(file, root)
    const content = readContent(file)

    if (file.endsWith('.vue')) {
      if (isEmptyShellComponent(content, rel)) {
        issues.push({
          code: 'EMPTY_SHELL_COMPONENT',
          category: 'Sobreingeniería',
          filePath: rel,
          lineno: 1,
          symbol: rel,
          message: `El componente '${rel}' es una cáscara vacía que solo encapsula un componente hijo sin lógica, props ni eventos adicionales.`,
          suggestion: 'Consuma directamente el componente interno para evitar saltos de indirección innecesarios.',
        })
      }
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      const filename = rel.split('/').pop()
      if (filename !== 'index.ts' && filename !== 'index.js' && !filename.endsWith('.d.ts')) {
        const loc = countEffectiveLines(content)
        if (loc < minLoc) {
          issues.push({
            code: 'SPECULATIVE_MICRO_FILE',
            category: 'Sobreingeniería',
            filePath: rel,
            lineno: 1,
            symbol: rel,
            message: `El archivo '${rel}' es un micro-archivo especulativo con solo ${loc} líneas de código efectivo.`,
            suggestion: 'Evite la sobre-fragmentación. Co-ubique esta función o tipo junto a su consumidor principal.',
          })
        }
      }
    }
  }

  const summary = {
    unreachableFiles: issues.filter((i) => i.code === 'UNREACHABLE_FILE').length,
    emptyShells: issues.filter((i) => i.code === 'EMPTY_SHELL_COMPONENT').length,
    microFiles: issues.filter((i) => i.code === 'SPECULATIVE_MICRO_FILE').length,
  }

  return {
    rootPath: root,
    totalIssues: issues.length,
    issues,
    summary,
  }
}

function main() {
  const args = process.argv.slice(2)
  const isJson = args.includes('--json')
  const isStrict = args.includes('--strict')

  const results = scanCleanDesign()

  if (isJson) {
    console.log(JSON.stringify(results, null, 2))
    if (isStrict && results.totalIssues > 0) {
      process.exit(1)
    }
    process.exit(0)
  }

  console.log('='.repeat(70))
  console.log('🧹 AUDITOR DETERMINÍSTICO DE CÓDIGO MUERTO Y SOBREINGENIERÍA — SPA (FSD)')
  console.log('='.repeat(70))
  console.log(`📁 Raíz del proyecto: ${results.rootPath}`)
  console.log(`🔍 Violaciones detectadas: ${results.totalIssues}`)
  console.log('-'.repeat(70))

  console.log(`   • Archivos Huérfanos (Unreachable):  ${results.summary.unreachableFiles}`)
  console.log(`   • Componentes Cáscara Vacía:        ${results.summary.emptyShells}`)
  console.log(`   • Micro-archivos Especulativos:      ${results.summary.microFiles}`)
  console.log('-'.repeat(70))

  if (results.totalIssues === 0) {
    console.log('\n🎉 ¡Excelente! No se detectó código muerto ni sobreingeniería en el frontend.')
    console.log('='.repeat(70))
    process.exit(0)
  }

  console.log('\n⚠️  DETALLE DE VIOLACIONES DETECTADAS:')
  for (const issue of results.issues) {
    console.log(`\n[${issue.code}] ${issue.filePath}:${issue.lineno} -> ${issue.symbol}`)
    console.log(`   Motivo:     ${issue.message}`)
    console.log(`   Sugerencia: ${issue.suggestion}`)
  }

  console.log('\n' + '='.repeat(70))
  if (isStrict) {
    console.log('💥 MODO STRICT: Se encontraron violaciones que deben corregirse.')
    console.log('='.repeat(70))
    process.exit(1)
  } else {
    console.log('💡 Revise las sugerencias anteriores para mantener el frontend limpio y desacoplado.')
    console.log('='.repeat(70))
    process.exit(0)
  }
}

export { findProjectRoot, scanCleanDesign, walk }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
