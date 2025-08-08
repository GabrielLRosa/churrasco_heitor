FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN if [ ! -f package-lock.json ]; then npm install --package-lock-only --no-audit --no-fund; fi

COPY package*.json ./

RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

CMD ["npm", "run", "dev"]