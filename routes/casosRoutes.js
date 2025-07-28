// routes/casosRoutes.js
const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     description: >
 *       Retorna uma lista de casos policiais. É possível aplicar filtros por ID do agente, status do caso e palavras-chave no título ou descrição.
 *       A busca textual é case-insensitive e permite trechos parciais.
 *
 *     parameters:
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filtra os casos pelo ID do agente responsável.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, em andamento, solucionado]
 *         required: false
 *         description: Filtra os casos pelo status atual.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Termo de busca textual no título ou descrição do caso. A busca ignora diferenças entre maiúsculas e minúsculas.
 *           Exemplo: `?q=roubo` retorna todos os casos que contenham "roubo" no título ou na descrição.
 *
 *     responses:
 *       200:
 *         description: Lista de casos encontrados com base nos filtros aplicados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Parâmetros de consulta inválidos.
 */

router.get('/', casosController.getAllCasos);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso policial
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       201:
 *         description: Caso criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', casosController.createCaso);

/**
 * @swagger
 * /casos/search:
 *   get:
 *     summary: Busca casos por termo
 *     tags: [Casos]
 *     description: Retorna uma lista de casos cujo título ou descrição contenham o termo de busca.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo a ser buscado no título e na descrição dos casos.
 *     responses:
 *       200:
 *         description: Busca realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       400:
 *         description: O parâmetro de busca 'q' não foi fornecido.
 */
router.get('/search', casosController.searchCasos);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do caso.
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *         description: (Bônus) Se presente, retorna os dados do agente responsável pelo caso em vez do caso.
 *     responses:
 *       200:
 *         description: Detalhes do caso ou do agente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado.
 */
router.get('/:id', casosController.getCasoById);

/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Retorna o agente responsável por um caso
 *     tags: [Casos]
 *     description: Busca os dados completos do agente associado a um caso específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID (UUID) do caso.
 *     responses:
 *       200:
 *         description: Dados do agente retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso ou agente responsável não encontrado.
 */
router.get('/:id/agente', casosController.getAgenteDoCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso por completo
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       200:
 *         description: Caso atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Caso não encontrado.
 */
router.put('/:id', casosController.updateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza um caso parcialmente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, em andamento, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Caso atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado.
 */
router.patch('/:id', casosController.patchCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Caso removido com sucesso.
 *       404:
 *         description: Caso não encontrado.
 */
router.delete('/:id', casosController.deleteCaso);

module.exports = router;
