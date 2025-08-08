import type { ChecklistAttributes as Checklist, IChecklistRepository } from '../core/entities';
import type { ChecklistListParams, ListCheckListResponse, CreateChecklistRequest } from '../shared/types';
import { checklistClient } from '../infra/api';
import { API_ENDPOINTS } from '../shared/constants';

export class ChecklistRepository implements IChecklistRepository {

  async create(data: CreateChecklistRequest): Promise<Checklist> {
    try {
      const response = await checklistClient.post<Checklist>(API_ENDPOINTS.CHECKLIST.CREATE, data);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao criar checklist: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async getAll(params?: ChecklistListParams): Promise<ListCheckListResponse> {
    try {
      const response = await checklistClient.get<{
        data: Checklist[];
        totalCount: number;
        pagination: { page: number; totalPages: number | null };
      }>(API_ENDPOINTS.CHECKLIST.LIST, {
        params: {
          page: params?.page,
          limit: params?.limit,
          tank_full: params?.tank_full,
          has_step: params?.has_step,
          has_license: params?.has_license,
          sort: params?.sort,
        }
      });
      
      const result = {
        data: response.data.data,
        totalCount: response.data.totalCount,
        pagination: {
          page: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages || 1,
        }
      };
      
      return result;
    } catch (error) {
      throw new Error(`Falha ao buscar checklists: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}