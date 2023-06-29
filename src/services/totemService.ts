import { Totem } from '../models/totemModel'
import { Bicicleta } from '../models/bicicletaModel'
import { Tranca } from '../models/trancaModel'
import * as TotemRepository from '../repositories/totemRepository'
import * as BicicletaRepository from '../repositories/bicicletaRepository'
import * as TrancaRepository from '../repositories/trancaRepository'

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

export async function getAllTrancas (id: number): Promise<Tranca[]> {
  const trancas = await TrancaRepository.getTrancas()
  return trancas.filter(tranca => tranca.totemId === id)
}

export async function getAllBicicletas (id: number): Promise<Bicicleta[]> {
  const trancas = await TrancaRepository.getTrancas()
  const bicicletas = await BicicletaRepository.getBicicletas()
  const trancasDoTotem = trancas.filter(tranca => tranca.totemId === id)
  const bicicletasDoTotem = [] as Bicicleta[]
  trancasDoTotem.forEach(tranca => {
    bicicletas.forEach(bicicleta => {
      if (bicicleta.id === tranca.bicicletaId) bicicletasDoTotem.push(bicicleta)
    })
  })
  return bicicletasDoTotem
}
