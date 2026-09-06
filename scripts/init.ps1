<#
.SYNOPSIS
    init.ps1 — Scaffolding y Setup Canónico (Uncle Bob & Clean/FSD Spec) para Windows PowerShell.
.DESCRIPTION
    Inicializa un proyecto descargando la estructura canónica de carpetas y archivos,
    la especificación técnica SRS y ejecutando el Guantelete de Restricciones.
.EXAMPLE
    & ([scriptblock]::Create((iwr -useb https://raw.githubusercontent.com/datamaq-automation/spec/main/scripts/init.ps1).Content)) -Type backend -TargetDir mi-backend-app
    O localmente:
    .\scripts\init.ps1 -Type backend -TargetDir mi-backend-app
#>
[CmdletBinding()]
param (
    [Parameter(Position = 0, Mandatory = $false)]
    [ValidateSet('backend', 'frontend')]
    [string]$Type,

    [Parameter(Position = 1, Mandatory = $false)]
    [string]$TargetDir = '.'
)

$Repo = 'datamaq-automation/spec'
$Branch = 'main'
$ZipUrl = "https://github.com/$Repo/archive/refs/heads/$Branch.zip"
$RawBaseUrl = "https://raw.githubusercontent.com/$Repo/$Branch"

function Show-Usage {
    Write-Host ''
    Write-Host 'Uso: .\scripts\init.ps1 -Type [backend|frontend] [-TargetDir DIRECTORIO_DESTINO]' -ForegroundColor Yellow
    Write-Host ''
    Write-Host 'Ejemplos:'
    Write-Host '  .\scripts\init.ps1 -Type backend -TargetDir mi-backend-app'
    Write-Host '  .\scripts\init.ps1 -Type frontend -TargetDir mi-frontend-app'
    Write-Host '  .\scripts\init.ps1 -Type backend -TargetDir .  # (Directorio actual)'
    Write-Host ''
}

if (-not $Type) {
    Write-Error 'Debe especificar el parámetro -Type como ''backend'' o ''frontend''.'
    Show-Usage
    exit 1
}

$ResolvedTarget = [System.IO.Path]::GetFullPath($TargetDir)
Write-Host '======================================================================' -ForegroundColor Cyan
Write-Host "🚀 Inicializando proyecto: $Type" -ForegroundColor Cyan
Write-Host "📂 Destino: $ResolvedTarget" -ForegroundColor Cyan
Write-Host '======================================================================' -ForegroundColor Cyan

if (-not (Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
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
        Write-Error "No se encontró la carpeta del template en $SourceTemplateDir."
        exit 1
    }

    # 2. Descargar la especificación técnica SRS a docs/
    Write-Host '📄 2/3 Descargando especificación SRS a docs/...' -ForegroundColor Green
    $DocsDir = Join-Path $TargetDir 'docs'
    if (-not (Test-Path $DocsDir)) {
        New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
    }

    if ($Type -eq 'backend') {
        $SrsUrl = "$RawBaseUrl/backend/srs-spec-backend-fastapi.md"
        $SrsDest = Join-Path $DocsDir 'srs-spec-backend-fastapi.md'
        Invoke-WebRequest -Uri $SrsUrl -OutFile $SrsDest -UseBasicParsing
    } else {
        $SrsUrl = "$RawBaseUrl/frontend/srs-spec-frontend-vue-vite.md"
        $SrsDest = Join-Path $DocsDir 'srs-spec-frontend-vue-vite.md'
        Invoke-WebRequest -Uri $SrsUrl -OutFile $SrsDest -UseBasicParsing
    }

    # 3. Validar de inmediato el Guantelete de Restricciones
    Write-Host '🛡️  3/3 Ejecutando Guantelete de Restricciones sobre el nuevo proyecto...' -ForegroundColor Green
    Push-Location $TargetDir
    try {
        if ($Type -eq 'backend') {
            if (Get-Command python -ErrorAction SilentlyContinue) {
                python tests/test_architecture.py
            } elseif (Get-Command py -ErrorAction SilentlyContinue) {
                py tests/test_architecture.py
            } else {
                Write-Warning 'Python no está en el PATH para validar localmente en este momento.'
            }
        } else {
            if (Get-Command node -ErrorAction SilentlyContinue) {
                node scripts/test_architecture.mjs
            } else {
                Write-Warning 'Node.js no está en el PATH para validar localmente en este momento.'
            }
        }
    } finally {
        Pop-Location
    }

    Write-Host ''
    Write-Host '======================================================================' -ForegroundColor Cyan
    Write-Host "🎉 ¡Proyecto $Type inicializado con éxito en $TargetDir!" -ForegroundColor Cyan
    Write-Host '======================================================================' -ForegroundColor Cyan
    if ($Type -eq 'backend') {
        Write-Host 'Próximos pasos:'
        Write-Host "  1. cd $TargetDir"
        Write-Host '  2. Copy-Item .env.example .env'
        Write-Host '  3. pytest tests/test_architecture.py -v'
    } else {
        Write-Host 'Próximos pasos:'
        Write-Host "  1. cd $TargetDir"
        Write-Host '  2. Copy-Item .env.example .env.local'
        Write-Host '  3. npm install'
        Write-Host '  4. npm run test:architecture'
    }
    Write-Host '======================================================================' -ForegroundColor Cyan
} finally {
    if (Test-Path $TempZip) { Remove-Item $TempZip -Force -ErrorAction SilentlyContinue }
    if (Test-Path $TempExtract) { Remove-Item $TempExtract -Recurse -Force -ErrorAction SilentlyContinue }
}
