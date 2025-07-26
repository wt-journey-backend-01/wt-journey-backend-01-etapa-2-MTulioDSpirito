const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi');

// Schema para criação/atualização completa (PUT)
const agenteSchema = joi.object({
  nome: joi.string().min(3).required().messages({
    'string.min': 'O campo nome deve ter no mínimo 3 caracteres.',
    'any.required': 'O campo nome é obrigatório.'
  }),
  dataDeIncorporacao: joi.date().iso().required().messages({
    'date.format': 'Data de incorporação deve estar no formato YYYY-MM-DD.',
    'any.required': 'O campo dataDeIncorporacao é obrigatório.'
  }),
  cargo: joi.string().required().messages({
    'any.required': 'O campo cargo é obrigatório.'
  })
});

// CORREÇÃO 1: Schema para atualização parcial (PATCH)
// Nenhum campo é obrigatório, mas pelo menos um deve ser enviado.
const agentePatchSchema = joi.object({
  nome: joi.string().min(3).messages({
    'string.min': 'O campo nome deve ter no mínimo 3 caracteres.'
  }),
  dataDeIncorporacao: joi.date().iso().messages({
    'date.format': 'Data de incorporação deve estar no formato YYYY-MM-DD.'
  }),
  cargo: joi.string()
}).min(1).messages({ // Garante que o corpo da requisição não esteja vazio
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização.'
});

const getAllAgentes = (req, res) => {
  let results = agentesRepository.findAll();
  const { cargo, sort } = req.query;

  if (cargo) {
    results = results.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
  }

  // CORREÇÃO 5: Lógica de ordenação aprimorada para datas
  if (sort) {
    const desc = sort.startsWith('-');
    const field = desc ? sort.substring(1) : sort;
    results.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      if (field === 'dataDeIncorporacao') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return desc ? 1 : -1;
      if (aValue > bValue) return desc ? -1 : 1;
      return 0;
    });
  }
  res.status(200).json(results);
};

const getAgenteById = (req, res) => {
  const { id } = req.params;
  const agente = agentesRepository.findById(id);
  if (!agente) {
    return res.status(404).json({ message: 'Agente não encontrado' });
  }
  res.status(200).json(agente);
};

const createAgente = (req, res) => {
  const { error, value } = agenteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }
  const newAgente = agentesRepository.create(value);
  res.status(201).json(newAgente);
};

const updateAgente = (req, res) => {
  const { id } = req.params;
  const { error, value } = agenteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }
  const updatedAgente = agentesRepository.update(id, value);
  if (!updatedAgente) {
    return res.status(404).json({ message: 'Agente não encontrado' });
  }
  res.status(200).json(updatedAgente);
};

const patchAgente = (req, res) => {
  const { id } = req.params;
  // CORREÇÃO 1: Usando o schema de PATCH para validar
  const { error, value } = agentePatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  const updatedAgente = agentesRepository.update(id, value);
  if (!updatedAgente) {
    return res.status(404).json({ message: 'Agente não encontrado' });
  }
  res.status(200).json(updatedAgente);
};

const deleteAgente = (req, res) => {
  const { id } = req.params;
  const deleted = agentesRepository.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Agente não encontrado' });
  }
  res.status(204).send();
};

module.exports = {
  getAllAgentes,
  getAgenteById,
  createAgente,
  updateAgente,
  patchAgente,
  deleteAgente
};