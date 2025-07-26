const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger.js');

const agentesRouter = require('./routes/agentesRoutes');
const casosRouter = require('./routes/casosRoutes');

const app = express();

const PORT = 3000;

app.use(express.json());

//Principal
app.get('/', (req, res) => {
  res.send('<h1>Bem-vindo à API do Departamento de Polícia!</h1><p>Acesse <a href="/docs">Docs</a> para o API. </p>');
});


//Api Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});
            