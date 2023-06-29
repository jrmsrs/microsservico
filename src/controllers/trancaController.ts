import { NextFunction, Request, Response } from 'express'
import * as TrancaService from '../services/trancaService'
import * as TotemService from '../services/totemService'
import * as BicicletaService from '../services/bicicletaService'
import { ApiError } from '../error/ApiError'
import { status } from '../enums/statusTrancaEnum'
import { status as statusBicicleta } from '../enums/statusBicicletaEnum'
import { Tranca } from '../models/trancaModel'
import { Aluguel, Externo } from '../http'

interface TrancaResponse extends Tranca {
  localizacao?: string
}

export const criaEmail = (assunto: string, status: string, dadosFuncionario: any, dadosTranca: any): { email: string, assunto: string, mensagem: string } => {
  return {
    email: dadosFuncionario.email,
    assunto: `Tranca ${assunto} na rede`,
    mensagem: `\
<p>Olá, ${dadosFuncionario.nome as string}!</p>
<p>A tranca ${dadosTranca.modelo as string} de número ${dadosTranca.numero as number} foi ${assunto} na rede, como "${status}", com sucesso!</p>
<p>Foi utilizado o Totem ID-${dadosTranca.totemId as string}, localizado em ${dadosTranca.localizacao as string} para realizar a operação.</p>
<br />
<p>Data e hora da operação: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
<br />
<p>Atenciosamente,</p>
<p>Equipe ---</p>`
  }
}

// @ts-expect-error - TS1064
export const getTranca = async (req: Request, res: Response, next: NextFunction): void => {
  const trancas = await TrancaService.getAllTrancas()
  const trancasResponse = trancas as TrancaResponse[]
  for (const tranca of trancasResponse) {
    try {
      const totem = await TotemService.getTotemById(Number(tranca.totemId))
      tranca.localizacao = totem.localizacao
    } catch (error) {
      if (error instanceof Error && error.message === 'Totem não encontrado') {
        tranca.localizacao = 'Não instalada'
      }
    }
  }
  res.status(200).json(trancasResponse)
}

// @ts-expect-error - TS1064
export const getTrancaById = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    const tranca = await TrancaService.getTrancaById(id) as TrancaResponse
    tranca.localizacao = await TotemService.getTotemById(Number(tranca.totemId)).then((totem) => totem.localizacao).catch(() => 'Não instalada')
    res.status(200).json(tranca)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const createTranca = async (req: Request, res: Response, next: NextFunction): void => {
  const { numero, anoDeFabricacao, modelo } = req.body
  if (numero === undefined || anoDeFabricacao === undefined || modelo === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const tranca = await TrancaService.createTranca({ numero, anoDeFabricacao, modelo, status: status.NOVA }) as TrancaResponse
  tranca.localizacao = 'Não instalada'
  res.status(201).json(tranca)
}

// @ts-expect-error - TS1064
export const updateTranca = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { totemId, numero, anoDeFabricacao, modelo } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (numero === undefined || anoDeFabricacao === undefined || modelo === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    if (totemId !== undefined) {
      await TotemService.getTotemById(totemId)
    }
    const oldTranca = await TrancaService.getTrancaById(id)
    const tranca = await TrancaService.updateTranca(id, { id, numero, anoDeFabricacao, modelo, status: oldTranca.status, totemId: totemId ?? oldTranca.totemId }) as TrancaResponse
    tranca.localizacao = await TotemService.getTotemById(Number(tranca.totemId)).then((totem) => totem.localizacao).catch(() => 'Não instalada')
    res.status(200).json(tranca)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const deleteTranca = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    await TrancaService.deleteTranca(id)
    res.status(200).json()
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const integrarNaRede = async (req: Request, res: Response, next: NextFunction): void => {
  const { trancaId, funcionarioId, totemId } = req.body
  if (trancaId === undefined || funcionarioId === undefined || totemId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(trancaId) || isNaN(totemId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    await TotemService.getTotemById(totemId)
    const oldTranca = await TrancaService.getTrancaById(trancaId)
    if (oldTranca.status !== status.NOVA && oldTranca.status !== status.EM_REPARO) {
      next(ApiError.badRequest('Tranca já integrada na rede ou aposentada'))
      return
    }
    const funcionario = await Aluguel.get(`/funcionario/${String(funcionarioId)}`)
    const tranca = await TrancaService.updateTranca(trancaId, { ...oldTranca, status: status.DISPONIVEL, totemId }) as TrancaResponse
    tranca.localizacao = await TotemService.getTotemById(totemId).then((totem) => totem.localizacao).catch(() => 'Não instalada')
    const emailGerado = criaEmail('integrada', status.DISPONIVEL, funcionario.data, tranca)
    await Externo.post('/enviarEmail', emailGerado)
      .then(() => {
        res.status(200).json({ tranca, emailGerado })
      })
      .catch(() => {
        next(ApiError.internal(`\
A tranca foi integrada, mas ocorreu um erro interno ao enviar o e-mail: ${String(emailGerado.mensagem)}`
        ))
      })
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const retirarDaRede = async (req: Request, res: Response, next: NextFunction): void => {
  const { trancaId, funcionarioId, totemId, statusAcaoReparador } = req.body
  if (trancaId === undefined || funcionarioId === undefined || totemId === undefined || statusAcaoReparador === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(trancaId) || isNaN(totemId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  if (statusAcaoReparador !== status.EM_REPARO && statusAcaoReparador !== status.APOSENTADA) {
    next(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    return
  }
  try {
    await TotemService.getTotemById(totemId)
    const oldTranca = await TrancaService.getTrancaById(trancaId)
    if (oldTranca.status !== status.DISPONIVEL) {
      next(ApiError.badRequest('Tranca não disponível, verifique se está conectada a uma bicicleta ou se já foi retirada da rede'))
      return
    }
    if (oldTranca.totemId !== totemId) {
      next(ApiError.badRequest('Tranca não está instalada no totem informado'))
      return
    }
    const funcionario = await Aluguel.get(`/funcionario/${String(funcionarioId)}`)
    const tranca = await TrancaService.updateTranca(trancaId, { ...oldTranca, status: statusAcaoReparador, totemId: undefined }) as TrancaResponse
    tranca.localizacao = 'Não instalada'
    const emailGerado = criaEmail('integrada', status.DISPONIVEL, funcionario.data, tranca)
    await Externo.post('/enviarEmail', emailGerado)
      .then(() => {
        res.status(200).json({ tranca, emailGerado })
      })
      .catch(() => {
        next(ApiError.internal(`\
A tranca foi retirada, mas ocorreu um erro interno ao enviar o e-mail: ${String(emailGerado.mensagem)}`
        ))
      })
    res.status(200).json({ tranca, emailGerado })
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const trancar = async (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId } = req.body
  const trancaId = Number(req.params.id)
  if (bicicletaId === undefined || trancaId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(bicicletaId) || isNaN(trancaId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    const bicicleta = await BicicletaService.getBicicletaById(bicicletaId)
    if (bicicleta.status !== statusBicicleta.EM_USO) {
      next(ApiError.badRequest('Bicicleta já está trancada ou não está integrada na rede'))
      return
    }
    const oldTranca = await TrancaService.getTrancaById(trancaId)
    if (oldTranca.status !== status.DISPONIVEL) {
      next(ApiError.badRequest('Tranca não disponível, verifique se está conectada a uma bicicleta ou se foi retirada da rede'))
      return
    }
    await BicicletaService.updateBicicleta(bicicletaId, { ...bicicleta, status: statusBicicleta.DISPONIVEL })
    const tranca = await TrancaService.updateTranca(trancaId, { ...oldTranca, status: status.EM_USO, bicicletaId }) as TrancaResponse
    tranca.localizacao = await TotemService.getTotemById(Number(oldTranca.totemId)).then((totem) => totem.localizacao).catch(() => 'Não instalada')
    res.status(200).json(tranca)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const destrancar = async (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId } = req.body
  const trancaId = Number(req.params.id)
  if (trancaId === undefined || bicicletaId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(trancaId) || isNaN(bicicletaId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    const bicicleta = await BicicletaService.getBicicletaById(bicicletaId)
    if (bicicleta.status !== statusBicicleta.DISPONIVEL) {
      next(ApiError.badRequest('Bicicleta não disponível, verifique está realmente trancada ou com reparo solicitado'))
      return
    }
    const oldTranca = await TrancaService.getTrancaById(trancaId)
    if (oldTranca.status !== status.EM_USO) {
      next(ApiError.badRequest('Tranca não está trancada'))
      return
    }
    await BicicletaService.updateBicicleta(bicicletaId, { ...bicicleta, status: statusBicicleta.EM_USO })
    const tranca = await TrancaService.updateTranca(trancaId, { ...oldTranca, status: status.DISPONIVEL, bicicletaId: undefined }) as TrancaResponse
    tranca.localizacao = await TotemService.getTotemById(Number(oldTranca.totemId)).then((totem) => totem.localizacao).catch(() => 'Não instalada')
    res.status(200).json(tranca)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const setStatus = async (req: Request, res: Response, next: NextFunction): void => {
  next(ApiError.badRequest(
    'Altere o status da tranca pelos endpoints ' +
    "tranca/{trancaId}/trancar (ficará -> 'ocupada' com uma bicicleta); " +
    "/tranca/{tranca}/destrancar (ficará -> 'livre'); " +
    "/bicicleta/integrarNaRede (ficará -> 'livre' em um totem); " +
    "/bicicleta/retirarDaRede (ficará -> 'aposentada' ou 'em reparo')"
  ))
}
