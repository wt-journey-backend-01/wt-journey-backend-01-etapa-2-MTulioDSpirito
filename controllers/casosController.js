const Joi = require('joi');
const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

// CORREÇÃO 2: Adicionando mais mensagens customizadas
const casoSchema = Joi.object({
  titulo: Joi.string().required().messages({
    'string.empty': 'O campo título não pode ser vazio.',
    'any.required': 'O campo título é obrigatório.'
  }),
  descricao: Joi.string().required().messages({
    'string.empty': 'O campo descrição não pode ser vazio.',
    'any.required': 'O campo descrição é obrigatório.'
  }),
  status: Joi.string().valid('aberto', 'em andamento', 'solucionado').required().messages({
    'any.only': 'Status deve ser um dos seguintes: aberto, em andamento, solucionado',
    'any.required': 'O campo status é obrigatório.'
  }),
  agente_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'O agente_id deve ser um UUID válido.',
    'any.required': 'O campo agente_id é obrigatório.'
  })
});

const getAllCasos = (req, res) => {
  let results = casosRepository.getAll();
  const q = req.query.q;

  if (q) {
    const queryLower = q.toLowerCase();
    results = results.filter(caso =>
      caso.titulo.toLowerCase().includes(queryLower) ||
      caso.descricao.toLowerCase().includes(queryLower)
    );
  }

  return res.status(200).json(results);
};


const searchCasos = (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "O parâmetro de busca 'q' é obrigatório." });
  }
  const todosOsCasos = casosRepository.findAll();
  const termoBusca = q.toLowerCase();
  const resultados = todosOsCasos.filter(caso =>
    caso.titulo.toLowerCase().includes(termoBusca) ||
    caso.descricao.toLowerCase().includes(termoBusca)
  );
  if (resultados.length === 0) {
    return res.status(404).json({ message: "Nenhum caso encontrado para o termo de busca fornecido." });
  }
  res.status(200).json(resultados);
};


const getCasoById = (req, res) => {
  const { id } = req.params;
  const caso = casosRepository.findById(id);
  if (!caso) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }
  res.status(200).json(caso);
};

const createCaso = (req, res) => {
  const { error, value } = casoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  
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


  if (!agentesRepository.findById(value.agente_id)) {
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
  const { error, value } = casoPatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details.map(d => d.message) });
  }

  
  if (value.agente_id && !agentesRepository.findById(value.agente_id)) {
    return res.status(404).json({ message: 'Agente não encontrado para o agente_id fornecido.' });
  }

  const updatedCaso = casosRepository.update(id, value);
  if (!updatedCaso) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }

  res.status(200).json(updatedCaso);
};


const deleteCaso = (req, res) => {
  const { id } = req.params;
  const success = casosRepository.remove(id);
  if (!success) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }
  res.status(204).send();
};


const getAgenteDoCaso = (req, res) => {
  const caso = casosRepository.findById(req.params.id);
  if (!caso) {
    return res.status(404).json({ message: 'Caso não encontrado' });
  }
  const agente = agentesRepository.findById(caso.agente_id);
  if (!agente) {
    return res.status(404).json({ message: 'Agente responsável por este caso não foi encontrado' });
  }
  res.status(200).json(agente);
};

module.exports = {
  getAllCasos,
  searchCasos,
  getCasoById,
  createCaso,
  updateCaso,
  patchCaso,
  deleteCaso,
  getAgenteDoCaso,
};

