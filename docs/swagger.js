const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Departamento de Polícia',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de casos e agentes policiais.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Agentes',
        description: 'Operações relacionadas aos agentes policiais.',
      },
      {
        name: 'Casos',
        description: 'Operações relacionadas aos casos investigativos.',
      },
    ],
    components: {
      schemas: {
        Agente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do agente.',
            },
            nome: {
              type: 'string',
              description: 'Nome do agente.',
            },
            dataDeIncorporacao: {
              type: 'string',
              format: 'date',
              description: 'Data de entrada (YYYY-MM-DD).',
            },
            cargo: {
              type: 'string',
              description: 'Cargo do agente.',
            },
          },
        },
        AgenteInput: {
          type: 'object',
          required: ['nome', 'dataDeIncorporacao', 'cargo'],
          properties: {
            nome: {
              type: 'string',
              example: 'Sérgio Oliveira',
            },
            dataDeIncorporacao: {
              type: 'string',
              format: 'date',
              example: '2021-09-15',
            },
            cargo: {
              type: 'string',
              example: 'Detetive',
            },
          },
        },
        Caso: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do caso.',
            },
            titulo: {
              type: 'string',
            },
            descricao: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['aberto', 'em andamento', 'solucionado'],
            },
            agente_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do agente responsável.',
            },
          },
        },
        CasoInput: {
          type: 'object',
          required: ['titulo', 'descricao', 'status', 'agente_id'],
          properties: {
            titulo: {
              type: 'string',
              example: 'Investigação de Fraude',
            },
            descricao: {
              type: 'string',
              example: 'Vítima reportou transações suspeitas.',
            },
            status: {
              type: 'string',
              enum: ['aberto', 'em andamento', 'solucionado'],
              example: 'aberto',
            },
            agente_id: {
              type: 'string',
              format: 'uuid',
              example: 'c4a3b2e1-d5f6-4a7b-8c9d-0e1f2a3b4c5d',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;