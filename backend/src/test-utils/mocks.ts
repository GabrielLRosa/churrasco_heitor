import { Request, Response } from 'express';
import { ChecklistAttributes } from '@core/entities/checklist/Checklist';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  method: 'GET',
  path: '/test',
  ...overrides,
});

export const createMockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
});

export const createMockChecklistData = (): Omit<ChecklistAttributes, 'id' | 'created_at'> => ({
  tank_full: true,
  has_step: false,
  has_license: true,
});

export const createMockChecklistAttributes = (): ChecklistAttributes => ({
  id: 'test-uuid-123',
  tank_full: true,
  has_step: false,
  has_license: true,
  created_at: new Date('2024-01-01T00:00:00.000Z'),
});

export const createMockChecklistsList = (): ChecklistAttributes[] => [
  {
    id: 'uuid-1',
    tank_full: true,
    has_step: false,
    has_license: true,
    created_at: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 'uuid-2',
    tank_full: false,
    has_step: true,
    has_license: false,
    created_at: new Date('2024-01-02T00:00:00.000Z'),
  },
];

export const createMockSequelizeModel = () => ({
  create: jest.fn(),
  findAndCountAll: jest.fn(),
  toJSON: jest.fn(),
});

export const createMockLogger = () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
});

export const createMockNextFunction = () => jest.fn(); 