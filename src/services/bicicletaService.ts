import { Bicicleta } from '../repositories/bicicleta'
import * as BicicletaRepository from '../repositories/bicicletaRepository'

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
