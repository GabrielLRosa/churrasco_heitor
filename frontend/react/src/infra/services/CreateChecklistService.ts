import type { ChecklistAttributes as Checklist, IChecklistRepository } from '@core/entities';
import type { CreateChecklistRequest } from '@shared/types';

export class CreateChecklistService {
  private checklistRepository: IChecklistRepository;

  constructor(checklistRepository: IChecklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(data: CreateChecklistRequest): Promise<Checklist> {
    if (typeof data.tank_full !== 'boolean' || 
        typeof data.has_step !== 'boolean' || 
        typeof data.has_license !== 'boolean') {
      throw new Error('Todos os campos são obrigatórios e devem ser do tipo boolean');
    }

    return await this.checklistRepository.create(data);
  }
}