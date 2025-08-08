import { AppError } from "@core/errors/AppError";
import { buildSequelizeFilters } from '../filters';

describe('buildSequelizeFilters', () => {

  it('should convert string booleans to actual booleans', () => {
    const query = { tank_full: 'true', has_step: 'false' };
    const validFilters = ['tank_full', 'has_step'];
    const result = buildSequelizeFilters(query, validFilters);
    
    expect(result).toEqual({ tank_full: true, has_step: false });
  });

  it('should keep other string values as they are', () => {
    const query = { some_filter: 'some_value' };
    const validFilters = ['some_filter'];
    const result = buildSequelizeFilters(query, validFilters);
    
    expect(result).toEqual({ some_filter: 'some_value' });
  });

  it('should ignore missing filters', () => {
    const query = { tank_full: 'true' };
    const validFilters = ['tank_full', 'has_license'];

    const result = buildSequelizeFilters(query, validFilters);
    expect(result).toEqual({ tank_full: true });
  });

  it('should throw error for invalid boolean values', () => {
    const query = { tank_full: 'not_boolean' };
    const validFilters = ['tank_full'];

    expect(() => buildSequelizeFilters(query, validFilters)).toThrow(AppError);
  });
}); 