import { AppError } from '../AppError';

describe('AppError class', () => {
  it('should create error with message and default status', () => {
    const message = 'Test error message';
    const error = new AppError(message);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('AppError');
    expect(error instanceof Error).toBe(true);
  });

  it('should create error with custom status code', () => {
    const message = 'Not found error';
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.name).toBe('AppError');
  });

  it('should work with different status codes', () => {
    const error401 = new AppError('Unauthorized', 401);
    const error500 = new AppError('Server error', 500);

    expect(error401.statusCode).toBe(401);
    expect(error500.statusCode).toBe(500);
  });
}); 