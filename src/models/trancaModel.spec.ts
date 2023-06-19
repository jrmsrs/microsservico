import {
  getTrancas,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca,
  insertBicicleta,
  removeBicicleta
} from './trancaModel'
import { status } from '../enums/statusTrancaEnum'

const testExistentId = 5
const testNonExistentId = -1
const testExistentTotemId = 3
const testFreeTrancaId = 4
const testExistentBicicletaId = 3
const testNonExistentBicicletaId = -1

describe('Model trancaModel', () => {
  describe('Model getTrancas', () => {
    it('should get a list of trancas', () => {
      const mockTrancas: any[] = []
      // Cria um array de trancas com os mesmos ids gerados anteriormente
      for (let i = 0; i < 7; i++) {
        mockTrancas.push({
          id: i + 1, modelo: `Modelo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      }
      const result = getTrancas() as any[]
      result.forEach((res) => {
        delete res.totemId
        delete res.bicicletaId
        delete res.status
      })
      expect(result).toEqual(mockTrancas)
    })
  })

  describe('Model getTrancaById', () => {
    it('should get the tranca with the given ID', () => {
      const mockTrancas: any[] = []
      for (let i = 0; i < 7; i++) {
        mockTrancas.push({
          id: i + 1, modelo: `Modelo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      }
      const result = getTrancaById(testExistentId) as any
      delete result.totemId
      delete result.bicicletaId
      delete result.status
      expect(result).toEqual(mockTrancas[testExistentId - 1])
    })
    it('should return undefined if tranca is not found', () => {
      const result = getTrancaById(testNonExistentId)
      expect(result).toBeUndefined()
    })
  })

  describe('Model createTranca', () => {
    it('should create a new tranca', () => {
      const mockTranca = { modelo: 'Modelo 1', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: status.DISPONIVEL }
      const id = createTranca(mockTranca)
      const result = getTrancaById(id)
      expect(result).toEqual(mockTranca)
    })
  })

  describe('Model updateTranca', () => {
    it('should update the tranca with the given ID if found', () => {
      const id = testExistentId
      const mockTranca = { id, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
      const changed = updateTranca(id, mockTranca)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockTranca)
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = testNonExistentId
      const mockTranca = { id, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
      const changed = updateTranca(id, mockTranca)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteTranca', () => {
    it('should delete the tranca with the given ID if found', () => {
      const id = testExistentId
      const changed = deleteTranca(id)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = testNonExistentId
      const changed = deleteTranca(id)
      expect(changed).toBe(false)
    })
  })

  describe('Model insertBicicleta', () => {
    it('should insert a bicicleta into the tranca with the given ID if found', () => {
      const id = testFreeTrancaId
      const changed = insertBicicleta(testFreeTrancaId, testExistentBicicletaId)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result?.bicicletaId).toBe(testExistentBicicletaId)
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = testNonExistentId
      const changed = insertBicicleta(id, testExistentBicicletaId)
      expect(changed).toBe(false)
    })
    it('should ensure that nothing changed if bicicleta is not found', () => {
      const id = testExistentId
      const changed = insertBicicleta(id, testNonExistentBicicletaId)
      expect(changed).toBe(false)
    })
  })

  describe('Model removeBicicleta', () => {
    it('should remove a bicicleta from the tranca with the given ID if found', () => {
      const id = 1
      const changed = removeBicicleta(id)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result?.bicicletaId).toBeUndefined()
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = testNonExistentId
      const changed = removeBicicleta(id)
      expect(changed).toBe(false)
    })
  })
})
