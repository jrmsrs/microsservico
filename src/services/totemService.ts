import { Totem } from '../repositories/totem'
import * as TotemRepository from '../repositories/totemRepository'

export async function getAllTotems (): Promise<Totem[]> {
  return await TotemRepository.getTotens()
}

export async function getTotemById (id: number): Promise<Totem> {
  return await TotemRepository.getTotemById(id)
}

export async function createTotem (totem: Totem): Promise<Totem> {
  return await TotemRepository.createTotem(totem)
}

export async function updateTotem (id: number, updatedTotem: Totem): Promise<Totem> {
  return await TotemRepository.updateTotem(id, updatedTotem)
}

export async function deleteTotem (id: number): Promise<void> {
  await TotemRepository.deleteTotem(id)
}
