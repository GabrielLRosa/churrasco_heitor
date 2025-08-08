import type { IChecklistRepository } from '@core/entities';
import type { ChecklistListParams, ListCheckListResponse } from '@shared/types';

export class GetChecklistsService {
  private checklistRepository: IChecklistRepository;

  constructor(checklistRepository: IChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(params?: ChecklistListParams): Promise<ListCheckListResponse> {
    if (params?.page && params.page < 1) {
      throw new Error('Página deve ser maior que 0');
    }

    if (params?.limit && (params.limit < 1 || params.limit > 100)) {
      throw new Error('Limite deve estar entre 1 e 100');
    }

    return await this.checklistRepository.getAll(params);
  }
}