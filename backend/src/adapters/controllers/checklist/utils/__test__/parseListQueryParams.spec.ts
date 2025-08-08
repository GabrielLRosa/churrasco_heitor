import { parseListQueryParams } from '../parseListQueryParams';
import { AppError } from '@core/errors/AppError';
import * as filters from '../filters';

describe('parseListQueryParams', () => {
  let mockFilters: jest.SpyInstance;

  beforeEach(() => {
    mockFilters = jest.spyOn(filters, 'buildSequelizeFilters');
    mockFilters.mockReturnValue({}); 
  });

  afterEach(() => {
    mockFilters.mockRestore();
  });

  it('should parse query params correctly', () => {
    const query = { page: '2', limit: '5', has_license: 'true', sort: 'created_at,asc' };
    const result = parseListQueryParams(query);

    expect(result.limit).toBe(5);
    expect(result.offset).toBe(5);
    expect(result.order).toEqual([['created_at', 'ASC']]);
  });

  it('should throw error for invalid page number', () => {
    const query = { page: '0', limit: '10' };
    expect(() => parseListQueryParams(query)).toThrow(AppError);
  });

  it('should handle invalid page format', () => {
    const query = { page: 'abc', limit: '10' };
    expect(() => parseListQueryParams(query)).toThrow(AppError);
  });

  it('should throw error for wrong sort format', () => {
    const query = { sort: 'field,invalid_direction' };
    expect(() => parseListQueryParams(query)).toThrow(AppError);
  });
}); 