import { Bicicleta } from './bicicletaModel.d'
import { status } from '../enums/statusBicicletaEnum'

let bicicletas: Bicicleta[] = [
  {
    id: 1,
    modelo: 'Modelo 1',
    marca: 'Marca 1',
    ano: '2021',
    numero: 1,
    status: status.DISPONIVEL
  },
  {
    id: 2,
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2,
    status: status.DISPONIVEL
  },
  {
    id: 3,
    modelo: 'Modelo 3',
    marca: 'Marca 3',
    ano: '2021',
    numero: 3,
    status: status.EM_USO
  },
  {
    id: 4,
    modelo: 'Modelo 4',
    marca: 'Marca 4',
    ano: '2021',
    numero: 4,
    status: status.NOVA
  },
  {
    id: 5,
    modelo: 'Modelo 5',
    marca: 'Marca 5',
    ano: '2021',
    numero: 5,
    status: status.APOSENTADA
  }
]

export function getBicicletas (): Bicicleta[] {
  return bicicletas
}

export function getBicicletaById (id?: number): Bicicleta | undefined {
  return bicicletas.find((bicicleta) => bicicleta.id === id)
}

export function createBicicleta (bicicleta: Bicicleta): number {
  // get last id and add 1, if undefined, set id to 1
  bicicleta.id = ((bicicletas[bicicletas.length - 1].id as number) ?? 0) + 1
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
