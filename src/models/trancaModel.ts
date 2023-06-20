import { Tranca } from './trancaModel.d'
import { status } from '../enums/statusTrancaEnum'

let trancas: Tranca[] = [
  {
    id: 1,
    bicicletaId: 1,
    totemId: 1,
    numero: 1,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 1',
    status: status.EM_USO
  },
  {
    id: 2,
    bicicletaId: 2,
    totemId: 1,
    numero: 2,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 2',
    status: status.EM_USO
  },
  {
    id: 3,
    totemId: 1,
    numero: 3,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 3',
    status: status.DISPONIVEL
  },
  {
    id: 4,
    totemId: 2,
    numero: 4,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 4',
    status: status.DISPONIVEL
  },
  {
    id: 5,
    totemId: 2,
    numero: 5,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 5',
    status: status.DISPONIVEL
  },
  {
    id: 6,
    totemId: 3,
    numero: 6,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 6',
    status: status.DISPONIVEL
  },
  {
    id: 7,
    numero: 7,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 7',
    status: status.NOVA
  },
  {
    id: 8,
    numero: 8,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 8',
    status: status.APOSENTADA
  }
]

export function getTrancas (): Tranca[] {
  return trancas
}

export function getTrancaById (id: number): Tranca | undefined {
  return trancas.find((tranca) => tranca.id === id)
}

export function createTranca (tranca: Tranca): number {
  // get last id and add 1, if undefined, set id to 1
  tranca.id = ((trancas[trancas.length - 1].id as number) ?? 0) + 1
  trancas.push(tranca)
  return tranca.id
}

export function updateTranca (id: number, updatedTranca: Tranca): boolean {
  const index = trancas.findIndex((tranca) => tranca.id === id)
  if (index !== -1) {
    trancas[index] = { ...updatedTranca, id }
    return true
  }
  return false
}

export function deleteTranca (id: number): boolean {
  const beforeLenght = trancas.length
  trancas = trancas.filter((tranca) => tranca.id !== id)
  return beforeLenght !== trancas.length
}

export function insertBicicleta (id: number, bicicletaId: number): boolean {
  const index = trancas.findIndex((tranca) => tranca.id === id)
  if (index !== -1) {
    trancas[index].bicicletaId = bicicletaId
    trancas[index].status = status.EM_USO
    return true
  }
  return false
}

export function removeBicicleta (id: number): boolean {
  const index = trancas.findIndex((tranca) => tranca.id === id)
  if (index !== -1) {
    trancas[index].bicicletaId = undefined
    trancas[index].status = status.DISPONIVEL
    return true
  }
  return false
}
