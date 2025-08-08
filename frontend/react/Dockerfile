# Dockerfile para React + TypeScript + Vite
FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar manifestos e instalar dependências (sem usar npm ci)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copiar restante do código fonte
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]