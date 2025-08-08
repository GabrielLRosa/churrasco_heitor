// Como esse projeto é um monorepo, preferi por manter as tipagens comuns
// ao backend e frontend em um único arquivo.
// Porém tanto o backend quanto o frontend, importam, e exportam esses tipos.
// Para uma eventual refatoração, onde deixaria de ser um monorepo.

// ===== CORE ENTITIES =====

export interface ChecklistAttributes {
  id: string;
  tank_full: boolean;
  has_step: boolean;
  has_license: boolean;
  created_at: Date;
}

export interface ChecklistCreationAttributes extends Omit<ChecklistAttributes, 'id' | 'created_at'> {}

// ===== API CONTRACTS =====

export interface ChecklistQuery {
  page?: string;
  limit?: string;
  sort?: string;
  has_license?: string;
  tank_full?: string;
  has_step?: string;
  [key: string]: string | undefined;
}

// ===== RESPONSE TYPES =====

//Se necessário enviar alguma informação adicional para o frontend
export interface ChecklistResponse extends ChecklistAttributes {}

export interface CreateChecklistRequest {
  tank_full: boolean;
  has_step: boolean;
  has_license: boolean;
}

export interface ChecklistListParams {
  page?: number;
  limit?: number;
  tank_full?: boolean;
  has_step?: boolean;
  has_license?: boolean;
  sort?: string;
}

export interface ListCheckListParams {
  where: {
    [key: string]: string;
  }, 
  order: [string, string][], 
  limit: number, 
  offset: number
}

export interface ListCheckListResponse {
  data: ChecklistResponse[];
  totalCount: number;
  pagination: {
    page: number;
    totalPages: number;
  };
}

// ===== GENERIC API TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// ===== REPOSITORY INTERFACES =====

export interface ChecklistRepository {
  create(checklist: ChecklistCreationAttributes): Promise<ChecklistAttributes>;
  getAll(params: ListCheckListParams): Promise<ListCheckListResponse>;
}