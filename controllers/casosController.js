const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi');


const casoSchema = joi.object({
    titulo: joi.string().required().messages({
        'string.base': 'O título deve ser um texto.',
        'string.empty': 'O título é obrigatório.',
        'any.required': 'O título é obrigatório.'
    }),
    descricao: joi.string().required().messages({
        'string.base': 'A descrição deve ser um texto.',
        'string.empty': 'A descrição é obrigatória.',
        'any.required': 'A descrição é obrigatória.'
    }),
    status: joi.string().valid('aberto', 'em andamento', 'solucionado').required().messages({
        'any.only': 'Status deve ser um dos seguintes: aberto, em andamento, solucionado.',
        'string.empty': 'O status é obrigatório.',
        'any.required': 'O status é obrigatório.'
    }),
    agente_id: joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'O agente_id deve ser um UUID válido.',
        'string.empty': 'O agente_id é obrigatório.',
        'any.required': 'O agente_id é obrigatório.'
    })
});


const getAllCasos = (req, res) => {
    let results = casosRepository.findAll();
    const { agente_id, status, q } = req.query;

    if (agente_id) {
        results = results.filter(c => c.agente_id === agente_id);
    }

    if (status) {
        results = results.filter(c => c.status === status);
    }

    if (q !== undefined && q.trim() === '') {
        return res.status(400).json({ message: "O parâmetro 'q' não pode ser vazio." });
    }

    if (q) {
        const query = q.toLowerCase();
        results = results.filter(caso =>
            caso.titulo.toLowerCase().includes(query) ||
            caso.descricao.toLowerCase().includes(query)
        );
    }

    res.status(200).json(results);
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

    // ---- VALIDAÇÃO ADICIONADA AQUI ----
    // Se, após o filtro, o array de resultados estiver vazio,
    // significa que nenhum caso correspondeu à busca.
    if (resultados.length === 0) {
        return res.status(404).json({ message: "Nenhum caso encontrado para o termo de busca fornecido." });
    }

    // Se houver resultados, retorna-os normalmente.
    res.status(200).json(resultados);
};


const getAgenteDoCaso = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID do caso é obrigatório.' });
    }

    const caso = casosRepository.findById(id);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado com o ID fornecido.' });
    }

    const agente = agentesRepository.findById(caso.agente_id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente responsável pelo caso não foi encontrado.' });
    }

    res.status(200).json(agente);
};




const getCasoById = (req, res) => {
    
    const { id } = req.params;
    const caso = casosRepository.findById(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

 
    if (req.query.agente_id !== undefined) {
        const agente = agentesRepository.findById(caso.agente_id);
        return res.status(200).json(agente || { message: "Agente associado não encontrado."});
    }

    res.status(200).json(caso);
};

const createCaso = (req, res) => {
    const { error, value } = casoSchema.validate(req.body);

    if (error) {
        const messages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Dados inválidos", errors: messages });
    }

    const agente = agentesRepository.findById(value.agente_id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente com o ID fornecido não foi encontrado' });
    }

    const novoCaso = casosRepository.create(value);
    res.status(201).json(novoCaso);
};


const updateCaso = (req, res) => {
    const { id } = req.params; 
    const { error, value } = casoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Dados inválidos", details: error.details });
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
    const patchSchema = joi.object({
        titulo: joi.string(),
        descricao: joi.string(),
        status: joi.string().valid('aberto', 'em andamento', 'solucionado'),
        agente_id: joi.string().guid({ version: 'uuidv4' })
    }).min(1); // pelo menos 1 campo

    const { error, value } = patchSchema.validate(req.body);
    if (error) {
        const messages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: 'Dados inválidos', errors: messages });
    }

    if (value.agente_id && !agentesRepository.findById(value.agente_id)) {
        return res.status(404).json({ message: 'Agente não encontrado para o agente_id fornecido' });
    }

    const updated = casosRepository.update(id, value);
    if (!updated) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    res.status(200).json(updated);
};

const deleteCaso = (req, res) => {
    const { id } = req.params; 
    
    
    const success = casosRepository.remove(id); 

    if (!success) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(204).send();
};

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso,
    getAgenteDoCaso
    , searchCasos
};