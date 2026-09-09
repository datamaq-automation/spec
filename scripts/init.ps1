<#
.SYNOPSIS
    init.ps1 — Scaffolding y Setup Canónico (Uncle Bob & Clean/FSD Spec) para Windows PowerShell.
.DESCRIPTION
    Inicializa o actualiza un proyecto descargando la estructura canónica,
    la especificación técnica SRS y ejecutando el Guantelete de Restricciones.
.EXAMPLE
    .\scripts\init.ps1 -Type backend -TargetDir mi-backend-app
    .\scripts\init.ps1 -Type frontend -TargetDir . -Upgrade
    .\scripts\init.ps1 -Type backend -TargetDir . -Force
#>
[CmdletBinding()]
param (
    [Parameter(Position = 0, Mandatory = $false)]
    [ValidateSet('backend', 'frontend')]
    [string]$Type,

    [Parameter(Position = 1, Mandatory = $false)]
    [string]$TargetDir = '.',

    [switch]$Upgrade,
    [switch]$Force
)

$Repo = 'datamaq-automation/spec'
$Branch = 'main'
$ZipUrl = "https://github.com/$Repo/archive/refs/heads/$Branch.zip"
$RawBaseUrl = "https://raw.githubusercontent.com/$Repo/$Branch"

function Show-Usage {
    Write-Host ''
    Write-Host 'Uso: .\scripts\init.ps1 -Type [backend|frontend] [-TargetDir DIRECTORIO_DESTINO] [-Upgrade] [-Force]' -ForegroundColor Yellow
    Write-Host ''
    Write-Host 'Modos:'
    Write-Host '  (por defecto) : Inicialización segura. Se detiene si detecta un proyecto existente.'
    Write-Host '  -Upgrade      : Actualiza únicamente validadores (tests/scripts) y .pre-commit-config.yaml.'
    Write-Host '                  No toca src/, docs/ ni configuraciones personalizadas.'
    Write-Host '  -Force        : Sobreescribe el template completo realizando backup preventivo de docs/.'
    Write-Host ''
    Write-Host 'Ejemplos:'
    Write-Host '  .\scripts\init.ps1 -Type backend -TargetDir mi-backend-app'
    Write-Host '  .\scripts\init.ps1 -Type frontend -TargetDir . -Upgrade'
    Write-Host '  .\scripts\init.ps1 -Type backend -TargetDir . -Force'
    Write-Host ''
}

if (-not $Type) {
    Write-Error 'Debe especificar el parámetro -Type como ''backend'' o ''frontend''.'
    Show-Usage
    exit 1
}

$ResolvedTarget = [System.IO.Path]::GetFullPath($TargetDir)
$ModeDesc = if ($Upgrade) { "Actualización (-Upgrade)" } elseif ($Force) { "Sobreescritura forzada (-Force)" } else { "Inicialización" }

Write-Host '======================================================================' -ForegroundColor Cyan
Write-Host "🚀 Operación: $Type (Modo: $ModeDesc)" -ForegroundColor Cyan
Write-Host "📂 Destino: $ResolvedTarget" -ForegroundColor Cyan
Write-Host '======================================================================' -ForegroundColor Cyan

if (-not (Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$SpecFileName = if ($Type -eq 'backend') { 'srs-spec-backend-fastapi.md' } else { 'srs-spec-frontend-vue-vite.md' }
$DocsDir = Join-Path $TargetDir 'docs'
$SpecPath = Join-Path $DocsDir $SpecFileName

# Detección de proyecto preexistente
$SrcDir = Join-Path $TargetDir 'src'
$PackageJson = Join-Path $TargetDir 'package.json'
$RequirementsTxt = Join-Path $TargetDir 'requirements.txt'

$ProjectExists = (Test-Path $SpecPath) -or (Test-Path $SrcDir) -or (Test-Path $PackageJson) -or (Test-Path $RequirementsTxt)

if ($ProjectExists -and (-not $Upgrade) -and (-not $Force)) {
    Write-Warning "Se detectó un proyecto preexistente en '$TargetDir'."
    Write-Host 'Para evitar la sobreescritura accidental de tu especificación personalizada y código fuente:' -ForegroundColor Yellow
    Write-Host '  -Upgrade : Actualiza únicamente validadores (tests/scripts) y .pre-commit-config.yaml' -ForegroundColor White
    Write-Host '  -Force   : Sobreescribe el template completo (realiza backup preventivo de docs/)' -ForegroundColor White
    Write-Host ''
    Write-Host 'Ejemplo:' -ForegroundColor Gray
    Write-Host "  .\scripts\init.ps1 -Type $Type -TargetDir $TargetDir -Upgrade" -ForegroundColor Gray
    Write-Host "  .\scripts\init.ps1 -Type $Type -TargetDir $TargetDir -Force" -ForegroundColor Gray
    exit 1
}

if ($Upgrade) {
    Write-Host "🔄 Actualizando validadores arquitectónicos, tooling y guía pedagógica ($Type)..." -ForegroundColor Green
    $DocsDir = Join-Path $TargetDir 'docs'
    if (-not (Test-Path $DocsDir)) { New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null }
    Invoke-WebRequest -Uri "$RawBaseUrl/docs/guia-andamiaje-proyectos.md" -OutFile (Join-Path $DocsDir 'guia-andamiaje-proyectos.md') -UseBasicParsing
    if ($Type -eq 'backend') {
        $TestsDir = Join-Path $TargetDir 'tests'
        if (-not (Test-Path $TestsDir)) { New-Item -ItemType Directory -Path $TestsDir -Force | Out-Null }
        Invoke-WebRequest -Uri "$RawBaseUrl/backend/template/tests/test_architecture.py" -OutFile (Join-Path $TestsDir 'test_architecture.py') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/backend/template/tests/test_god_components.py" -OutFile (Join-Path $TestsDir 'test_god_components.py') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/backend/template/tests/test_clean_design.py" -OutFile (Join-Path $TestsDir 'test_clean_design.py') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/backend/template/.pre-commit-config.yaml" -OutFile (Join-Path $TargetDir '.pre-commit-config.yaml') -UseBasicParsing
    } else {
        $ScriptsDir = Join-Path $TargetDir 'scripts'
        if (-not (Test-Path $ScriptsDir)) { New-Item -ItemType Directory -Path $ScriptsDir -Force | Out-Null }
        Invoke-WebRequest -Uri "$RawBaseUrl/frontend/template/scripts/test_architecture.mjs" -OutFile (Join-Path $ScriptsDir 'test_architecture.mjs') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/frontend/template/scripts/test_god_components.mjs" -OutFile (Join-Path $ScriptsDir 'test_god_components.mjs') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/frontend/template/scripts/test_clean_design.mjs" -OutFile (Join-Path $ScriptsDir 'test_clean_design.mjs') -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/frontend/template/.pre-commit-config.yaml" -OutFile (Join-Path $TargetDir '.pre-commit-config.yaml') -UseBasicParsing
    }
} else {
    if ($Force -and (Test-Path $SpecPath)) {
        $Timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
        $BackupSpec = "$SpecPath.backup.$Timestamp"
        Write-Host "🛡️  Realizando backup preventivo de la especificación en: $BackupSpec" -ForegroundColor Yellow
        Copy-Item -Path $SpecPath -Destination $BackupSpec -Force
    }

    $Guid = [System.Guid]::NewGuid().ToString()
    $TempZip = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "spec-$Guid.zip")
    $TempExtract = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "spec-$Guid")

    try {
        # 1. Descargar y descomprimir zip de GitHub
        Write-Host "📦 1/3 Descargando scaffolding del template ($Type)..." -ForegroundColor Green
        Invoke-WebRequest -Uri $ZipUrl -OutFile $TempZip -UseBasicParsing
        Expand-Archive -Path $TempZip -DestinationPath $TempExtract -Force

        $SourceTemplateDir = Join-Path $TempExtract "spec-$Branch\$Type\template"
        if (Test-Path $SourceTemplateDir) {
            Copy-Item -Path "$SourceTemplateDir\*" -Destination $TargetDir -Recurse -Force
            Get-ChildItem -Path $SourceTemplateDir -Force | Where-Object { $_.Name.StartsWith('.') } | ForEach-Object {
                Copy-Item -Path $_.FullName -Destination $TargetDir -Force -Recurse
            }
        } else {
            Write-Error "No se encontró el directorio de plantilla en el archivo descargado: $SourceTemplateDir"
            exit 1
        }

        # 2. Descargar la especificación técnica SRS y guía pedagógica a docs/
        Write-Host '📄 2/3 Descargando especificación SRS y guía pedagógica a docs/...' -ForegroundColor Green
        if (-not (Test-Path $DocsDir)) {
            New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
        }

        if ($Type -eq 'backend') {
            $SrsUrl = "$RawBaseUrl/backend/srs-spec-backend-fastapi.md"
        } else {
            $SrsUrl = "$RawBaseUrl/frontend/srs-spec-frontend-vue-vite.md"
        }
        Invoke-WebRequest -Uri $SrsUrl -OutFile $SpecPath -UseBasicParsing
        Invoke-WebRequest -Uri "$RawBaseUrl/docs/guia-andamiaje-proyectos.md" -OutFile (Join-Path $DocsDir 'guia-andamiaje-proyectos.md') -UseBasicParsing
    } finally {
        if (Test-Path $TempZip) { Remove-Item -Path $TempZip -Force -ErrorAction SilentlyContinue }
        if (Test-Path $TempExtract) { Remove-Item -Path $TempExtract -Recurse -Force -ErrorAction SilentlyContinue }
    }
}

# 3. Validar de inmediato el Guantelete de Restricciones
Write-Host '🛡️  Ejecutando Guantelete de Restricciones sobre el proyecto...' -ForegroundColor Green
Push-Location $TargetDir
try {
    if ($Type -eq 'backend') {
        if (Get-Command python -ErrorAction SilentlyContinue) {
            python tests/test_architecture.py
            python tests/test_god_components.py
            python tests/test_clean_design.py
        } elseif (Get-Command py -ErrorAction SilentlyContinue) {
            py tests/test_architecture.py
            py tests/test_god_components.py
            py tests/test_clean_design.py
        } else {
            Write-Warning 'Python no está en el PATH para validar localmente en este momento.'
        }
    } else {
        if (Get-Command node -ErrorAction SilentlyContinue) {
            node scripts/test_architecture.mjs
            node scripts/test_god_components.mjs
            node scripts/test_clean_design.mjs
        } else {
            Write-Warning 'Node.js no está en el PATH para validar localmente en este momento.'
        }
    }
} finally {
    Pop-Location
}

Write-Host ''
Write-Host '======================================================================' -ForegroundColor Cyan
if ($Upgrade) {
    Write-Host "🎉 ¡Validadores y tooling de $Type actualizados con éxito en $TargetDir!" -ForegroundColor Cyan
} else {
    Write-Host "🎉 ¡Proyecto $Type inicializado con éxito en $TargetDir!" -ForegroundColor Cyan
}
Write-Host '======================================================================' -ForegroundColor Cyan
if ($Type -eq 'backend') {
    Write-Host 'Próximos pasos:'
    Write-Host "  1. cd $TargetDir"
    Write-Host '  2. Copy-Item .env.example .env (si es un proyecto nuevo)'
    Write-Host '  3. pytest tests/test_architecture.py -v'
} else {
    Write-Host 'Próximos pasos:'
    Write-Host "  1. cd $TargetDir"
    Write-Host '  2. Copy-Item .env.example .env.local (si es un proyecto nuevo)'
    Write-Host '  3. npm install'
    Write-Host '  4. npm run test:all'
}
Write-Host '======================================================================' -ForegroundColor Cyan
