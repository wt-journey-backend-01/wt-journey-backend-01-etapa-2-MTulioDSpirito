const { v4: uuidv4 } = require('uuid');

let casos = [
    { id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46", titulo: "Homicídio no Bairro União", descricao: "Disparos foram reportados, resultando na morte de um homem de 45 anos.", status: "aberto", agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" },
    { id: "c1a9b8e2-5c6a-4f8b-9e3d-7a6f5c4b3a21", titulo: "Roubo de Veículo", descricao: "Carro modelo sedan foi roubado a mão armada.", status: "solucionado", agente_id: "a2a16298-5192-492e-9481-9f2b1cce06c6" }
];

const findAll = () => {
    return casos;
};

const findById = (id) => {
    return casos.find(caso => caso.id === id);
};

const create = (caso) => {
    const newCaso = { id: uuidv4(), ...caso };
    casos.push(newCaso);
    return newCaso;
};

const update = (id, casoData) => {
    const casoIndex = casos.findIndex(c => c.id === id);
    if (casoIndex === -1) {
        return null;
    }
    casos[casoIndex] = { ...casos[casoIndex], ...casoData };
    return casos[casoIndex];
};

const remove = (id) => {
    const casoIndex = casos.findIndex(c => c.id === id);
    if (casoIndex === -1) {
        return false;
    }
    casos.splice(casoIndex, 1);
    return true;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};