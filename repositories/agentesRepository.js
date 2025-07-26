const { v4: uuidv4 } = require('uuid');

// Simulação de banco de dados em memória
let agentes = [
    { id: "401bccf5-cf9e-489d-8412-446cd169a0f1", nome: "Rommel Carneiro", dataDeIncorporacao: "1992-10-04", cargo: "delegado" },
    { id: "a2a16298-5192-492e-9481-9f2b1cce06c6", nome: "Ana Pereira", dataDeIncorporacao: "2015-03-12", cargo: "inspetor" }
];

const findAll = () => {
    return agentes;
};

const findById = (id) => {
    return agentes.find(agente => agente.id === id);
};

const create = (agente) => {
    const newAgente = { id: uuidv4(), ...agente };
    agentes.push(newAgente);
    return newAgente;
};

const update = (id, agenteData) => {
    const agenteIndex = agentes.findIndex(a => a.id === id);
    if (agenteIndex === -1) {
        return null;
    }
    agentes[agenteIndex] = { ...agentes[agenteIndex], ...agenteData };
    return agentes[agenteIndex];
};

const remove = (id) => {
    const agenteIndex = agentes.findIndex(a => a.id === id);
    if (agenteIndex === -1) {
        return false;
    }
    agentes.splice(agenteIndex, 1);
    return true;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};