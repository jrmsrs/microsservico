import { status } from '../enums/statusBicicletaEnum'

import * as BicicletaRepository from './bicicletaRepository'

const testExistentId = 3
const testNonExistentId = -1

describe('Repository bicicletaRepository', () => {
  describe('Repository getBicicletas', () => {
    it('should get a list of bicicletas', async () => {
      const testBicicletas: any[] = []
      for (let i = 0; i < 5; i++) {
        testBicicletas.push({
          id: i + 1, marca: `Marca ${i + 1}`, modelo: `Repositoryo ${i + 1}`
        })
      }
      const result = await BicicletaRepository.getBicicletas()
      expect(result[0].id).toEqual(testBicicletas[0].id)
      expect(result[result.length - 1].id).toEqual(testBicicletas[testBicicletas.length - 1].id)
    })
  })

  describe('Repository getBicicletaById', () => {
    it('should get the bicicleta with the given ID', async () => {
      const testBicicleta = {
        id: testExistentId, marca: `Marca ${testExistentId}`, modelo: `Repositoryo ${testExistentId}`
      }
      const result = await BicicletaRepository.getBicicletaById(testExistentId)
      expect(result.id).toEqual(testBicicleta.id)
    })
    it('should throw an error if bicicleta is not found', async () => {
      try {
        await BicicletaRepository.getBicicletaById(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Bicicleta não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository createBicicleta', () => {
    it('should create a new bicicleta', async () => {
      const testBicicleta = { marca: 'Marca X', modelo: 'Descrição X', ano: '2021', numero: 0, status: status.NOVA }
      const result = await BicicletaRepository.createBicicleta(testBicicleta)
      expect(result).toEqual(testBicicleta)
    })
    it('should create a new bicicleta with id 1 if there are no bicicletas', async () => {
      const testBicicleta = { marca: 'Marca Y', modelo: 'Descrição Y', ano: '2021', numero: 0, status: status.NOVA }
      const result = await BicicletaRepository.createBicicleta(testBicicleta, [])
      expect(result).toEqual({ ...testBicicleta, id: 1 })
    })
  })

  describe('Repository updateBicicleta', () => {
    it('should update the bicicleta with the given ID if found', async () => {
      const testBicicleta = { testExistentId, marca: 'Marca X', modelo: 'Descrição X', ano: '2021', numero: 1, status: 'Disponível' }
      const result = await BicicletaRepository.updateBicicleta(testExistentId, testBicicleta)
      expect(result).toEqual({ ...testBicicleta, id: testExistentId })
    })
    it('should throw an error if the bicicleta with the given ID is not found', async () => {
      try {
        const testBicicleta = { testNonExistentId, marca: 'Marca X', modelo: 'Descrição X', ano: '2021', numero: 1, status: 'Disponível' }
        await BicicletaRepository.updateBicicleta(testNonExistentId, testBicicleta)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Bicicleta não encontrada') {
          expect(error.message).toBe('Bicicleta não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository deleteBicicleta', () => {
    it('should delete the bicicleta with the given ID if found', async () => {
      const result = await BicicletaRepository.deleteBicicleta(testExistentId)
      expect(result).toBeUndefined()
    })
    it('should throw an error if the bicicleta with the given ID is not found', async () => {
      try {
        await BicicletaRepository.deleteBicicleta(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Bicicleta não encontrada') {
          expect(error.message).toBe('Bicicleta não encontrada')
        } else expect(true).toBe(false)
      }
    })
  })
})
