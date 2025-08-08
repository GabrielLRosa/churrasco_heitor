import { validateChecklistBody } from '../validateChecklistBody';
import { AppError } from '@core/errors/AppError';

describe('validateChecklistBody', () => {
  it('should return valid body when all fields are correct', () => {
    const body = {
      tank_full: true,
      has_step: false,
      has_license: true,
    };
    
    expect(validateChecklistBody(body)).toEqual(body);
  });

  it('should throw error if tank_full is not boolean', () => {
    const body = {
      tank_full: 'true' as any,
      has_step: false,
      has_license: true,
    };
    
    expect(() => validateChecklistBody(body)).toThrow(AppError);
  });

  it('should throw error if has_step is wrong type', () => {
    const body = {
      tank_full: true,
      has_step: 123 as any,
      has_license: true,
    };
    
    expect(() => validateChecklistBody(body)).toThrow(AppError);
  });

  it('should throw error when has_license is not boolean', () => {
    const body = {
      tank_full: true,
      has_step: false,
      has_license: 'false' as any,
    };
    
    expect(() => validateChecklistBody(body)).toThrow(AppError);
  });

  it('should throw error when field is missing', () => {
    const body = {
      tank_full: true,
      has_step: false,
    } as any;
    
    expect(() => validateChecklistBody(body)).toThrow(AppError);
  });


  it('should handle wrong values', () => {
    const body = {
      tank_full: true,
      has_step: undefined,
      has_license: true,
    };
    
    expect(() => validateChecklistBody(body)).toThrow(AppError);
  });
}); 