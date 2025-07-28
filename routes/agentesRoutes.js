const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Lista todos os agentes
 *     tags: [Agentes]
 *     description: >
 *       Retorna uma lista de agentes. É possível aplicar filtro por cargo e ordenação por nome ou data de incorporação.
 *       A ordenação aceita ordem crescente ou decrescente prefixando com `-`.
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtra os agentes por cargo (exato, case-insensitive).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: >
 *           Campo para ordenação dos resultados. Use o nome do campo para ordem crescente (`sort=nome`)
 *           ou prefixe com `-` para ordem decrescente (`sort=-dataDeIncorporacao`).  
 *           Campos suportados: `nome`, `dataDeIncorporacao`, `cargo`.
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 */

router.get('/', agentesController.getAllAgentes);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     description: Cadastra um novo agente no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgenteInput'
 *           example:
 *             nome: "Sérgio Oliveira"
 *             dataDeIncorporacao: "2021-09-15"
 *             cargo: "Detetive"
 *     responses:
 *       201:
 *         description: Agente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados fornecidos são inválidos.
 */
router.post('/', agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente específico
 *     tags: [Agentes]
 *     description: Busca e retorna os dados de um agente pelo seu ID (UUID).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID (UUID) do agente.
 *     responses:
 *       200:
 *         description: Detalhes do agente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado.
 */
router.get('/:id', agentesController.getAgenteById);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza um agente por completo (PUT)
 *     tags: [Agentes]
 *     description: Atualiza todos os dados de um agente existente. Requer que todos os campos sejam enviados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID (UUID) do agente a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgenteInput'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado.
 */
router.put('/:id', agentesController.updateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza um agente parcialmente (PATCH)
 *     tags: [Agentes]
 *     description: Atualiza um ou mais campos de um agente existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID (UUID) do agente a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado.
 */
router.patch('/:id', agentesController.patchAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agentes]
 *     description: Remove um agente do sistema pelo seu ID (UUID).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID (UUID) do agente a ser removido.
 *     responses:
 *       204:
 *         description: Agente removido com sucesso (sem conteúdo de resposta).
 *       404:
 *         description: Agente não encontrado.
 */
router.delete('/:id', agentesController.deleteAgente);

module.exports = router;
