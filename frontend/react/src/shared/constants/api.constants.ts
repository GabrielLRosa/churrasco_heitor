export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
  CHECKLIST: {
    CREATE: '/v1/checklists/create',
    LIST: '/v1/checklists',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;