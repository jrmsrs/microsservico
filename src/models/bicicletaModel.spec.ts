import { UUID, randomUUID } from 'crypto'
import {
  getBicicletas,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
} from './bicicletaModel'
import type { Bicicleta } from './bicicletaModel.d'

describe('Model bicicletaModel', () => {
  const ids = [
    '01fdceb5-fe96-4037-8af4-0be1a7985451',
    'a2f43e3b-f0f6-40fd-a6a7-dea545076333',
    'cfdc03b1-0ae3-422e-a28c-928bc5e2bc47'
  ] as UUID[]

  describe('Model getBicicletas', () => {
    it('should get a list of bicicletas', () => {
      const mockBicicletas: Bicicleta[] = []
      // Cria um array de bicicletas com os mesmos ids gerados anteriormente
      ids.forEach((id, i) => {
        mockBicicletas.push({
          id, modelo: `Modelo ${i + 1}`, marca: `Marca ${i + 1}`, ano: '2021', numero: i + 1, status: 'disponivel'
        })
      })
      mockBicicletas[2].status = 'em uso'
      const result = getBicicletas()
      expect(result).toEqual(mockBicicletas)
    })
  })

  describe('Model getBicicletaById', () => {
    it('should get the bicicleta with the given ID', () => {
      // Obtem o segundo id do array
      const queryId = 1
      const id = ids[queryId]
      const mockBicicletas: Bicicleta[] = []
      ids.forEach((id, i) => {
        mockBicicletas.push({
          id, modelo: `Modelo ${i + 1}`, marca: `Marca ${i + 1}`, ano: '2021', numero: i + 1, status: 'disponivel'
        })
      })
      const result = getBicicletaById(id)
      expect(result).toEqual(mockBicicletas[queryId])
    })
    it('should return undefined if bicicleta is not found', () => {
      const result = getBicicletaById(randomUUID())
      expect(result).toBeUndefined()
    })
  })

  describe('Model createBicicleta', () => {
    it('should create a new bicicleta', () => {
      const id = randomUUID()
      const mockBicicleta = { id, modelo: 'Modelo 1', marca: 'Marca 1', ano: '2021', numero: 1, status: 'disponivel' }
      createBicicleta(mockBicicleta)
      const result = getBicicletaById(id)
      expect(result).toEqual(mockBicicleta)
    })
  })

  describe('Model updateBicicleta', () => {
    it('should update the bicicleta with the given ID if found', () => {
      const id = ids[0]
      const mockBicicleta = { id, modelo: 'Modelo X', marca: 'Marca X', ano: '2021', numero: 0, status: 'disponivel' }
      const changed = updateBicicleta(id, mockBicicleta)
      const result = getBicicletaById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockBicicleta)
    })
    it('should ensure that nothing changed if bicicleta is not found', () => {
      const id = randomUUID()
      const mockBicicleta = { id, modelo: 'Modelo X', marca: 'Marca X', ano: '2021', numero: 0, status: 'disponivel' }
      const changed = updateBicicleta(id, mockBicicleta)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteBicicleta', () => {
    it('should delete the bicicleta with the given ID if found', () => {
      const id = ids[0]
      const changed = deleteBicicleta(id)
      const result = getBicicletaById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if bicicleta is not found', () => {
      const id = randomUUID()
      const changed = deleteBicicleta(id)
      expect(changed).toBe(false)
    })
  })
})
