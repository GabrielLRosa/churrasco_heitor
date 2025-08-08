import app from './app';
import sequelize from '@infra/db/sequelize';
import { AppError } from '@core/errors/AppError';
import { API_ERROR_MESSAGES } from '@typings/constants';

const PORT = process.env.APP_PORT || 8081;


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado com sucesso ao PostgreSQL.');

    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  } catch (error) {
    throw new AppError(API_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED.message, API_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED.statusCode);
  }
};

export default startServer;