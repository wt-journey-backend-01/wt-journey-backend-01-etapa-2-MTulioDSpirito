import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Polícia - Casos e Agentes',
      version: '1.0.0',
      description: 'API para gerenciamento de agentes e casos policiais',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        Agente: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            dataDeIncorporacao: { type: 'string', format: 'date' },
            cargo: { type: 'string' },
          },
          required: ['id', 'nome', 'dataDeIncorporacao', 'cargo'],
        },
        AgenteInput: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            dataDeIncorporacao: { type: 'string', format: 'date' },
            cargo: { type: 'string', enum: ['inspetor', 'delegado', 'outro'] },
          },
          required: ['nome', 'dataDeIncorporacao', 'cargo'],
        },
        Caso: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            status: { type: 'string', enum: ['aberto', 'solucionado'] },
            agente_id: { type: 'string', format: 'uuid' },
          },
          required: ['id', 'titulo', 'descricao', 'status', 'agente_id'],
        },
        CasoInput: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            status: { type: 'string', enum: ['aberto', 'solucionado'] },
            agente_id: { type: 'string', format: 'uuid' },
          },
          required: ['titulo', 'descricao', 'status', 'agente_id'],
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Parâmetros inválidos' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: { type: 'string' },
              },
              example: [
                { status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" },
              ],
            },
          },
        },
        Erro404: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 404 },
            message: { type: 'string', example: 'Recurso não encontrado' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
