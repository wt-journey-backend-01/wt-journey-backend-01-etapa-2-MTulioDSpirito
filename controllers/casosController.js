const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const joi = require('joi');


const casoSchema = joi.object({
    titulo: joi.string().required(),
    descricao: joi.string().required(),
    status: joi.string().valid('aberto', 'em andamento', 'solucionado').required().messages({
        'any.only': 'Status deve ser um dos seguintes: aberto, em andamento, solucionado'
    }),
    agente_id: joi.string().guid({ version: 'uuidv4' }).required()
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
    if (q) {
        const queryLower = q.toLowerCase();
        results = results.filter(c => c.titulo.toLowerCase().includes(queryLower) || c.descricao.toLowerCase().includes(queryLower));
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
    // 1. Encontra o caso pelo ID da rota
    const caso = casosRepository.findById(req.params.id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    // 2. Usa o agente_id do caso para encontrar o agente
    const agente = agentesRepository.findById(caso.agente_id);

    if (!agente) {
        // Isso pode acontecer se o agente for deletado mas o caso não
        return res.status(404).json({ message: 'Agente responsável por este caso não foi encontrado' });
    }

    // 3. Retorna os dados completos do agente
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
        return res.status(400).json({ message: "Dados inválidos", details: error.details });
    }

    if (!agentesRepository.findById(value.agente_id)) {
        return res.status(400).json({ message: 'O agente_id fornecido não existe.' });
    }

    const newCaso = casosRepository.create(value);
    res.status(201).json(newCaso);
};

const updateCaso = (req, res) => {
    const { id } = req.params; 
    const { error, value } = casoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Dados inválidos", details: error.details });
    }

    if (!agentesRepository.findById(value.agente_id)) {
        return res.status(400).json({ message: 'O agente_id fornecido não existe.' });
    }

    const updatedCaso = casosRepository.update(id, value);
    if (!updatedCaso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(200).json(updatedCaso);
};

const patchCaso = (req, res) => {
    const { id } = req.params; 
    
    
    const updatedCaso = casosRepository.update(id, req.body); 
    
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