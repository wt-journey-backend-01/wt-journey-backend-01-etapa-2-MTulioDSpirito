const Joi = require('joi');
const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

const casoSchema = Joi.object({
  titulo: Joi.string().required().messages({ 'any.required': 'O campo título é obrigatório.' }),
  descricao: Joi.string().required().messages({ 'any.required': 'O campo descrição é obrigatório.' }),
  status: Joi.string().valid('aberto', 'em andamento', 'solucionado').required().messages({
    'any.only': 'Status deve ser um dos seguintes: aberto, em andamento, solucionado',
    'any.required': 'O campo status é obrigatório.'
  }),
  agente_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'O agente_id deve ser um UUID válido.',
    'any.required': 'O campo agente_id é obrigatório.'
  })
});

// CORREÇÃO 1: Schema para atualização parcial (PATCH) de casos
const casoPatchSchema = Joi.object({
  titulo: Joi.string(),
  descricao: Joi.string(),
  status: Joi.string().valid('aberto', 'em andamento', 'solucionado').messages({
    'any.only': 'Status deve ser um dos seguintes: aberto, em andamento, solucionado'
  }),
  agente_id: Joi.string().guid({ version: 'uuidv4' }).messages({
    'string.guid': 'O agente_id deve ser um UUID válido.'
  })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização.'
});

const getAllCasos = (req, res) => {
  let results = casosRepository.findAll();
  const { q, status, agente_id } = req.query;

  // CORREÇÃO 2: Implementando os filtros que faltavam
  if (status) {
    results = results.filter(caso => caso.status === status);
  }
  if (agente_id) {
    results = results.filter(caso => caso.agente_id === agente_id);
  }
  if (q) {
    const queryLower = q.toLowerCase();
    results = results.filter(caso =>
      caso.titulo.toLowerCase().includes(queryLower) ||
      caso.descricao.toLowerCase().includes(queryLower)
    );
  }
  res.status(200).json(results);
};

const getCasoById = (req, res) => { /* ... seu código aqui está ok ... */ };

const createCaso = (req, res) => {
  const { error, value } = casoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  // CORREÇÃO: Alterando o status para 404
  if (!agentesRepository.findById(value.agente_id)) {
    return res.status(404).json({ message: 'Agente não encontrado para o agente_id fornecido.' });
  }

  const newCaso = casosRepository.create(value);
  res.status(201).json(newCaso);
};

const updateCaso = (req, res) => {
  const { id } = req.params;
  const { error, value } = casoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  // CORREÇÃO: Alterando o status para 404 também aqui
  if (value.agente_id && !agentesRepository.findById(value.agente_id)) {
      return res.status(404).json({ message: 'Agente não encontrado para o agente_id fornecido.' });
  }
  
  const updatedCaso = casosRepository.update(id, value);
  if (!updatedCaso) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }
  res.status(200).json(updatedCaso);
};

const patchCaso = (req, res) => {
  const { id } = req.params;
  // CORREÇÃO 1: Usando o schema de PATCH para validar
  const { error, value } = casoPatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  // Valida se o agente_id, caso fornecido, existe
  if (value.agente_id && !agentesRepository.findById(value.agente_id)) {
    return res.status(404).json({ message: 'Agente não encontrado para o agente_id fornecido.' });
  }

  const updatedCaso = casosRepository.update(id, value);
  if (!updatedCaso) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }
  res.status(200).json(updatedCaso);
};

const deleteCaso = (req, res) => { /* ... seu código aqui está ok ... */ };
const getAgenteDoCaso = (req, res) => { /* ... seu código aqui está ok ... */ };
// ... (copie as funções que não foram alteradas)

module.exports = {
  getAllCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
  getAgenteDoCaso
};