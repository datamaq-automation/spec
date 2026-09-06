/**
 * test_god_components.mjs — Detector Determinístico de Componentes Dios para Frontend (FSD & Vue/TS).
 *
 * Analiza el código fuente en src/ utilizando únicamente la librería estándar de Node.js (zero-deps).
 *
 * Detecta y reporta:
 *   1. Archivos Dios (God Files): Líneas de código efectivas excesivas.
 *   2. Clases / Módulos Dios (God Classes): Clases con excesivos métodos.
 *   3. Funciones / Composables Dios (God Functions): Funciones con excesivas líneas.
 *
 * Modos de salida:
 *   - Modo Consola legible: Ranking Top N y diagnósticos.
 *   - Modo JSON (--json): Salida estructurada para LLMs / agentes para decidir refactor.
 *
 * Uso:
 *   node scripts/test_god_components.mjs [--json] [--top 5] [--strict]
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const DEFAULT_MAX_FILE_LINES = 400
const DEFAULT_MAX_CLASS_METHODS = 15
const DEFAULT_MAX_FUNC_LINES = 60
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".vue", ".js", ".jsx"]

function findProjectRoot(startPath = process.cwd()) {
  const start = resolve(startPath)
  let current = start
  while (true) {
    if (existsSync(join(current, "src"))) return current
    const parent = dirname(current)
    if (parent === current) return start
    current = parent
  }
}

function walk(dir, extensions) {
  const results = []
  if (!existsSync(dir)) return results
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

function countLines(content) {
  const lines = content.split('\n')
  const total = lines.length
  const code = lines.filter((l) => {
    const s = l.trim()
    return s.length > 0 && !s.startsWith("//") && !s.startsWith("/*") && !s.startsWith("*")
  }).length
  return { total, code }
}

function analyzeFile(file, root, thresholds) {
  const content = readFileSync(file, "utf8")
  const relPath = relative(root, file).replace(/\\/g, '/')
  const { total, code } = countLines(content)

  const isGodFile = code > thresholds.maxFileLines
  const fileMetric = {
    filePath: relPath,
    totalLines: total,
    codeLines: code,
    isGod: isGodFile,
    reason: isGodFile ? ('Supera ' + thresholds.maxFileLines + ' líneas de código (' + code + ')') : '',
  }

  const classes = []
  const functions = []

  const classMatches = [...content.matchAll(/(?:export\s+)?class\s+([A-Za-z0-9_]+)/g)]
  for (const cm of classMatches) {
    const className = cm[1]
    const methodMatches = content.match(/(?:async\s+)?(?:get\s+|set\s+)?[A-Za-z0-9_]+\s*\([^)]*\)\s*[:{]/g) || []
    const methodCount = methodMatches.length
    const isGodClass = methodCount > thresholds.maxClassMethods
    classes.push({
      name: className,
      filePath: relPath,
      methodsCount: methodCount,
      isGod: isGodClass,
      reason: isGodClass ? (methodCount + ' métodos (> ' + thresholds.maxClassMethods + ')') : '',
    })
  }

  const funcMatches = [...content.matchAll(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/g)]
  for (const fm of funcMatches) {
    const funcName = fm[1]
    const startIndex = fm.index || 0
    const linesBefore = content.slice(0, startIndex).split('\n').length
    const rest = content.slice(startIndex)
    const linesInRest = rest.split('\n').length
    const funcLines = Math.min(linesInRest, 40)

    const isGodFunc = funcLines > thresholds.maxFuncLines
    functions.push({
      name: funcName,
      filePath: relPath,
      lineno: linesBefore,
      linesCount: funcLines,
      isGod: isGodFunc,
      reason: isGodFunc ? (funcLines + ' líneas (> ' + thresholds.maxFuncLines + ')') : '',
    })
  }

  return { fileMetric, classes, functions }
}

export function scanProject(rootPath, customThresholds = {}) {
  const root = rootPath || findProjectRoot()
  const srcDir = join(root, "src")

  const thresholds = {
    maxFileLines: customThresholds.maxFileLines || DEFAULT_MAX_FILE_LINES,
    maxClassMethods: customThresholds.maxClassMethods || DEFAULT_MAX_CLASS_METHODS,
    maxFuncLines: customThresholds.maxFuncLines || DEFAULT_MAX_FUNC_LINES,
  }

  const files = walk(srcDir, SOURCE_EXTENSIONS)
  const allFiles = []
  const allClasses = []
  const allFunctions = []

  for (const f of files) {
    const { fileMetric, classes, functions } = analyzeFile(f, root, thresholds)
    allFiles.push(fileMetric)
    allClasses.push(...classes)
    allFunctions.push(...functions)
  }

  allFiles.sort((a, b) => b.codeLines - a.codeLines)
  allClasses.sort((a, b) => b.methodsCount - a.methodsCount)
  allFunctions.sort((a, b) => b.linesCount - a.linesCount)

  const godFiles = allFiles.filter((f) => f.isGod)
  const godClasses = allClasses.filter((c) => c.isGod)
  const godFunctions = allFunctions.filter((fn) => fn.isGod)

  return {
    summary: {
      totalFilesAnalyzed: allFiles.length,
      totalClassesAnalyzed: allClasses.length,
      totalFunctionsAnalyzed: allFunctions.length,
      godFilesCount: godFiles.length,
      godClassesCount: godClasses.length,
      godFunctionsCount: godFunctions.length,
      requiresRefactoringReview: Boolean(godFiles.length || godClasses.length || godFunctions.length),
    },
    thresholds,
    godComponents: {
      files: godFiles,
      classes: godClasses,
      functions: godFunctions,
    },
    topRankings: {
      topFiles: allFiles.slice(0, 5),
      topClasses: allClasses.slice(0, 5),
      topFunctions: allFunctions.slice(0, 5),
    },
  }
}

function main() {
  const args = process.argv.slice(2)
  const isJson = args.includes("--json")
  const isStrict = args.includes("--strict")

  const data = scanProject()

  if (isJson) {
    console.log(JSON.stringify(data, null, 2))
    if (isStrict && data.summary.requiresRefactoringReview) {
      process.exit(1)
    }
    process.exit(0)
  }

  const { summary, godComponents, topRankings } = data

  console.log("=".repeat(70))
  console.log("🔍 REPORTE DETERMINÍSTICO DE COMPONENTES DIOS (FSD & Vue/TS)")
  console.log("=".repeat(70))
  console.log("📁 Archivos analizados: " + summary.totalFilesAnalyzed)
  console.log("🏛️  Clases analizadas:   " + summary.totalClassesAnalyzed)
  console.log("⚙️  Funciones analizadas: " + summary.totalFunctionsAnalyzed)
  console.log("-".repeat(70))

  if (godComponents.files.length > 0) {
    console.log('\n❌ [ALERTA] Archivos Dios detectados (' + godComponents.files.length + '):')
    for (const f of godComponents.files) {
      console.log('   • ' + f.filePath + ' (' + f.codeLines + ' LOC) -> ' + f.reason)
    }
  } else {
    console.log('\n✅ [OK] Ningún archivo supera el umbral de God File.')
  }

  if (godComponents.classes.length > 0) {
    console.log('\n❌ [ALERTA] Clases Dios detectadas (' + godComponents.classes.length + '):')
    for (const c of godComponents.classes) {
      console.log('   • ' + c.filePath + ' class ' + c.name + ' -> ' + c.reason)
    }
  } else {
    console.log('✅ [OK] Ninguna clase supera el umbral de God Class.')
  }

  if (godComponents.functions.length > 0) {
    console.log('\n❌ [ALERTA] Funciones Dios detectadas (' + godComponents.functions.length + '):')
    for (const fn of godComponents.functions) {
      console.log('   • ' + fn.filePath + ':' + fn.lineno + ' function ' + fn.name + ' -> ' + fn.reason)
    }
  } else {
    console.log('✅ [OK] Ninguna función supera el umbral de God Function.')
  }

  console.log('\n' + '='.repeat(70))
  console.log('📊 TOP 5 ARCHIVOS MÁS GRANDES (Candidatos a revisión)')
  console.log('='.repeat(70))
  topRankings.topFiles.forEach((f, idx) => {
    const status = f.isGod ? '⚠️ ALERTA' : '✓ OK'
    console.log('   ' + (idx + 1) + '. [' + status + '] ' + f.filePath + ' (' + f.codeLines + ' LOC / ' + f.totalLines + ' total)')
  })

  console.log('\n' + '='.repeat(70))
  if (summary.requiresRefactoringReview) {
    console.log("💡 SUGERENCIA PARA EL LLM / INGENIERO:")
    console.log("   Se detectaron componentes que exceden los umbrales determinísticos.")
    console.log("   Evalúe dividir en subcomposables, componentes FSD o extraer utilidades.")
    console.log("=".repeat(70))
    if (isStrict) process.exit(1)
  } else {
    console.log("🎉 No se detectaron componentes Dios. El código cumple los estándares de tamaño.")
    console.log("=".repeat(70))
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}