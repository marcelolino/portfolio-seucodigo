@echo off
echo 🚀 Executando migração local no Windows...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 18+ primeiro.
    pause
    exit /b 1
)

REM Verificar se tsx está disponível
npx tsx --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando tsx...
    npm install -g tsx
)

REM Verificar se arquivo .env existe
if not exist ".env" (
    echo ❌ Arquivo .env não encontrado.
    echo.
    echo 📝 Crie um arquivo .env com:
    echo DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/portfolio
    echo SESSION_SECRET=sua_chave_secreta_aqui
    echo.
    pause
    exit /b 1
)

REM Executar migração
echo 🔄 Executando migração...
npx tsx run-local-migration.ts

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Migração concluída com sucesso!
    echo.
    echo 🚀 Para iniciar o projeto:
    echo npm run dev
    echo.
) else (
    echo.
    echo ❌ Erro na migração. Verifique:
    echo 1. PostgreSQL está rodando
    echo 2. Banco 'portfolio' existe
    echo 3. Credenciais no .env estão corretas
    echo.
)

pause