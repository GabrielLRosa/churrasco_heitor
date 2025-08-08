import { Request, Response, NextFunction } from 'express';
import errorHandler from '../errorHandler';
import { AppError } from '@core/errors/AppError';
import logger from '@config/logger';
import { createMockRequest, createMockResponse, createMockNextFunction } from '@test-utils/mocks';

jest.mock('@config/logger');

describe('errorHandler middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockLogger: jest.Mocked<typeof logger>;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNextFunction();
    mockLogger = logger as jest.Mocked<typeof logger>;
    jest.clearAllMocks();
  });

  it('should handle AppError correctly', () => {
    const appError = new AppError('Invalid data', 400);
    req = createMockRequest({ path: '/api/test' });

    errorHandler(appError, req as Request, res as Response, next);

    expect(mockLogger.warn).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid data',
    });
  });

  it('should handle regular errors with 500 status', () => {
    const error = new Error('Something went wrong');
    req = createMockRequest({ method: 'POST', path: '/api/checklist' });

    errorHandler(error, req as Request, res as Response, next);

    expect(mockLogger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro interno do servidor. Tente novamente mais tarde.',
    });
  });

  it('should log error details properly', () => {
    const error = new Error('DB error');
    req = createMockRequest({ method: 'GET', path: '/api/list' });

    errorHandler(error, req as Request, res as Response, next);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'DB error',
      expect.objectContaining({ 
        stack: expect.any(String), 
        method: 'GET', 
        path: '/api/list' 
      })
    );
  });
}); 