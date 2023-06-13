import { UUID, randomUUID } from 'crypto'
import {
  getTotens,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem
} from './totemModel'
import type { Totem } from './totemModel.d'

describe('Model totemModel', () => {
  const ids = [
    '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f',
    '859f074e-e02e-427d-be61-8d87129c1bbd'
  ] as UUID[]

  describe('Model getTotens', () => {
    it('should get a list of totens', () => {
      const mockTotens: Totem[] = []
      // Cria um array de totens com os mesmos ids gerados anteriormente
      ids.forEach((id, i) => {
        mockTotens.push({
          id, descricao: `Descrição ${i + 1}`, localizacao: `Localização ${i + 1}`
        })
      })
      const result = getTotens()
      expect(result).toEqual(mockTotens)
    })
  })

  describe('Model getTotemById', () => {
    it('should get the totem with the given ID', () => {
      // Obtem o segundo id do array
      const queryId = 1
      const id = ids[queryId]
      const mockTotens: Totem[] = []
      ids.forEach((id, i) => {
        mockTotens.push({
          id, descricao: `Descrição ${i + 1}`, localizacao: `Localização ${i + 1}`
        })
      })
      const result = getTotemById(id)
      expect(result).toEqual(mockTotens[queryId])
    })
    it('should return undefined if totem is not found', () => {
      const result = getTotemById(randomUUID())
      expect(result).toBeUndefined()
    })
  })

  describe('Model createTotem', () => {
    it('should create a new totem', () => {
      const id = randomUUID()
      const mockTotem = { id, descricao: 'Descrição 1', localizacao: 'Localização 1' }
      createTotem(mockTotem)
      const result = getTotemById(id)
      expect(result).toEqual(mockTotem)
    })
  })

  describe('Model updateTotem', () => {
    it('should update the totem with the given ID if found', () => {
      const id = ids[0]
      const mockTotem = { id, descricao: 'Descrição X', localizacao: 'Localização X' }
      const changed = updateTotem(id, mockTotem)
      const result = getTotemById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockTotem)
    })
    it('should ensure that nothing changed if totem is not found', () => {
      const id = randomUUID()
      const mockTotem = { id, descricao: 'Descrição X', localizacao: 'Localização X' }
      const changed = updateTotem(id, mockTotem)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteTotem', () => {
    it('should delete the totem with the given ID if found', () => {
      const id = ids[0]
      const changed = deleteTotem(id)
      const result = getTotemById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if totem is not found', () => {
      const id = randomUUID()
      const changed = deleteTotem(id)
      expect(changed).toBe(false)
    })
  })
})
