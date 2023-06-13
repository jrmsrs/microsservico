import { UUID } from 'crypto'
import { Tranca } from './trancaModel.d'

let trancas: Tranca[] = [
  {
    id: '053ff8fb-d059-4fa6-986c-f1ffe42da046',
    bicicletaId: '01fdceb5-fe96-4037-8af4-0be1a7985451',
    totemId: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    numero: 1,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 1',
    status: 'em uso'
  },
  {
    id: '35a371ed-8bb7-4b30-8f4f-310f31c3f576',
    bicicletaId: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333',
    totemId: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    numero: 2,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 2',
    status: 'em uso'
  },
  {
    id: '6100f40d-5d5d-4178-85ba-4c8cc6be002b',
    totemId: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    numero: 3,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 3',
    status: 'disponivel'
  },
  {
    id: '227d3473-bee0-46a9-a91d-fca2f7025793',
    totemId: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f',
    numero: 4,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 4',
    status: 'disponivel'
  },
  {
    id: 'e241cbb1-40a5-4c46-b0eb-91e010deffe0',
    totemId: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f',
    numero: 5,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 5',
    status: 'disponivel'
  },
  {
    id: 'e8938732-7114-4b50-9f59-b9bb07b1f875',
    totemId: '859f074e-e02e-427d-be61-8d87129c1bbd',
    numero: 6,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 6',
    status: 'disponivel'
  },
  {
    id: '9de164a3-d852-465d-a49f-83bdcdb05b08',
    totemId: '859f074e-e02e-427d-be61-8d87129c1bbd',
    numero: 7,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 7',
    status: 'disponivel'
  }
]

export function getTrancas (): Tranca[] {
  return trancas
}

export function getTrancaById (id: UUID): Tranca | undefined {
  return trancas.find((tranca) => tranca.id === id)
}

export function createTranca (tranca: Tranca): void {
  trancas.push(tranca)
}

export function updateTranca (id: UUID, updatedTranca: Tranca): boolean {
  const index = trancas.findIndex((tranca) => tranca.id === id)
  if (index !== -1) {
    trancas[index] = { ...updatedTranca, id }
    return true
  }
  return false
}

export function deleteTranca (id: UUID): boolean {
  const beforeLenght = trancas.length
  trancas = trancas.filter((tranca) => tranca.id !== id)
  return beforeLenght !== trancas.length
}
