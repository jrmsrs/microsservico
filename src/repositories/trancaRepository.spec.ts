import {
  getTrancas,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca
} from './trancaRepository'
import { status } from '../enums/statusTrancaEnum'

const testExistentId = 5
const testNonExistentId = -1
const testExistentTotemId = 3

describe('Model trancaModel', () => {
  describe('Model getTrancas', () => {
    it('should get a list of trancas', async () => {
      const testTrancas: any[] = []
      for (let i = 0; i < 8; i++) {
        testTrancas.push({
          id: i + 1, modelo: `Modelo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      }
      const result = await getTrancas() as Array<{ id: number, modelo: string, anoDeFabricacao: string, numero: number }>
      expect(result[0].id).toEqual(testTrancas[0].id)
      expect(result[result.length - 1].id).toEqual(testTrancas[testTrancas.length - 1].id)
    })
  })

  describe('Model getTrancaById', () => {
    it('should get the tranca with the given ID', async () => {
      const testTranca = {
        id: testExistentId, modelo: `Modelo ${testExistentId}`, anoDeFabricacao: '2020', numero: testExistentId
      }
      const result = await getTrancaById(testExistentId)
      expect(result.id).toEqual(testTranca.id)
    })
    it('should throw an error if tranca is not found', async () => {
      try {
        await getTrancaById(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Model createTranca', () => {
    it('should create a new tranca', async () => {
      const testTranca = { modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: status.NOVA }
      const tranca = await createTranca(testTranca)
      const result = await getTrancaById(tranca.id ?? -1)
      expect(result).toEqual(testTranca)
    })
    it('should create a new bicicleta with id 1 if there are no bicicletas', async () => {
      const testTranca = { modelo: 'Modelo Y', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: status.NOVA }
      const result = await createTranca(testTranca, [])
      expect(result).toEqual({ ...testTranca, id: 1 })
    })
  })

  describe('Model updateTranca', () => {
    it('should update the tranca with the given ID if found', async () => {
      const testTranca = { testExistentId, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
      const result = await updateTranca(testExistentId, testTranca)
      expect(result).toEqual({ ...testTranca, id: testExistentId })
    })
    it('should throw an error if the tranca with the given ID is not found', async () => {
      try {
        const testTranca = { testNonExistentId, modelo: 'Modelo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
        await updateTranca(testNonExistentId, testTranca)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Tranca não encontrada') {
          expect(error.message).toBe('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Model deleteTranca', () => {
    it('should delete the tranca with the given ID if found', async () => {
      const result = await deleteTranca(testExistentId)
      expect(result).toBeUndefined()
    })
    it('should throw an error if the tranca with the given ID is not found', async () => {
      try {
        await deleteTranca(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Tranca não encontrada') {
          expect(error.message).toBe('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })
})
