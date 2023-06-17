import { Bicicleta } from './bicicletaModel.d'

let bicicletas: Bicicleta[] = [
  {
    id: 1,
    modelo: 'Modelo 1',
    marca: 'Marca 1',
    ano: '2021',
    numero: 1,
    status: 'disponivel'
  },
  {
    id: 2,
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2,
    status: 'disponivel'
  },
  {
    id: 3,
    modelo: 'Modelo 3',
    marca: 'Marca 3',
    ano: '2021',
    numero: 3,
    status: 'em uso'
  }
]

export function getBicicletas (): Bicicleta[] {
  return bicicletas
}

export function getBicicletaById (id: number): Bicicleta | undefined {
  return bicicletas.find((bicicleta) => bicicleta.id === id)
}

export function createBicicleta (bicicleta: Bicicleta): number {
  bicicleta.id = (bicicletas[bicicletas.length - 1].id as number) + 1
  bicicletas.push(bicicleta)
  return bicicleta.id
}

export function updateBicicleta (id: number, updatedBicicleta: Bicicleta): boolean {
  const index = bicicletas.findIndex((bicicleta) => bicicleta.id === id)
  if (index !== -1) {
    bicicletas[index] = { ...updatedBicicleta, id }
    return true
  }
  return false
}

export function deleteBicicleta (id: number): boolean {
  const beforeLenght = bicicletas.length
  bicicletas = bicicletas.filter((bicicleta) => bicicleta.id !== id)
  return beforeLenght !== bicicletas.length
}
