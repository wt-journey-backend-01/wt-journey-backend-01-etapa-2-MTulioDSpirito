import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import agentesRoutes from './routes/agentesRoutes.js';
import casosRoutes from './routes/casosRoutes.js';
import swaggerSpec from './docs/swagger.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());

// Rotas
app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de erro
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
