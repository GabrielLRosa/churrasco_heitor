@echo off
setlocal ENABLEDELAYEDEXPANSION

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0docker-start.ps1" -Environment %ENVIRONMENT%

endlocal

