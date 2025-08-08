import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Checklist',
    version: '1.0.0',
    description: 'Documentação completa da API de Checklist',
  },
  servers: [
    {
        url: 'http://localhost:8081/v1',
        description: 'Servidor de Desenvolvimento',
    },
  ],
  paths: {
    '/checklist/create': {
      post: {
        summary: 'Cria um novo checklist',
        description: 'Endpoint para criação de um novo checklist com validação centralizada dos dados de entrada.',
        tags: ['Checklist'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateChecklistRequest'
              },
              examples: {
                'exemplo-completo': {
                  summary: 'Checklist completo',
                  value: {
                    tank_full: true,
                    has_step: false,
                    has_license: true
                  }
                },
                'exemplo-vazio': {
                  summary: 'Checklist vazio',
                  value: {
                    tank_full: false,
                    has_step: false,
                    has_license: false
                  }
                }
              }
            },
          },
        },
        responses: {
          201: {
            description: 'Checklist criado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChecklistResponse'
                },
                example: {
                  id: "550e8400-e29b-41d4-a716-446655440000",
                  tank_full: true,
                  has_step: false,
                  has_license: true,
                  created_at: "2024-01-15T10:30:00.000Z"
                }
              },
            },
          },
          400: {
            description: 'Dados inválidos na requisição.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                examples: {
                  'campo-obrigatorio': {
                    summary: 'Campo obrigatório faltando',
                    value: {
                      error: "O campo 'tank_full' é obrigatório e deve ser um valor booleano."
                    }
                  },
                  'tipo-incorreto': {
                    summary: 'Tipo de dado incorreto',
                    value: {
                      error: "O campo 'has_step' deve ser um valor booleano."
                    }
                  }
                }
              },
            },
          },
          500: {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                  error: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
                }
              },
            },
          },
        },
      },
    },
    '/checklist': {
      get: {
        summary: 'Lista checklists com filtros, paginação e ordenação',
        description: 'Endpoint para listagem de checklists com suporte a filtros dinâmicos, paginação e ordenação customizável.',
        tags: ['Checklist'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número da página (mínimo: 1)',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            example: 1
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Número de itens por página (mínimo: 1, máximo: 100)',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            example: 10
          },
          {
            name: 'tank_full',
            in: 'query',
            description: 'Filtro por status do tanque',
            required: false,
            schema: {
              type: 'string',
              enum: ['true', 'false'],
            },
            example: 'true'
          },
          {
            name: 'has_step',
            in: 'query',
            description: 'Filtro por presença de degrau',
            required: false,
            schema: {
              type: 'string',
              enum: ['true', 'false'],
            },
            example: 'false'
          },
          {
            name: 'has_license',
            in: 'query',
            description: 'Filtro por status da licença',
            required: false,
            schema: {
              type: 'string',
              enum: ['true', 'false'],
            },
            example: 'true'
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Campo e ordem de ordenação (formato: campo,ordem)',
            required: false,
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z_]+,(asc|desc)$',
              default: 'created_at,desc',
            },
            examples: {
              'data-desc': {
                summary: 'Ordenar por data (mais recente primeiro)',
                value: 'created_at,desc'
              },
              'data-asc': {
                summary: 'Ordenar por data (mais antigo primeiro)',
                value: 'created_at,asc'
              }
            }
          },
        ],
        responses: {
          200: {
            description: 'Lista de checklists retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ListCheckListResponse'
                },
                examples: {
                  'lista-completa': {
                    summary: 'Lista com múltiplos checklists',
                    value: {
                      checklists: [
                        {
                          id: "550e8400-e29b-41d4-a716-446655440000",
                          tank_full: true,
                          has_step: false,
                          has_license: true,
                          created_at: "2024-01-15T10:30:00.000Z"
                        },
                        {
                          id: "550e8400-e29b-41d4-a716-446655440001",
                          tank_full: false,
                          has_step: true,
                          has_license: false,
                          created_at: "2024-01-15T09:15:00.000Z"
                        }
                      ],
                      totalCount: 2
                    }
                  },
                  'lista-vazia': {
                    summary: 'Lista vazia',
                    value: {
                      checklists: [],
                      totalCount: 0
                    }
                  }
                }
              },
            },
          },
          400: {
            description: 'Parâmetros inválidos na requisição.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                examples: {
                  'paginacao-invalida': {
                    summary: 'Parâmetros de paginação inválidos',
                    value: {
                      error: "Parâmetros de paginação inválidos. Page e limit devem ser números maiores que 0."
                    }
                  },
                  'filtro-invalido': {
                    summary: 'Valor de filtro inválido',
                    value: {
                      error: "Valor inválido para o filtro 'tank_full'. Use 'true' ou 'false'."
                    }
                  }
                }
              },
            },
          },
          500: {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                  error: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
                }
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateChecklistRequest: {
        type: 'object',
        required: ['tank_full', 'has_step', 'has_license'],
        properties: {
          tank_full: {
            type: 'boolean',
            description: 'Indica se o tanque está cheio.',
            example: true
          },
          has_step: {
            type: 'boolean',
            description: 'Indica se possui degrau de acesso.',
            example: false
          },
          has_license: {
            type: 'boolean',
            description: 'Indica se possui licença válida.',
            example: true
          },
        },
        additionalProperties: false
      },
      ChecklistResponse: {
        type: 'object',
        required: ['id', 'tank_full', 'has_step', 'has_license', 'created_at'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único do checklist.',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          tank_full: {
            type: 'boolean',
            description: 'Status do tanque.',
            example: true
          },
          has_step: {
            type: 'boolean',
            description: 'Presença de degrau.',
            example: false
          },
          has_license: {
            type: 'boolean',
            description: 'Status da licença.',
            example: true
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data e hora de criação do checklist.',
            example: '2024-01-15T10:30:00.000Z'
          },
        },
      },
      ListCheckListResponse: {
        type: 'object',
        required: ['checklists', 'totalCount'],
        properties: {
          checklists: {
            type: 'array',
            description: 'Lista de checklists na página atual.',
            items: {
              $ref: '#/components/schemas/ChecklistResponse'
            },
          },
          totalCount: {
            type: 'integer',
            minimum: 0,
            description: 'Total de checklists que atendem aos critérios de filtro.',
            example: 25
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem de erro descritiva.',
            example: 'Ocorreu um erro na validação dos dados.'
          },
        },
      },
    },
  },
};

const options: Options = {
  swaggerDefinition,
  apis: [], // APIs definidas diretamente no objeto swaggerDefinition
};

export const swaggerSpecs = swaggerJsdoc(options);