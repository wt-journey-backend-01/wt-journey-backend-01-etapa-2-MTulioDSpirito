import { v4 as uuidv4 } from 'uuid';
import casosRepo from '../repositories/casosRepository.js';
import agentesRepo from '../repositories/agentesRepository.js';

function validarCaso(data) {
  const errors = [];
  if (!data.titulo || typeof data.titulo !== 'string') {
    errors.push({ titulo: 'Título é obrigatório e deve ser string' });
  }
  if (!data.descricao || typeof data.descricao !== 'string') {
    errors.push({ descricao: 'Descrição é obrigatória e deve ser string' });
  }
  const statusValidos = ['aberto', 'solucionado'];
  if (!statusValidos.includes(data.status)) {
    errors.push({ status: `Status inválido. Deve ser um de: ${statusValidos.join(', ')}` });
  }
  if (!data.agente_id || typeof data.agente_id !== 'string') {
    errors.push({ agente_id: 'agente_id é obrigatório e deve ser string (UUID)' });
  }
  return errors;
}

export async function getCasos(req, res, next) {
  try {
    const { agente_id, status } = req.query;
    const casos = await casosRepo.findAll({ agente_id, status });
    res.status(200).json(casos);
  } catch (error) {
    next(error);
  }
}

export async function getCasoById(req, res, next) {
  try {
    const caso = await casosRepo.findById(req.params.id);
    if (!caso) {
      return res.status(404).json({ status: 404, message: 'Caso não encontrado' });
    }
    res.status(200).json(caso);
  } catch (error) {
    next(error);
  }
}

export async function createCaso(req, res, next) {
  try {
    const errors = validarCaso(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    // Verifica se agente existe
    const agente = await agentesRepo.findById(req.body.agente_id);
    if (!agente) {
      return res.status(400).json({ status: 400, message: 'Agente não encontrado para o agente_id informado' });
    }

    const novoCaso = {
      id: uuidv4(),
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status,
      agente_id: req.body.agente_id,
    };

    await casosRepo.create(novoCaso);
    res.status(201).json(novoCaso);
  } catch (error) {
    next(error);
  }
}

export async function updateCaso(req, res, next) {
  try {
    const errors = validarCaso(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    const casoExistente = await casosRepo.findById(req.params.id);
    if (!casoExistente) {
      return res.status(404).json({ status: 404, message: 'Caso não encontrado' });
    }

    // Verifica se agente existe
    const agente = await agentesRepo.findById(req.body.agente_id);
    if (!agente) {
      return res.status(400).json({ status: 400, message: 'Agente não encontrado para o agente_id informado' });
    }

    const casoAtualizado = await casosRepo.update(req.params.id, req.body);
    res.status(200).json(casoAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function partialUpdateCaso(req, res, next) {
  try {
    const casoExistente = await casosRepo.findById(req.params.id);
    if (!casoExistente) {
      return res.status(404).json({ status: 404, message: 'Caso não encontrado' });
    }

    const dadosAtualizados = { ...casoExistente, ...req.body };
    const errors = validarCaso(dadosAtualizados);
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, message: 'Parâmetros inválidos', errors });
    }

    // Verifica se agente existe
    const agente = await agentesRepo.findById(dadosAtualizados.agente_id);
    if (!agente) {
      return res.status(400).json({ status: 400, message: 'Agente não encontrado para o agente_id informado' });
    }

    const casoAtualizado = await casosRepo.update(req.params.id, req.body);
    res.status(200).json(casoAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function deleteCaso(req, res, next) {
  try {
    const sucesso = await casosRepo.remove(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ status: 404, message: 'Caso não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAgenteByCaso(req, res, next) {
  try {
    const caso = await casosRepo.findById(req.params.caso_id);
    if (!caso) {
      return res.status(404).json({ status: 404, message: 'Caso não encontrado' });
    }

    const agente = await agentesRepo.findById(caso.agente_id);
    if (!agente) {
      return res.status(404).json({ status: 404, message: 'Agente não encontrado para o caso' });
    }

    res.status(200).json(agente);
  } catch (error) {
    next(error);
  }
}

export async function searchCasos(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: 400, message: 'Query string "q" obrigatória' });
    }
    const resultados = await casosRepo.search(q);
    res.status(200).json(resultados);
  } catch (error) {
    next(error);
  }
}
