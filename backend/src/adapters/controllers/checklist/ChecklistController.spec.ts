import { Request, Response } from 'express';
import { createMockRequest, createMockResponse, createMockChecklistData, createMockChecklistAttributes, createMockChecklistsList } from '@test-utils/mocks';

const mockPost = jest.fn();
const mockGet = jest.fn();

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: mockPost,
    get: mockGet,
  })),
}));

const mockCreateService = { execute: jest.fn() };
const mockListService = { execute: jest.fn() };

jest.mock('@core/services/checklist/CreateChecklist', () => ({
  CreateChecklist: jest.fn().mockImplementation(() => mockCreateService),
}));

jest.mock('@core/services/checklist/ListChecklist', () => ({
  ListChecklists: jest.fn().mockImplementation(() => mockListService),
}));

jest.mock('@adapters/repositories/checklist/ChecklistRepository');

const mockValidate = jest.fn();
const mockParse = jest.fn();

jest.mock('@adapters/controllers/checklist/utils/validateChecklistBody', () => ({
  validateChecklistBody: mockValidate,
}));

jest.mock('@adapters/controllers/checklist/utils/parseListQueryParams', () => ({
  parseListQueryParams: mockParse,
}));

describe('ChecklistController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('POST create', () => {
    beforeEach(() => {
      jest.resetModules();
      require('@adapters/controllers/checklist/ChecklistController');
    });

    it('should create new checklist successfully', async () => {
      const data = createMockChecklistData();
      const created = createMockChecklistAttributes();

      req.body = data;
      mockValidate.mockReturnValue(data);
      mockCreateService.execute.mockResolvedValue(created);

      const handler = mockPost.mock.calls.find(call => call[0] === '/create')?.[1];
      await handler(req as Request, res as Response);

      expect(mockValidate).toHaveBeenCalledWith(data);
      expect(mockCreateService.execute).toHaveBeenCalledWith(data);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('should handle validation error', async () => {
      const data = { tank_full: 'invalid' };
      const error = new Error('validation failed');

      req.body = data;
      mockValidate.mockImplementation(() => { throw error; });

      const handler = mockPost.mock.calls.find(call => call[0] === '/create')?.[1];
      
      await expect(handler(req as Request, res as Response)).rejects.toThrow(error);
      expect(mockCreateService.execute).not.toHaveBeenCalled();
    });
  });

  describe('GET list', () => {
    beforeEach(() => {
      jest.resetModules();
      require('@adapters/controllers/checklist/ChecklistController');
    });

    it('should return checklist list', async () => {
      const query = { page: '1', limit: '10' };
      const parsed = { limit: 10, where: {}, order: [], offset: 0 };
      const mockData = createMockChecklistsList();
      const result = { checklists: mockData, totalCount: 2 };

      req.query = query;
      mockParse.mockReturnValue(parsed);
      mockListService.execute.mockResolvedValue(result);

      const handler = mockGet.mock.calls.find(call => call[0] === '/')?.[1];
      await handler(req as Request, res as Response);

      expect(mockParse).toHaveBeenCalledWith(query);
      expect(mockListService.execute).toHaveBeenCalledWith(parsed.where, parsed.order, parsed.limit, parsed.offset);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should handle parse errors', async () => {
      const query = { page: 'invalid' };
      const error = new Error('invalid page');

      req.query = query;
      mockParse.mockImplementation(() => { throw error; });

      const handler = mockGet.mock.calls.find(call => call[0] === '/')?.[1];
      
      await expect(handler(req as Request, res as Response)).rejects.toThrow(error);
      expect(mockListService.execute).not.toHaveBeenCalled();
    });
  });
}); 