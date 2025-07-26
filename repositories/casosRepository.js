const casos = [];

function findAll({ agente_id, status }) {
  let results = [...casos];
  if (agente_id) {
    results = results.filter((c) => c.agente_id === agente_id);
  }
  if (status) {
    results = results.filter((c) => c.status === status);
  }
  return Promise.resolve(results);
}

function findById(id) {
  const caso = casos.find((c) => c.id === id);
  return Promise.resolve(caso);
}

function create(caso) {
  casos.push(caso);
  return Promise.resolve(caso);
}

function update(id, dadosAtualizados) {
  const index = casos.findIndex((c) => c.id === id);
  if (index === -1) return Promise.resolve(null);
  casos[index] = { ...casos[index], ...dadosAtualizados };
  return Promise.resolve(casos[index]);
}

function remove(id) {
  const index = casos.findIndex((c) => c.id === id);
  if (index === -1) return Promise.resolve(false);
  casos.splice(index, 1);
  return Promise.resolve(true);
}

function search(q) {
  if (!q) return Promise.resolve([]);
  const term = q.toLowerCase();
  const results = casos.filter(
    (c) =>
      c.titulo.toLowerCase().includes(term) ||
      c.descricao.toLowerCase().includes(term)
  );
  return Promise.resolve(results);
}

export default {
  findAll,
  findById,
  create,
  update,
  remove,
  search,
};
