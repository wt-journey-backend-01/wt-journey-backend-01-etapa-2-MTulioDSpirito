const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger.js'); // Importa a config do Swagger

const agentesRouter = require('./routes/agentesRoutes');
const casosRouter = require('./routes/casosRoutes');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.send('<h1>API do Departamento de Polícia</h1><p>Acesse <a href="/docs">/docs</a> para a documentação da API.</p>');
});


// Rota para a documentação da API gerada pelo Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Registra as rotas da aplicação
app.use(agentesRouter);
app.use(casosRouter);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});