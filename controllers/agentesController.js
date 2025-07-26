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

const getAllAgentes = (req, res) => {
    let results = agentesRepository.findAll();
    const{cargo, sort} = req.query;

    if (cargo) {
    results = results.filter(agente => agente.cargo.toLowerCase() === cargo.toLowerCase());
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
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (!nome && !dataDeIncorporacao && !cargo) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização' });
    }

    const agenteData = {};
    if (nome) agenteData.nome = nome;
    if (dataDeIncorporacao) agenteData.dataDeIncorporacao = dataDeIncorporacao;
    if (cargo) agenteData.cargo = cargo;

    const updatedAgente = agentesRepository.update(id, agenteData);
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

