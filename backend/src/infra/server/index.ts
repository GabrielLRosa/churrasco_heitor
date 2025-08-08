import app from './app';
import sequelize from '@infra/db/sequelize';
import { AppError } from '@core/errors/AppError';
import { API_ERROR_MESSAGES } from '@typings/constants';

const PORT = process.env.APP_PORT || 8081;


async function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function connectWithRetry(): Promise<void> {
  const maxAttemptsEnv = process.env.DB_CONNECT_MAX_RETRIES;
  const initialDelayMsEnv = process.env.DB_CONNECT_INITIAL_DELAY_MS;

  const maxAttempts = Number.isFinite(Number(maxAttemptsEnv)) ? parseInt(String(maxAttemptsEnv), 10) : 12; // ~2min com backoff
  const initialDelayMs = Number.isFinite(Number(initialDelayMsEnv)) ? parseInt(String(initialDelayMsEnv), 10) : 1000; // 1s

  let attemptNumber = 0;
  let currentDelayMs = initialDelayMs;

  // Exponential backoff simples com jitter leve
  while (attemptNumber < maxAttempts) {
    try {
      attemptNumber += 1;
      console.log(`Tentando conectar ao PostgreSQL (tentativa ${attemptNumber}/${maxAttempts})...`);
      await sequelize.authenticate();
      console.log('Conectado com sucesso ao PostgreSQL.');
      return;
    } catch (error) {
      const remaining = maxAttempts - attemptNumber;
      if (remaining <= 0) {
        break;
      }
      const jitter = Math.floor(Math.random() * 250);
      console.warn(`Falha ao conectar ao PostgreSQL. Nova tentativa em ${currentDelayMs + jitter}ms...`);
      await sleep(currentDelayMs + jitter);
      currentDelayMs = Math.min(currentDelayMs * 2, 15000); // cap em 15s
    }
  }

  throw new AppError(
    API_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED.message,
    API_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED.statusCode,
  );
}

const startServer = async () => {
  await connectWithRetry();

  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });
};

export default startServer;