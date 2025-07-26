const agentes = [];

function findAll({ cargo, sort }) {
  let results = [...agentes];
  if (cargo) {
    results = results.filter((a) => a.cargo === cargo);
  }
  if (sort) {
    if (sort === 'dataDeIncorporacao') {
      results.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
    } else if (sort === '-dataDeIncorporacao') {
      results.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
    }
  }
  return Promise.resolve(results);
}

function findById(id) {
  const agente = agentes.find((a) => a.id === id);
  return Promise.resolve(agente);
}

function create(agente) {
  agentes.push(agente);
  return Promise.resolve(agente);
}

function update(id, dadosAtualizados) {
  const index = agentes.findIndex((a) => a.id === id);
  if (index === -1) return Promise.resolve(null);
  agentes[index] = { ...agentes[index], ...dadosAtualizados };
  return Promise.resolve(agentes[index]);
}

function remove(id) {
  const index = agentes.findIndex((a) => a.id === id);
  if (index === -1) return Promise.resolve(false);
  agentes.splice(index, 1);
  return Promise.resolve(true);
}

export default {
  findAll,
  findById,
  create,
  update,
  remove,
};
