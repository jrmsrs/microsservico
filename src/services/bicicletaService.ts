import { Bicicleta } from '../models/bicicletaModel'
import * as BicicletaRepository from '../repositories/bicicletaRepository'
import { status } from '../enums/statusBicicletaEnum'

export async function getAllBicicletas (): Promise<Bicicleta[]> {
  return await BicicletaRepository.getBicicletas()
}

export async function getBicicletaById (id: number): Promise<Bicicleta> {
  return await BicicletaRepository.getBicicletaById(id)
}

export async function createBicicleta (bicicleta: Bicicleta): Promise<Bicicleta> {
  return await BicicletaRepository.createBicicleta(bicicleta)
}

export async function updateBicicleta (id: number, updatedBicicleta: Bicicleta): Promise<Bicicleta> {
  return await BicicletaRepository.updateBicicleta(id, updatedBicicleta)
}

export async function deleteBicicleta (id: number): Promise<void> {
  await BicicletaRepository.deleteBicicleta(id)
}

export async function setStatus (id: number, stat: status): Promise<Bicicleta> {
  const bicicleta = await BicicletaRepository.getBicicletaById(id)
  if (bicicleta.status !== status.REPARO_SOLICITADO && bicicleta.status !== status.DISPONIVEL) {
    throw new Error('Bicicleta não está como "disponível" ou "reparo solicitado"')
  }
  const updatedBicicleta = { ...bicicleta, status: stat }
  return await BicicletaRepository.updateBicicleta(id, updatedBicicleta)
}
