import { Tranca } from '../models/trancaModel'
import * as TrancaRepository from '../repositories/trancaRepository'
import { status } from '../enums/statusTrancaEnum'

export async function getAllTrancas (): Promise<Tranca[]> {
  return await TrancaRepository.getTrancas()
}

export async function getTrancaById (id: number): Promise<Tranca> {
  return await TrancaRepository.getTrancaById(id)
}

export async function createTranca (tranca: Tranca): Promise<Tranca> {
  return await TrancaRepository.createTranca(tranca)
}

export async function updateTranca (id: number, updatedTranca: Tranca): Promise<Tranca> {
  return await TrancaRepository.updateTranca(id, updatedTranca)
}

export async function deleteTranca (id: number): Promise<void> {
  await TrancaRepository.deleteTranca(id)
}

export async function insertBicicleta (id: number, bicicletaId: number): Promise<Tranca> {
  const tranca = await TrancaRepository.getTrancaById(id)
  const updatedTranca = { ...tranca, bicicletaId, status: status.EM_USO }
  return await TrancaRepository.updateTranca(id, updatedTranca)
}

export async function removeBicicleta (id: number): Promise<Tranca> {
  const tranca = await TrancaRepository.getTrancaById(id)
  const updatedTranca = { ...tranca, bicicletaId: undefined, status: status.DISPONIVEL }
  return await TrancaRepository.updateTranca(id, updatedTranca)
}
