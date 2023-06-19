import {
  getBicicletas,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
} from './bicicletaModel'
import type { Bicicleta } from './bicicletaModel.d'
import { status } from '../enums/statusBicicletaEnum'

const testExistentId = 2
const testNonExistentId = -1

describe('Model bicicletaModel', () => {
  describe('Model getBicicletas', () => {
    it('should get a list of bicicletas', () => {
      const mockBicicletas: Bicicleta[] = []
      // Cria um array de bicicletas com os mesmos ids gerados anteriormente
      for (let i = 0; i < 4; i++) {
        mockBicicletas.push({
          id: i + 1, modelo: `Modelo ${i + 1}`, marca: `Marca ${i + 1}`, ano: '2021', numero: i + 1, status: status.DISPONIVEL
        })
      }
      mockBicicletas[2].status = status.EM_USO
      mockBicicletas[3].status = status.NOVA
      const result = getBicicletas()
      expect(result).toEqual(mockBicicletas)
    })
  })

  describe('Model getBicicletaById', () => {
    it('should get the bicicleta with the given ID', () => {
      const mockBicicletas: Bicicleta[] = []
      for (let i = 0; i < 3; i++) {
        mockBicicletas.push({
          id: i + 1, modelo: `Modelo ${i + 1}`, marca: `Marca ${i + 1}`, ano: '2021', numero: i + 1, status: status.DISPONIVEL
        })
      }
      const result = getBicicletaById(testExistentId)
      expect(result).toEqual(mockBicicletas[testExistentId - 1])
    })
    it('should return undefined if bicicleta is not found', () => {
      const result = getBicicletaById(-1)
      expect(result).toBeUndefined()
    })
  })

  describe('Model createBicicleta', () => {
    it('should create a new bicicleta', () => {
      const mockBicicleta = { modelo: 'Modelo 1', marca: 'Marca 1', ano: '2021', numero: 1, status: status.DISPONIVEL }
      const id = createBicicleta(mockBicicleta)
      const result = getBicicletaById(id)
      expect(result).toEqual(mockBicicleta)
    })
  })

  describe('Model updateBicicleta', () => {
    it('should update the bicicleta with the given ID if found', () => {
      const id = testExistentId
      const mockBicicleta = { id, modelo: 'Modelo X', marca: 'Marca X', ano: '2021', numero: 0, status: status.DISPONIVEL }
      const changed = updateBicicleta(id, mockBicicleta)
      const result = getBicicletaById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockBicicleta)
    })
    it('should ensure that nothing changed if bicicleta is not found', () => {
      const id = testNonExistentId
      const mockBicicleta = { id, modelo: 'Modelo X', marca: 'Marca X', ano: '2021', numero: 0, status: status.DISPONIVEL }
      const changed = updateBicicleta(id, mockBicicleta)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteBicicleta', () => {
    it('should delete the bicicleta with the given ID if found', () => {
      const id = testExistentId
      const changed = deleteBicicleta(id)
      const result = getBicicletaById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if bicicleta is not found', () => {
      const id = testNonExistentId
      const changed = deleteBicicleta(id)
      expect(changed).toBe(false)
    })
  })
})
