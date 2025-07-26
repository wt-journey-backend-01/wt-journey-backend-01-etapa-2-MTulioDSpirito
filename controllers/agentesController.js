const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi');//nmp install joi

const agenteSchema = joi.object({
  nome: joi.string().min(3).max(50).required().messages({
    'string.base': 'Nome deve ser um texto',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 50 caracteres',
    'any.required': 'Nome é obrigatório',
  }),

  dataDeIncorporacao: joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      const now = new Date();

      const isValidDate = !isNaN(date.getTime());
      const [year, month, day] = value.split('-').map(Number);

      const isAccurateDate =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day;

      if (!isValidDate || !isAccurateDate) {
        return helpers.message('Data de incorporação deve ser uma data real no formato yyyy-mm-dd');
      }

      if (date > now) {
        return helpers.message('Data de incorporação não pode estar no futuro');
      }

      return value;
    })
    .messages({
      'string.pattern.base': 'Data de incorporação deve estar no formato exato yyyy-mm-dd',
      'any.required': 'Data de incorporação é obrigatória',
    }),

  cargo: joi.string().required().messages({
    'string.base': 'Cargo deve ser um texto',
    'any.required': 'Cargo é obrigatório',
  }),
});

const getAllAgentes = (req, res) => {
  let results = agentesRepository.findAll();
  const { cargo, sort } = req.query;

  if (cargo) {
    results = results.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
  }

  if (sort) {
    const desc = sort.startsWith('-');
    const field = desc ? sort.substring(1) : sort;

    // CORREÇÃO 5: Lógica de ordenação aprimorada para datas
    results.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Se o campo for a data, converte para objetos Date para comparar
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
    const { error,value } = agenteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Dados inválidos", details: error.details  });
    }

    const newAgente = agentesRepository.create(value);
    res.status(201).json(newAgente);
} ;

const updateAgente = (req, res) => {
    const { id } = req.params;
    const { error, value } = agenteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Dados inválidos", details: error.details });
    }

    const updatedAgente = agentesRepository.update(id, value);
    if (!updatedAgente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.status(200).json(updatedAgente);
};

const patchAgente = (req, res) => {
  const { id } = req.params;
  const { error, value } = agentePatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Dados inválidos", details: error.details });
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

