/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { 
  ChecklistAttributes as Checklist, 
  CreateChecklistRequest, 
  ChecklistListParams 
} from '@shared/types';
import type { IChecklistRepository } from '@core/entities';
import { CreateChecklistService, GetChecklistsService } from '@infra/services';
import { ChecklistRepository } from '@repositories/ChecklistRepository';

interface ChecklistState {
  checklists: Checklist[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
  } | null;
  activeFilters: ChecklistListParams | null;
}

interface ChecklistActions {
  createChecklist: (data: CreateChecklistRequest) => Promise<void>;
  getChecklists: (params?: ChecklistListParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

interface ChecklistContextType extends ChecklistState, ChecklistActions {
  hasMore: boolean;
  loadingMore: boolean;
}

interface ChecklistProviderProps {
  children: ReactNode;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

const checklistRepository: IChecklistRepository = new ChecklistRepository();
const createChecklistService = new CreateChecklistService(checklistRepository);
const getChecklistsService = new GetChecklistsService(checklistRepository);

export const ChecklistProvider: React.FC<ChecklistProviderProps> = ({ children }) => {
  const [state, setState] = useState<ChecklistState>({
    checklists: [],
    loading: false,
    creating: false,
    error: null,
    pagination: null,
    activeFilters: null
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const createChecklist = useCallback(async (data: CreateChecklistRequest) => {
    setState(prev => ({ ...prev, creating: true, error: null }));
    
    try {
      const newChecklist = await createChecklistService.execute(data);
      setState(prev => ({
        ...prev,
        checklists: [newChecklist, ...prev.checklists],
        creating: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        creating: false,
        error: error instanceof Error ? error.message : 'Erro ao criar checklist',
      }));
      throw error;
    }
  }, []);

  const getChecklists = useCallback(async (params?: ChecklistListParams) => {
    setState(prev => ({ ...prev, loading: true, error: null, activeFilters: params ?? null }));

    try {
      const response = await getChecklistsService.execute(params);
      setState(prev => ({
        ...prev,
        checklists: response.data,
        pagination: response.pagination,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar checklists',
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!state.pagination || state.loading) return;
    
    const nextPage = state.pagination.page + 1;
    if (nextPage > state.pagination.totalPages) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await getChecklistsService.execute({
        ...state.activeFilters,
        page: nextPage,
      });
      
      setState(prev => ({
        ...prev,
        checklists: [...prev.checklists, ...response.data],
        pagination: response.pagination,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar mais checklists',
      }));
    }
  }, [state.pagination, state.loading, state.activeFilters]);

  const refresh = useCallback(async () => {
   if (state.activeFilters) await getChecklists(state.activeFilters);
  }, [getChecklists, state.activeFilters]);

  const hasMore = state.pagination 
    ? state.pagination.page < state.pagination.totalPages 
    : false;

  const loadingMore = state.loading && state.checklists.length > 0;

  const value: ChecklistContextType = {
    ...state,
    createChecklist,
    getChecklists,
    loadMore,
    refresh,
    clearError,
    hasMore,
    loadingMore,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklistContext = (): ChecklistContextType => {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklistContext must be used within a ChecklistProvider');
  }
  return context;
};