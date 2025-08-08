FROM node:20-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /usr/src/app

COPY package.json ./
RUN if [ ! -f package-lock.json ]; then npm install --package-lock-only --no-audit --no-fund; fi

COPY package*.json ./

RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

RUN chmod +x ./wait-for-db.sh

ENTRYPOINT ["./wait-for-db.sh"]

CMD ["npm", "run", "dev"]