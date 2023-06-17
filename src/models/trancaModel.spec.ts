import {
  getTrancas,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca
} from './trancaModel'

const testExistentId = 5
const testNonExistentId = -1
const testExistentTotemId = 3

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
      const mockTranca = { modelo: 'Modelo 1', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: 'disponivel' }
      const id = createTranca(mockTranca)
      const result = getTrancaById(id)
      expect(result).toEqual(mockTranca)
    })
  })

  describe('Model updateTranca', () => {
    it('should update the tranca with the given ID if found', () => {
      const id = testExistentId
      const mockTranca = { id, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: 'disponivel' }
      const changed = updateTranca(id, mockTranca)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockTranca)
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = testNonExistentId
      const mockTranca = { id, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: 'disponivel' }
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
})
