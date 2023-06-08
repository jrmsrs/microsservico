import { UUID } from 'crypto'
import { Bicicleta } from './bicicletaModel.d'

let bicicletas: Bicicleta[] = [
  {
    id: '01fdceb5-fe96-4037-8af4-0be1a7985451',
    modelo: 'Modelo 1',
    marca: 'Marca 1',
    ano: '2021',
    numero: 1,
    status: 'disponivel'
  },
  {
    id: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333',
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2,
    status: 'disponivel'
  },
  {
    id: 'cfdc03b1-0ae3-422e-a28c-928bc5e2bc47',
    modelo: 'Modelo 3',
    marca: 'Marca 3',
    ano: '2021',
    numero: 3,
    status: 'disponivel'
  }
]

export function getBicicletas (): Bicicleta[] {
  return bicicletas
}

export function getBicicletaById (id: UUID): Bicicleta | undefined {
  return bicicletas.find((bicicleta) => bicicleta.id === id)
}

export function createBicicleta (bicicleta: Bicicleta): void {
  bicicletas.push(bicicleta)
}

export function updateBicicleta (id: UUID, updatedBicicleta: Bicicleta): boolean {
  const index = bicicletas.findIndex((bicicleta) => bicicleta.id === id)
  if (index !== -1) {
    bicicletas[index] = { ...updatedBicicleta, id }
    return true
  }
  return false
}

export function deleteBicicleta (id: UUID): boolean {
  const beforeLenght = bicicletas.length
  bicicletas = bicicletas.filter((bicicleta) => bicicleta.id !== id)
  return beforeLenght !== bicicletas.length
}
