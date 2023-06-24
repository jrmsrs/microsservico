import { Totem } from './totem'

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

export async function getTotens (): Promise<Totem[]> {
  return totens
}

export async function getTotemById (id: number): Promise<Totem> {
  const totem = totens.find((totem) => totem.id === id)
  if (totem !== undefined) return totem
  throw new Error('Totem não encontrado')
}

export async function createTotem (totem: Totem, array = totens): Promise<Totem> {
  // get last id and add 1, if undefined, set id to 1
  totem.id = (array[array.length - 1]?.id ?? 0) + 1
  array.push(totem)
  return totem
}

export async function updateTotem (id: number, updatedTotem: Totem): Promise<Totem> {
  const index = totens.findIndex((totem) => totem.id === id)
  if (index !== -1) {
    totens[index] = { ...updatedTotem, id }
    return totens[index]
  }
  throw new Error('Totem não encontrado')
}

export async function deleteTotem (id: number): Promise<void> {
  const beforeLenght = totens.length
  totens = totens.filter((totem) => totem.id !== id)
  if (beforeLenght !== totens.length) return
  throw new Error('Totem não encontrado')
}
