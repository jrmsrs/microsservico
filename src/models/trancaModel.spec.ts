import { UUID, randomUUID } from 'crypto'
import {
  getTrancas,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca
} from './trancaModel'

describe('Model trancaModel', () => {
  const ids = [
    '053ff8fb-d059-4fa6-986c-f1ffe42da046',
    '35a371ed-8bb7-4b30-8f4f-310f31c3f576',
    '6100f40d-5d5d-4178-85ba-4c8cc6be002b',
    '227d3473-bee0-46a9-a91d-fca2f7025793',
    'e241cbb1-40a5-4c46-b0eb-91e010deffe0',
    'e8938732-7114-4b50-9f59-b9bb07b1f875',
    '9de164a3-d852-465d-a49f-83bdcdb05b08'
  ] as UUID[]

  const existentTotemId = '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6' as UUID

  describe('Model getTrancas', () => {
    it('should get a list of trancas', () => {
      const mockTrancas: any[] = []
      // Cria um array de trancas com os mesmos ids gerados anteriormente
      ids.forEach((id, i) => {
        mockTrancas.push({
          id, modelo: `Modelo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      })
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
      // Obtem o segundo id do array
      const queryId = 1
      const id = ids[queryId]
      const mockTrancas: any[] = []
      ids.forEach((id, i) => {
        mockTrancas.push({
          id, modelo: `Modelo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      })
      const result = getTrancaById(id) as any
      delete result.totemId
      delete result.bicicletaId
      delete result.status
      expect(result).toEqual(mockTrancas[queryId])
    })
    it('should return undefined if tranca is not found', () => {
      const result = getTrancaById(randomUUID())
      expect(result).toBeUndefined()
    })
  })

  describe('Model createTranca', () => {
    it('should create a new tranca', () => {
      const id = randomUUID()
      const mockTranca = { id, modelo: 'Modelo 1', totemId: existentTotemId, anoDeFabricacao: '2021', numero: 1, status: 'disponivel' }
      createTranca(mockTranca)
      const result = getTrancaById(id)
      expect(result).toEqual(mockTranca)
    })
  })

  describe('Model updateTranca', () => {
    it('should update the tranca with the given ID if found', () => {
      const id = ids[0]
      const mockTranca = { id, modelo: 'Modelo X', totemId: existentTotemId, anoDeFabricacao: '2021', numero: 9, status: 'disponivel' }
      const changed = updateTranca(id, mockTranca)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result).toEqual(mockTranca)
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = randomUUID()
      const mockTranca = { id, modelo: 'Modelo X', totemId: existentTotemId, anoDeFabricacao: '2021', numero: 9, status: 'disponivel' }
      const changed = updateTranca(id, mockTranca)
      expect(changed).toBe(false)
    })
  })

  describe('Model deleteTranca', () => {
    it('should delete the tranca with the given ID if found', () => {
      const id = ids[0]
      const changed = deleteTranca(id)
      const result = getTrancaById(id)
      expect(changed).toBe(true)
      expect(result).toBeUndefined()
    })
    it('should ensure that nothing changed if tranca is not found', () => {
      const id = randomUUID()
      const changed = deleteTranca(id)
      expect(changed).toBe(false)
    })
  })
})
