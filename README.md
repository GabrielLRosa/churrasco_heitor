# 🚗 PROLOG Checklist App

Sistema de checklist eletrônico para veículos, com frontend híbrido (PHP + React) e backend Node.js. Containers orquestrados via Docker Compose.

## 🏗️ Arquitetura
- Frontend Híbrido: PHP (CodeIgniter 3) orquestrando React + TypeScript + Vite
- Backend API: Node.js + TypeScript + Express + PostgreSQL (Sequelize)
- Cache: Redis
- Dev server: Vite (hot reload)
- Orquestração: Docker + Docker Compose

## 📁 Estrutura do Projeto
```
checklist_test/
├── backend/                     # API Node.js + TypeScript
│   ├── src/                     # Código fonte
│   ├── jest.config.js           # Configuração de testes
│   └── package.json             # Scripts backend
├── frontend/
│   ├── php/                     # Frontend PHP (CodeIgniter)
│   └── react/                   # Frontend React + Vite + TS
│       ├── src/                 # Código React
│       ├── jest.config.mjs      # Configuração de testes
│       └── package.json         # Scripts react
├── shared/                      # Tipos compartilhados (TS)
├── docker compose.yml           # Orquestração
├── docker-start.sh              # Script de inicialização
└── package.json                 # Scripts na raiz
```

## 🚀 Comandos (raiz)

- Desenvolvimento (sobe containers e Vite dev server)
```
npm run dev
```

- Build de produção (apenas build; não sobe containers)
```
npm run build
```

- Parar ambiente de desenvolvimento (containers + Vite)
```
npm run stop
```

- Testes (roda backend e frontend)
```
npm run test
```

## 🌐 URLs (dev)
- PHP Frontend (CodeIgniter): http://localhost:8080
- Backend API: http://localhost:8081
- Swagger Docs: http://localhost:8081/api-docs
- React (Vite dev): http://localhost:5174

Observação: Em produção, o React é buildado para `frontend/react/dist/` e deve ser servido por um servidor web.

## 🧪 Testes

- Backend (na pasta `backend/`):
```
npm test
```
- Frontend (na pasta `frontend/react/`):
```
npm test
```
- Raiz (executa ambos em sequência):
```
npm run test
```

Cobertura:
- Frontend: Jest + Testing Library com jsdom e ts-jest (ESM), mocks de `react-icons`.
- Backend: Jest + ts-jest; testes unitários e integração (SQLite in-memory).

## 🔧 Variáveis de Ambiente

Crie os arquivos `.env.dev` e `.env.prod` conforme seu ambiente. Exemplos de chaves esperadas pelo `docker compose.yml`:
```
# Banco de Dados
DB_HOST=db
DB_NAME=checklist_db_dev
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_PORT=5432

# Aplicação
APP_ENV=dev
APP_PORT=8081

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

#React
VITE_PORT=5173
```

O `npm run build` usa `.env.prod` para buildar imagens docker e gerar o build de React; não inicia containers.

## 📚 API (resumo)
- POST /api/checklist: cria checklist
- GET /api/checklist: lista com filtros booleanos, paginação (limit/offset) e ordenação
```

## 🧱 Padrões e Boas Práticas
- Clean Architecture: Controllers, Services, Repositories
- Tipagem forte (TypeScript) compartilhada em `shared/` pela caracteristica do projeto ser MONOREPO
- Cache Redis
- Logs estruturados (Winston)

## 🛠️ Dicas
- Se a porta estiver em uso, encerre processos antigos ou mude as portas no `.env`.
- Para rebuild sem subir containers (produção): `npm run build`
- Para logs em dev: `npm run logs`, `npm run logs:backend`, `npm run logs:db`
- Mantenha os lockfiles versionados (obrigatório para reproduzir os ambientes de dev e prod):
  - Node/JS: `package-lock.json` em cada projeto Node (ex.: `backend/` e `frontend/react/`). Use `npm ci` em CI/produção para respeitar o lock.
  - PHP: `frontend/php/composer.lock`. Use `composer install --no-dev --prefer-dist --no-interaction` em produção para respeitar o lock.

---

## 💻 Windows (observação)

Em ambientes Windows (sem WSL/Git Bash), rode a instalação das dependências manualmente e depois suba os containers com o Compose:

1) Instale dependências em cada pasta:

```
cd frontend/react && npm ci || npm install && cd ../..
cd backend && npm ci || npm install && cd ..
cd frontend/php && composer install --no-interaction --prefer-dist --optimize-autoloader && cd ../..
```

2) Suba os containers (modo desenvolvimento):

```
npm run dev:compose
```

Se preferir, execute diretamente:

```
docker compose --env-file .env.dev up --build -d
```

Para hot reload do React em Windows, execute o Vite localmente se necessário:

```
cd frontend/react
npm run dev
```

## 🧩 Troubleshooting

- Erro: "Cannot find module '@rollup/rollup-<platform>'" ao rodar build do React
  - Como resolver (qualquer SO):
    1. Use Node 20 e npm >= 9
       - Com nvm: `nvm use 20 || (nvm install 20 && nvm use 20)`
    2. Garanta que opcionais estão habilitados no npm
       - Verifique: `npm config get optional` (deve retornar `true`)
       - Se necessário: `npm config set optional true`
    3. Reinstale dependências do frontend React com versões travadas
       - `cd frontend/react && rm -rf node_modules package-lock.json && npm install`
       - ou: `npm ci`
    4. Em Alpine Linux, instale compatibilidade glibc para binários do Rollup
       - `apk add --no-cache libc6-compat`
    5. Se usar outro gerenciador de pacotes:
       - pnpm: `pnpm i --config.optional=true`
       - yarn: `yarn add -D rollup@^4` (prefira npm neste projeto)