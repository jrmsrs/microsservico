import * as TrancaRepository from './trancaRepository'
import { status } from '../enums/statusTrancaEnum'

const testExistentId = 5
const testNonExistentId = -1
const testExistentTotemId = 3

describe('Repository trancaRepository', () => {
  describe('Repository getTrancas', () => {
    it('should get a list of trancas', async () => {
      const testTrancas: any[] = []
      for (let i = 0; i < 8; i++) {
        testTrancas.push({
          id: i + 1, modelo: `Repositoryo ${i + 1}`, anoDeFabricacao: '2020', numero: i + 1
        })
      }
      const result = await TrancaRepository.getTrancas() as Array<{ id: number, modelo: string, anoDeFabricacao: string, numero: number }>
      expect(result[0].id).toEqual(testTrancas[0].id)
      expect(result[result.length - 1].id).toEqual(testTrancas[testTrancas.length - 1].id)
    })
  })

  describe('Repository getTrancaById', () => {
    it('should get the tranca with the given ID', async () => {
      const testTranca = {
        id: testExistentId, modelo: `Repositoryo ${testExistentId}`, anoDeFabricacao: '2020', numero: testExistentId
      }
      const result = await TrancaRepository.getTrancaById(testExistentId)
      expect(result.id).toEqual(testTranca.id)
    })
    it('should throw an error if tranca is not found', async () => {
      try {
        await TrancaRepository.getTrancaById(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository getTrancaByBicicletaId', () => {
    it('should get the tranca with the given bicicleta ID', async () => {
      const testTranca = {
        id: 1, modelo: 'Repositoryo 1', anoDeFabricacao: '2020', numero: 1
      }
      const result = await TrancaRepository.getTrancaByBicicletaId(1)
      if (result === null) expect(true).toBe(false)
      else {
        expect(result.id).toEqual(testTranca.id)
      }
    })
    it('should return null if tranca is not found', async () => {
      const result = await TrancaRepository.getTrancaByBicicletaId(testNonExistentId)
      expect(result).toBeNull()
    })
  })

  describe('Repository createTranca', () => {
    it('should create a new tranca', async () => {
      const testTranca = { modelo: 'Repositoryo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: status.NOVA }
      const tranca = await TrancaRepository.createTranca(testTranca)
      const result = await TrancaRepository.getTrancaById(tranca.id ?? -1)
      expect(result).toEqual(testTranca)
    })
    it('should create a new bicicleta with id 1 if there are no bicicletas', async () => {
      const testTranca = { modelo: 'Repositoryo Y', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 1, status: status.NOVA }
      const result = await TrancaRepository.createTranca(testTranca, [])
      expect(result).toEqual({ ...testTranca, id: 1 })
    })
  })

  describe('Repository updateTranca', () => {
    it('should update the tranca with the given ID if found', async () => {
      const testTranca = { testExistentId, modelo: 'Repositoryo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
      const result = await TrancaRepository.updateTranca(testExistentId, testTranca)
      expect(result).toEqual({ ...testTranca, id: testExistentId })
    })
    it('should throw an error if the tranca with the given ID is not found', async () => {
      try {
        const testTranca = { testNonExistentId, modelo: 'Repositoryo X', totemId: testExistentTotemId, anoDeFabricacao: '2021', numero: 9, status: status.DISPONIVEL }
        await TrancaRepository.updateTranca(testNonExistentId, testTranca)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Tranca não encontrada') {
          expect(error.message).toBe('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository deleteTranca', () => {
    it('should delete the tranca with the given ID if found', async () => {
      const result = await TrancaRepository.deleteTranca(testExistentId)
      expect(result).toBeUndefined()
    })
    it('should throw an error if the tranca with the given ID is not found', async () => {
      try {
        await TrancaRepository.deleteTranca(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Tranca não encontrada') {
          expect(error.message).toBe('Tranca não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })
})
