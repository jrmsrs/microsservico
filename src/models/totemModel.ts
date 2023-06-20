import { Totem } from './totemModel.d'

let totens: Totem[] = [
  {
    id: 1,
    localizacao: 'Localização 1',
    descricao: 'Descrição 1'
  },
  {
    id: 2,
    localizacao: 'Localização 2',
    descricao: 'Descrição 2'
  },
  {
    id: 3,
    localizacao: 'Localização 3',
    descricao: 'Descrição 3'
  }
]

export function getTotens (): Totem[] {
  return totens
}

export function getTotemById (id?: number): Totem | undefined {
  if (id === undefined) {
    return undefined
  }
  return totens.find((totem) => totem.id === id)
}

export function createTotem (totem: Totem): number {
  // get last id and add 1, if undefined, set id to 1
  totem.id = ((totens[totens.length - 1].id as number) ?? 0) + 1
  totens.push(totem)
  return totem.id
}

export function updateTotem (id: number, updatedTotem: Totem): boolean {
  const index = totens.findIndex((totem) => totem.id === id)
  if (index !== -1) {
    totens[index] = { ...updatedTotem, id }
    return true
  }
  return false
}

export function deleteTotem (id: number): boolean {
  const beforeLenght = totens.length
  totens = totens.filter((totem) => totem.id !== id)
  return beforeLenght !== totens.length
}
