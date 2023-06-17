import {
  getTotens,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem
} from './totemModel'
import type { Totem } from './totemModel.d'

const testExistentId = 2
const testNonExistentId = -1

describe('Model totemModel', () => {
  describe('Model getTotens', () => {
    it('should get a list of totens', () => {
      const mockTotens: Totem[] = []
      // Cria um array de totens com os mesmos ids gerados anteriormente
      for (let i = 0; i < 3; i++) {
        mockTotens.push({
          id: i + 1, descricao: `Descrição ${i + 1}`, localizacao: `Localização ${i + 1}`
        })
      }
      const result = getTotens()
      expect(result).toEqual(mockTotens)
    })
  })

  describe('Model getTotemById', () => {
    it('should get the totem with the given ID', () => {
      const mockTotens: Totem[] = []
      for (let i = 0; i < 3; i++) {
        mockTotens.push({
          id: i + 1, descricao: `Descrição ${i + 1}`, localizacao: `Localização ${i + 1}`
        })
      }
      const result = getTotemById(testExistentId)
      expect(result).toEqual(mockTotens[testExistentId - 1])
    })
    it('should return undefined if totem is not found', () => {
      const result = getTotemById(testNonExistentId)
      expect(result).toBeUndefined()
    })
  })

  describe('Model createTotem', () => {
    it('should create a new totem', () => {
      const mockTotem = { descricao: 'Descrição 1', localizacao: 'Localização 1' }
      const id = createTotem(mockTotem)
      const result = getTotemById(id)
      expect(result).toEqual(mockTotem)
    })
  })

  describe('Model updateTotem', () => {
    it('should update the totem with the given ID if found', () => {
      const id = testExistentId
      const mockTotem = { id, descricao: 'Descrição X', localizacao: 'Localização X' }
      const changed = updateTotem(id, mockTotem)
      const result = getTotemById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockTotem)
    })
    it('should ensure that nothing changed if totem is not found', () => {
      const id = testNonExistentId
      const mockTotem = { id, descricao: 'Descrição X', localizacao: 'Localização X' }
      const changed = updateTotem(id, mockTotem)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteTotem', () => {
    it('should delete the totem with the given ID if found', () => {
      const id = testExistentId
      const changed = deleteTotem(id)
      const result = getTotemById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if totem is not found', () => {
      const id = testNonExistentId
      const changed = deleteTotem(id)
      expect(changed).toBe(false)
    })
  })
})
