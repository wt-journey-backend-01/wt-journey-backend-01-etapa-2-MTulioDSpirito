const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi'); // Usaremos Joi para uma validação robusta (opcional, mas recomendado)
// npm install joi

const agenteSchema = joi.object({
  nome: joi.string().min(3).max(50).required(),

  dataDeIncorporacao: joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      const now = new Date();

      const isValidDate = !isNaN(date.getTime());
      const [year, month, day] = value.split('-').map(Number);

      // Verifica se a data tem os mesmos componentes da string (evita datas como "2024-02-31")
      const isAccurateDate =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day;

      if (!isValidDate || !isAccurateDate) {
        return helpers.message('Data de incorporação deve ser uma data real no formato yyyy-mm-dd');
      }

      // Verifica se a data é futura
      if (date > now) {
        return helpers.message('Data de incorporação não pode estar no futuro');
      }

      return value;
    })
    .messages({
      'string.pattern.base': 'Data de incorporação deve estar no formato exato yyyy-mm-dd',
    }),

  cargo: joi.string().required()
});


const getAllAgentes = (req, res) => {
    let results = agentesRepository.findAll();
    const { cargo, sort } = req.query;

    if (cargo) {
        results = results.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase());
    }

    if (sort) {
        const desc = sort.startsWith('-');
        const field = desc ? sort.substring(1) : sort;
        results.sort((a, b) => {
            if (a[field] < b[field]) return desc ? 1 : -1;
            if (a[field] > b[field]) return desc ? -1 : 1;
            return 0;
        });
    }

    res.status(200).json(results);
};

const getAgenteById = (req, res) => {
    const agente = agentesRepository.findById(req.params.id);
    if (!agente) {
        return res.status(404).json({ message: "Agente não encontrado" });
    }
    res.status(200).json(agente);
};

const createAgente = (req, res) => {
    const { error, value } = agenteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: error.details.map(err => ({ [err.path[0]]: err.message }))
        });
    }

    const newAgente = agentesRepository.create(value);
    res.status(201).json(newAgente);
};

const updateAgente = (req, res) => {
    const { error, value } = agenteSchema.validate(req.body); // PUT exige o objeto completo
    if (error) {
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: error.details.map(err => ({ [err.path[0]]: err.message }))
        });
    }

    const updatedAgente = agentesRepository.update(req.params.id, value);
    if (!updatedAgente) {
        return res.status(404).json({ message: "Agente não encontrado" });
    }
    res.status(200).json(updatedAgente);
};

const patchAgente = (req, res) => {
    // Para PATCH, validamos apenas os campos presentes
    const updatedAgente = agentesRepository.update(req.params.id, req.body);
    if (!updatedAgente) {
        return res.status(404).json({ message: "Agente não encontrado" });
    }
    res.status(200).json(updatedAgente);
};

const deleteAgente = (req, res) => {
    const success = agentesRepository.remove(req.params.id);
    if (!success) {
        return res.status(404).json({ message: "Agente não encontrado" });
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