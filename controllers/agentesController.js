const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi');//nmp install joi

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



const patchAgenteSchema = joi.object({
    nome: joi.string().min(3).max(50).messages({
        'string.base': 'O nome deve ser um texto.',
        'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
    }),

    dataDeIncorporacao: joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
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
                return helpers.message('Data de incorporação deve ser uma data real no formato yyyy-mm-dd.');
            }

            if (date > now) {
                return helpers.message('Data de incorporação não pode estar no futuro.');
            }

            return value;
        })
        .messages({
            'string.pattern.base': 'A data deve estar no formato yyyy-mm-dd.'
        }),

    cargo: joi.string().min(2).max(100).messages({
        'string.base': 'O cargo deve ser um texto.',
        'string.min': 'O cargo deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O cargo deve ter no máximo {#limit} caracteres.',
    })
}).min(1).messages({
    'object.min': 'Pelo menos um campo deve ser fornecido para atualização.'
});


const getAllAgentes = (req, res) => {
    let results = agentesRepository.findAll();
    const { cargo, sort, dataDeIncorporacao } = req.query;

    // Filtro por cargo
    if (cargo) {
        results = results.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase());
    }

    // Filtro por dataDeIncorporacao
    if (dataDeIncorporacao) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(dataDeIncorporacao)) {
            return res.status(400).json({
                message: "Parâmetro 'dataDeIncorporacao' inválido. Formato esperado: yyyy-mm-dd."
            });
        }

        const date = new Date(dataDeIncorporacao);
        const [year, month, day] = dataDeIncorporacao.split('-').map(Number);

        const isValidDate = !isNaN(date.getTime()) &&
            date.getUTCFullYear() === year &&
            date.getUTCMonth() + 1 === month &&
            date.getUTCDate() === day;

        if (!isValidDate) {
            return res.status(400).json({
                message: "Parâmetro 'dataDeIncorporacao' inválido. A data fornecida não é real."
            });
        }

        results = results.filter(a => new Date(a.dataDeIncorporacao) >= date);
    }

    // Ordenação
    if (sort) {
        const validSortFields = ['nome', 'dataDeIncorporacao', 'cargo'];
        const desc = sort.startsWith('-');
        const field = desc ? sort.slice(1) : sort;

        if (!validSortFields.includes(field)) {
            return res.status(400).json({
                message: `Campo para ordenação inválido: '${field}'. Campos permitidos: ${validSortFields.join(', ')}.`
            });
        }

        results.sort((a, b) => {
            if (a[field] < b[field]) return desc ? 1 : -1;
            if (a[field] > b[field]) return desc ? -1 : 1;
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
    const { error, value } = patchAgenteSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'Dados inválidos',
            details: error.details.map(detail => detail.message)
        });
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