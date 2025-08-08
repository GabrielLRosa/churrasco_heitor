import { buildSequelizeFilters } from './filters';
import { ChecklistQuery } from '@typings/checklist';
import { VALID_CHECKLIST_FILTERS, API_ERROR_MESSAGES } from '@typings/constants';
import { AppError } from '@core/errors/AppError';


interface ParsedListQueryParams {
  limit: number;
  where: any;
  order: Array<[string, string]>;
  offset: number;
}

export function parseListQueryParams(reqQuery: ChecklistQuery): ParsedListQueryParams {
  try {
    const { page: pageStr, limit: limitStr, sort, ...filterParams } = reqQuery;

    const page = parseInt(pageStr || '1');
    const limit = parseInt(limitStr || '10');

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      throw new AppError(API_ERROR_MESSAGES.INVALID_PAGINATION.message, API_ERROR_MESSAGES.INVALID_PAGINATION.statusCode);
    }

    const where = buildSequelizeFilters(filterParams, VALID_CHECKLIST_FILTERS);

    let order: Array<[string, string]> = [['created_at', 'DESC']];
    if (sort) {
      const [field, direction] = sort.split(',');
      if (!field || !direction || !['asc', 'desc'].includes(direction.toLowerCase())) {
        throw new AppError(API_ERROR_MESSAGES.INVALID_SORTING.message, API_ERROR_MESSAGES.INVALID_SORTING.statusCode);
      }
      order = [[field, direction.toUpperCase()]];
    }

    const offset = (page - 1) * limit;

    return {
      limit,
      where,
      order,
      offset,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(API_ERROR_MESSAGES.INVALID_PARAMETERS.message, API_ERROR_MESSAGES.INVALID_PARAMETERS.statusCode); // Erro genérico para outros casos
    }
  }
} 