# Quick PostgreSQL Setup Script
# Run this in PowerShell (as Administrator) to install PostgreSQL via Chocolatey

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Quick Setup for Mumbai Hacks" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Check if Chocolatey is installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host "✅ Chocolatey installed" -ForegroundColor Green
} else {
    Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Installing PostgreSQL 15..." -ForegroundColor Yellow
choco install postgresql15 --params '/Password:postgres' -y

Write-Host ""
Write-Host "⏳ Waiting for PostgreSQL service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Add PostgreSQL to PATH
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
if (Test-Path $pgPath) {
    $env:Path += ";$pgPath"
    Write-Host "✅ PostgreSQL added to PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Creating database 'mumbai_hacks'..." -ForegroundColor Yellow

# Create database
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE mumbai_hacks;" 2>$null

Write-Host "✅ Database created" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ PostgreSQL Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Connection Details:" -ForegroundColor Yellow
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: mumbai_hacks" -ForegroundColor White
Write-Host "   User: postgres" -ForegroundColor White
Write-Host "   Password: postgres" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Close and reopen PowerShell" -ForegroundColor White
Write-Host "   2. cd backend" -ForegroundColor White
Write-Host "   3. python test_connection.py" -ForegroundColor White
Write-Host "   4. python init_db.py" -ForegroundColor White
Write-Host ""
