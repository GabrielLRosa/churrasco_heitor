export type {
  ChecklistAttributes,
  ChecklistCreationAttributes,
  ChecklistResponse,
  CreateChecklistRequest,
  ChecklistRepository
} from '@shared/types';

import type {ChecklistAttributes as Checklist, ChecklistListParams, CreateChecklistRequest, ListCheckListResponse, ChecklistRepository } from '@shared/types';


export function isComplete(checklist: Checklist): boolean {
  return checklist.tank_full && checklist.has_step && checklist.has_license;
}

export function getCompletionPercentage(checklist: Checklist): number {
  const items = [checklist.tank_full, checklist.has_step, checklist.has_license];
  const completedItems = items.filter(Boolean).length;
  return Math.round((completedItems / items.length) * 100);
}

export interface IChecklistRepository extends ChecklistRepository {
  create(data: CreateChecklistRequest): Promise<Checklist>;
  getAll(params?: ChecklistListParams): Promise<ListCheckListResponse>;
}
