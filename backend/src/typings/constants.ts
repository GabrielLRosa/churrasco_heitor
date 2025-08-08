export const VALID_CHECKLIST_FILTERS = ['has_license', 'tank_full', 'has_step'];

export const API_ERROR_MESSAGES = {
  INVALID_PARAMETERS: { message: 'Parâmetros inválidos fornecidos.', statusCode: 400 },
  INVALID_PAGINATION: { message: 'Parâmetros de paginação inválidos. Page e Limit devem ser números positivos.', statusCode: 400 },
  INVALID_SORTING: { message: 'Parâmetro de ordenação inválido. Use formato \'campo,direcao\' (ex: \'id,asc\').', statusCode: 400 },
  MISSING_OR_INVALID_FIELD: (field: string) => ({ message: `O campo ${field} não está preenchido ou é inválido.`, statusCode: 400 }),
  INTERNAL_SERVER_ERROR: { message: 'Erro interno do servidor. Tente novamente mais tarde.', statusCode: 500 },
  DATABASE_CONNECTION_FAILED: { message: 'Falha na conexão com o banco de dados.', statusCode: 500 },
  INVALID_FILTER_VALUE: (key: string) => ({ message: `Valor inválido para o filtro '${key}'. Esperado: 'true' ou 'false'.`, statusCode: 400 }),
}; 