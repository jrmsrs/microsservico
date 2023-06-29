import { Tranca } from '../models/trancaModel'
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

export async function getTrancas (): Promise<Tranca[]> {
  return trancas
}

export async function getTrancaById (id: number): Promise<Tranca> {
  const tranca = trancas.find((tranca) => tranca.id === id)
  if (tranca !== undefined) return tranca
  throw new Error('Tranca não encontrada')
}

export async function createTranca (tranca: Tranca, array = trancas): Promise<Tranca> {
  // get last id and add 1, if undefined, set id to 1
  tranca.id = (array[array.length - 1]?.id ?? 0) + 1
  array.push(tranca)
  return tranca
}

export async function updateTranca (id: number, updatedTranca: Tranca): Promise<Tranca> {
  const index = trancas.findIndex((tranca) => tranca.id === id)
  if (index !== -1) {
    trancas[index] = { ...updatedTranca, id }
    return trancas[index]
  }
  throw new Error('Tranca não encontrada')
}

export async function deleteTranca (id: number): Promise<void> {
  const beforeLenght = trancas.length
  trancas = trancas.filter((tranca) => tranca.id !== id)
  if (beforeLenght !== trancas.length) return
  throw new Error('Tranca não encontrada')
}
