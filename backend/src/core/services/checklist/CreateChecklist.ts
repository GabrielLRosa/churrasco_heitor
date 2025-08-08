import { ChecklistAttributes, ChecklistRepository } from '@core/entities/checklist/Checklist';

export class CreateChecklist {
  constructor(private readonly checklistRepo: ChecklistRepository) {}

  async execute(checklistData: Omit<ChecklistAttributes, 'id' | 'created_at'>): Promise<ChecklistAttributes> {
    return this.checklistRepo.create(checklistData);
  }
}