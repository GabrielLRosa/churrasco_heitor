import { AppError } from "@core/errors/AppError";
import { API_ERROR_MESSAGES } from "@typings/constants";

interface QueryParams {
  [key: string]: string | boolean | undefined;
}

interface WhereOptions {
  [key: string]: string | boolean;
}

const BOOLEAN_FILTERS = ['tank_full', 'has_step', 'has_license'];

  export function buildSequelizeFilters(query: QueryParams, validFilters: string[]): WhereOptions {
    const where: WhereOptions = {};
  
    for (const key of validFilters) {
      const value = query[key];
      if (value === undefined) continue;

      if (typeof value === 'boolean') {
        where[key] = value;
      } else if (BOOLEAN_FILTERS.includes(key)) {
        if (value === 'true') {
          where[key] = true;
        } else if (value === 'false') {
          where[key] = false;
        } else {
          throw new AppError(API_ERROR_MESSAGES.INVALID_FILTER_VALUE(key).message, API_ERROR_MESSAGES.INVALID_FILTER_VALUE(key).statusCode);
        }
      } else if (typeof value === 'string') { 
        where[key] = value;
      } else {
        throw new AppError(API_ERROR_MESSAGES.INVALID_FILTER_VALUE(key).message, API_ERROR_MESSAGES.INVALID_FILTER_VALUE(key).statusCode);
      }
    }
  
    return where;
  }