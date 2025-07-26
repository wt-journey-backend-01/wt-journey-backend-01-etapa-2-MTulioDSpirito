const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { /* ... */ },
    servers: [ /* ... */ ],
    components: {
        schemas: {
            Agente: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer', // ALTERADO
                        description: 'ID numérico único do agente.'
                    },
                    nome: { type: 'string' },
                    dataDeIncorporacao: { type: 'string', format: 'date' },
                    cargo: { type: 'string' }
                }
            },
            AgenteInput: { /* ... */ },
            Caso: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer', // ALTERADO
                        description: 'ID numérico único do caso.'
                    },
                    titulo: { type: 'string' },
                    descricao: { type: 'string' },
                    status: { type: 'string', enum: ['aberto', 'solucionado'] },
                    agente_id: {
                        type: 'integer', // ALTERADO
                        description: 'ID numérico do agente responsável.'
                    }
                }
            },
            CasoInput: {
                type: 'object',
                required: ['titulo', 'descricao', 'status', 'agente_id'],
                properties: {
                     titulo: { type: 'string' },
                    descricao: { type: 'string' },
                    status: { type: 'string', enum: ['aberto', 'solucionado'] },
                    agente_id: {
                        type: 'integer', // ALTERADO
                    }
                }
            }
        }
    },
    tags: [ /* ... */ ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;