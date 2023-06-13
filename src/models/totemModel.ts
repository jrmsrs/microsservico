import { UUID } from 'crypto'
import { Totem } from './totemModel.d'

let totens: Totem[] = [
  {
    id: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    localizacao: 'Localização 1',
    descricao: 'Descrição 1'
  },
  {
    id: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f',
    localizacao: 'Localização 2',
    descricao: 'Descrição 2'
  },
  {
    id: '859f074e-e02e-427d-be61-8d87129c1bbd',
    localizacao: 'Localização 3',
    descricao: 'Descrição 3'
  }
]

export function getTotens (): Totem[] {
  return totens
}

export function getTotemById (id: UUID): Totem | undefined {
  return totens.find((totem) => totem.id === id)
}

export function createTotem (totem: Totem): void {
  totens.push(totem)
}

export function updateTotem (id: UUID, updatedTotem: Totem): boolean {
  const index = totens.findIndex((totem) => totem.id === id)
  if (index !== -1) {
    totens[index] = { ...updatedTotem, id }
    return true
  }
  return false
}

export function deleteTotem (id: UUID): boolean {
  const beforeLenght = totens.length
  totens = totens.filter((totem) => totem.id !== id)
  return beforeLenght !== totens.length
}
