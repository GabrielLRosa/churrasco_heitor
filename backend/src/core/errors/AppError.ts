export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}