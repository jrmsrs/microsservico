import { Bicicleta } from './bicicleta'
import { status } from '../enums/statusBicicletaEnum'

export let bicicletas: Bicicleta[] = [
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

export async function getBicicletas (): Promise<Bicicleta[]> {
  return bicicletas
}

export async function getBicicletaById (id?: number): Promise<Bicicleta> {
  const bicicleta = bicicletas.find((bicicleta) => bicicleta.id === id)
  if (bicicleta !== undefined) return bicicleta
  throw new Error('Bicicleta não encontrada')
}

export async function createBicicleta (bicicleta: Bicicleta, array = bicicletas): Promise<Bicicleta> {
  // get last id and add 1, if undefined, set id to 1
  bicicleta.id = (array[array.length - 1]?.id ?? 0) + 1
  array.push(bicicleta)
  return bicicleta
}

export async function updateBicicleta (id: number, updatedBicicleta: Bicicleta): Promise<Bicicleta> {
  const index = bicicletas.findIndex((bicicleta) => bicicleta.id === id)
  if (index !== -1) {
    bicicletas[index] = { ...updatedBicicleta, id }
    return bicicletas[index]
  }
  throw new Error('Bicicleta não encontrada')
}

export async function deleteBicicleta (id: number): Promise<void> {
  const beforeLenght = bicicletas.length
  bicicletas = bicicletas.filter((bicicleta) => bicicleta.id !== id)
  if (beforeLenght !== bicicletas.length) return
  throw new Error('Bicicleta não encontrada')
}
