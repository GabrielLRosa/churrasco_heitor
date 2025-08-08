import { ChecklistAttributes, ChecklistRepository, ListCheckListParams } from '@core/entities/checklist/Checklist';
import { ChecklistModel } from './ChecklistModel';
import { cache } from '@infra/cache/CacheService';
import logger from '@config/logger';

export class SequelizeChecklistRepository implements ChecklistRepository {

  async create(checklistData: ChecklistAttributes): Promise<ChecklistAttributes> {
    const newChecklist = await ChecklistModel.create(checklistData);
    
    try {
      await cache.clear();
    } catch (error) {
      logger.error('Failed to clear cache:', error);
    }
    
    return newChecklist.toJSON();
  }

  async getAll(params: ListCheckListParams) {
    const {where, order, limit, offset} = params
    
    const cacheKey = `checklist_list_${JSON.stringify(where)}_${JSON.stringify(order)}_${limit}_${offset}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached
    }
    
    const { rows, count } = await ChecklistModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(count / limit);

    const result = {
      data: rows.map(row => row.toJSON()),
      totalCount: count,
      pagination: {
        page: currentPage,
        totalPages: totalPages
      }
    };
    
    await cache.set(cacheKey, result, 300);
    
    return result;
  }
}