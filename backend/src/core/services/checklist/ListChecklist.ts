import { ChecklistAttributes, ChecklistRepository } from '@core/entities/checklist/Checklist';
import { ListCheckListResponse } from '../../../../../shared/types';

export class ListChecklists {
  constructor(private readonly checklistRepo: ChecklistRepository) {}

  async execute(where: any, order: Array<[string, string]>, limit: number, offset: number): Promise<ListCheckListResponse> {
    return this.checklistRepo.getAll({where, order, limit, offset});
  }
}