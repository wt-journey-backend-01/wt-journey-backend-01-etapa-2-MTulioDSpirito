import { v4 as uuidv4 } from 'uuid';
import agentesRepo from '../repositories/agentesRepository.js';

function validarAgente(data) {
  const errors = [];
  if (!data.nome || typeof data.nome !== 'string') {
    errors.push({ nome: 'Nome é obrigatório e deve ser string' });
  }
  if (
    !data.dataDeIncorporacao ||
    isNaN(Date.parse(data.dataDeIncorporacao))
  ) {
    errors.push({ dataDeIncorporacao: 'Data válida de incorporação é obrigatória' });
  }
  const cargosValidos = ['inspetor', 'delegado', 'outro'];
  if (!cargosValidos.includes(data.cargo)) {
    errors.push({ cargo: `Cargo inválido. Deve ser um de: ${cargosValidos.join(', ')}` });
  }
  return errors;
}

export async function getAgentes(req, res, next) {
  try {
    const { cargo, sort } = req.query;
    const agentes = await agentesRepo.findAll({ cargo, sort });
    res.status(200).json(agentes);
  } catch (error) {
    next(error);
  }
}

export async function getAgenteById(req, res, next) {
  try {
    const agente = await agentesRepo.findById(req.params.id);
    if (!agente) {
      return res.status(404).json({ status: 404, message: 'Agente não encontrado' });
    }
    res.status(200).json(agente);
  } catch (error) {
    next(error);
  }
}

export async function createAgente(req, res, next) {
  try {
    const errors = validarAgente(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    const novoAgente = {
      id: uuidv4(),
      nome: req.body.nome,
      dataDeIncorporacao: req.body.dataDeIncorporacao,
      cargo: req.body.cargo,
    };

    await agentesRepo.create(novoAgente);
    res.status(201).json(novoAgente);
  } catch (error) {
    next(error);
  }
}

export async function updateAgente(req, res, next) {
  try {
    const errors = validarAgente(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    const agenteAtualizado = await agentesRepo.update(req.params.id, req.body);
    if (!agenteAtualizado) {
      return res.status(404).json({ status: 404, message: 'Agente não encontrado' });
    }

    res.status(200).json(agenteAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function partialUpdateAgente(req, res, next) {
  try {
    const agenteExistente = await agentesRepo.findById(req.params.id);
    if (!agenteExistente) {
      return res.status(404).json({ status: 404, message: 'Agente não encontrado' });
    }

    const dadosAtualizados = { ...agenteExistente, ...req.body };
    const errors = validarAgente(dadosAtualizados);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    const agenteAtualizado = await agentesRepo.update(req.params.id, req.body);
    res.status(200).json(agenteAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function deleteAgente(req, res, next) {
  try {
    const sucesso = await agentesRepo.remove(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ status: 404, message: 'Agente não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
