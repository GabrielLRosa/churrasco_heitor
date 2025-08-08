#requires -Version 5.1
param(
  [ValidateSet('dev','prod')]
  [string]$Environment = 'dev'
)

$ErrorActionPreference = 'Stop'

Write-Host "🚗 Iniciando Checklist API - Ambiente: $Environment"
Write-Host "=================================================="

if ($Environment -eq 'prod') {
  $EnvFile = '.env.prod'
  $EnvName = 'produção'
} else {
  $EnvFile = '.env.dev'
  $EnvName = 'desenvolvimento'
  $Environment = 'dev'
}

# Checagens de ferramentas
function Assert-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Erro: comando '$name' não encontrado."
  }
}

Assert-Command npm
Assert-Command docker

# Composer pode estar como composer.phar
if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
  if (Test-Path "$PSScriptRoot\frontend\php\composer.phar") {
    $Global:ComposerCmd = "php `"$PSScriptRoot\frontend\php\composer.phar`""
  } else {
    throw "Erro: composer não encontrado. Instale o Composer."
  }
} else {
  $Global:ComposerCmd = 'composer'
}

# Instalar dependências React
$reactDir = Join-Path $PSScriptRoot 'frontend/react'
if (Test-Path (Join-Path $reactDir 'package.json')) {
  Write-Host 'Instalando dependências do React (frontend/react)...'
  Push-Location $reactDir
  if (Test-Path 'package-lock.json') { npm ci } else { npm install --no-fund --no-audit }
  Pop-Location
}

# Instalar dependências backend
$backendDir = Join-Path $PSScriptRoot 'backend'
if (Test-Path (Join-Path $backendDir 'package.json')) {
  Write-Host 'Instalando dependências do backend (backend)...'
  Push-Location $backendDir
  if (Test-Path 'package-lock.json') { npm ci } else { npm install --no-fund --no-audit }
  Pop-Location
}

# Instalar dependências PHP
$phpDir = Join-Path $PSScriptRoot 'frontend/php'
if (Test-Path (Join-Path $phpDir 'composer.json')) {
  Write-Host 'Instalando dependências PHP (frontend/php) com Composer...'
  Push-Location $phpDir
  iex "$Global:ComposerCmd install --no-interaction --prefer-dist --optimize-autoloader"
  Pop-Location
}

# Subir containers
Write-Host ""
Write-Host "🛠️  Buildando e iniciando containers para $EnvName..."
Write-Host ""

docker compose --env-file $EnvFile down --remove-orphans
docker compose --env-file $EnvFile up --build -d

if ($Environment -eq 'dev') {
  Write-Host ''
  Write-Host '🔥 Iniciando Vite dev server para desenvolvimento...'
  Push-Location $reactDir
  if (-not (Test-Path 'node_modules')) {
    Write-Host '📦 Instalando dependências do frontend...'
    try { npm ci --no-audit --no-fund } catch { npm install --no-audit --no-fund }
  }
  Start-Process -FilePath 'npm' -ArgumentList 'run','dev' -NoNewWindow
  Pop-Location
}

Write-Host ''
Write-Host '✅ Aplicação iniciada com sucesso!'
Write-Host '=================================='
Write-Host ''
Write-Host '🌐 URLs disponíveis:'
Write-Host '   PHP Frontend (CodeIgniter):   http://localhost:8080'
Write-Host '   Backend API:                  http://localhost:8081'
Write-Host '   Swagger Docs:                 http://localhost:8081/api-docs'
Write-Host '   React Frontend (Dev):         http://localhost:5174'
Write-Host ''

