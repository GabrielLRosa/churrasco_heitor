#!/bin/bash

ENVIRONMENT=${1:-dev}

echo "🚗 Iniciando Checklist API - Ambiente: $ENVIRONMENT"
echo "=================================================="

if [ "$ENVIRONMENT" = "prod" ]; then
    ENV_FILE=".env.prod"
    ENV_NAME="produção"
else
    ENV_FILE=".env.dev"
    ENV_NAME="desenvolvimento"
    ENVIRONMENT="dev"
fi

if [ "$ENVIRONMENT" = "prod" ]; then
    echo ""
    echo "🛠️  Buildando imagens Docker (sem subir containers)..."
    docker compose --env-file $ENV_FILE build || exit 1

    echo ""
    echo "🏗️  Buildando React para produção..."
    cd frontend/react || exit 1
    npm run build || exit 1
    cd ../.. || exit 1
    echo "✅ Build do React concluído! Arquivos em frontend/react/dist/"

    echo ""
    echo "📦 Build de produção finalizado:"
    echo "   - Imagens Docker construídas (docker compose build)"
    echo "   - React build gerado em frontend/react/dist/"
    echo ""
    echo "ℹ️  Nenhum container foi iniciado. Use docker compose up em ambientes gerenciados de deploy."
    exit 0
fi

echo ""
echo "🛠️  Buildando e iniciando containers para $ENV_NAME..."
echo ""

docker compose --env-file $ENV_FILE down --remove-orphans

docker compose --env-file $ENV_FILE up --build -d || exit 1

echo ""
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 8

echo ""
echo "🔥 Iniciando Vite dev server para desenvolvimento..."
echo "   (Executando em background com hot reload)"
cd frontend/react || exit 1

if [ ! -d node_modules ]; then
  echo "📦 Instalando dependências do frontend..."
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund || exit 1
fi

npm run dev &
VITE_PID=$!
cd ../.. || exit 1

echo "⏳ Aguardando Vite inicializar..."
sleep 5

echo $VITE_PID > .vite.pid

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo "=================================="
echo ""
echo "🌐 URLs disponíveis:"
echo "   PHP Frontend (CodeIgniter):   http://localhost:8080"
echo "   Backend API:                  http://localhost:8081"
echo "   Swagger Docs:                 http://localhost:8081/api-docs"
echo "   React Frontend (Dev):         http://localhost:5174"

echo ""
echo "📋 Aplicação ($ENV_NAME):"
echo "   - PHP Frontend com CodeIgniter 3"
echo "   - React dev server com hot reload"
echo "   - Backend API com hot reload"
echo "   - PostgreSQL database"
echo "   - Redis cache"

echo ""
echo "🐳 Comandos úteis:"
echo "   Ver logs:              docker compose --env-file $ENV_FILE logs -f"
echo "   Ver logs backend:      docker compose --env-file $ENV_FILE logs -f backend"
echo "   Ver logs PHP:          docker compose --env-file $ENV_FILE logs -f php"
echo "   Parar aplicação:       docker compose --env-file $ENV_FILE down"
echo "   Parar Vite:            kill \$(cat .vite.pid 2>/dev/null) 2>/dev/null || echo 'Vite não está rodando'"

echo ""
echo "🔥 Hot reload ativo! Edite os arquivos React e veja as mudanças automaticamente."

echo ""