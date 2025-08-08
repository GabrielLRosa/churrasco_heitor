import { Request, Response, NextFunction } from 'express';
import { AppError } from '@core/errors/AppError';
import logger from '@config/logger';
import { API_ERROR_MESSAGES } from '@typings/constants';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode, path: req.path });
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error(err.message, { stack: err.stack, method: req.method, path: req.path });
  return res.status(API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.statusCode).json({
    error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message,
  });
};

export default errorHandler;