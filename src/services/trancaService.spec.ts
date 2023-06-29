import * as TrancaService from './trancaService'
import * as TrancaRepository from '../repositories/trancaRepository'
import { Tranca } from '../models/trancaModel'
import { status } from '../enums/statusTrancaEnum'

describe('TrancaService', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getAllTrancas', () => {
    it('should return an array of trancas', async () => {
      const mockTrancas: Tranca[] = [
        {
          id: 1,
          anoDeFabricacao: '2020',
          modelo: 'Modelo 1',
          numero: 1,
          bicicletaId: 1,
          status: status.EM_USO,
          totemId: 1
        },
        {
          id: 2,
          anoDeFabricacao: '2022',
          modelo: 'Modelo 2',
          numero: 2,
          status: status.DISPONIVEL,
          totemId: 1
        }
      ]
      jest.spyOn(TrancaRepository, 'getTrancas').mockResolvedValue(mockTrancas)
      const result = await TrancaService.getAllTrancas()
      expect(result).toEqual(mockTrancas)
      expect(TrancaRepository.getTrancas).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving trancas'
      jest.spyOn(TrancaRepository, 'getTrancas').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.getAllTrancas()).rejects.toThrow(errorMessage)
      expect(TrancaRepository.getTrancas).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTrancaById', () => {
    it('should return the tranca with the given ID', async () => {
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2020',
        modelo: 'Modelo 1',
        numero: 1,
        bicicletaId: 1,
        status: status.EM_USO,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaById').mockResolvedValue(mockTranca)
      const result = await TrancaService.getTrancaById(Number(mockTranca.id))
      expect(result).toEqual(mockTranca)
      expect(TrancaRepository.getTrancaById).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving tranca'
      jest.spyOn(TrancaRepository, 'getTrancaById').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.getTrancaById(-1)).rejects.toThrow(errorMessage)
      expect(TrancaRepository.getTrancaById).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTrancaByBicicletaId', () => {
    it('should return the tranca with the given bicicleta ID', async () => {
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2020',
        modelo: 'Modelo 1',
        numero: 1,
        bicicletaId: 1,
        status: status.EM_USO,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaByBicicletaId').mockResolvedValue(mockTranca)
      const result = await TrancaService.getTrancaByBicicletaId(Number(mockTranca.bicicletaId))
      expect(result).toEqual(mockTranca)
      expect(TrancaRepository.getTrancaByBicicletaId).toHaveBeenCalledTimes(1)
    })

    it('should return null when repository returns null', async () => {
      jest.spyOn(TrancaRepository, 'getTrancaByBicicletaId').mockResolvedValue(null)
      const result = await TrancaService.getTrancaByBicicletaId(1)
      expect(result).toBeNull()
      expect(TrancaRepository.getTrancaByBicicletaId).toHaveBeenCalledTimes(1)
    })
  })

  describe('createTranca', () => {
    it('should create a new tranca', async () => {
      const mockTranca: Tranca = {
        anoDeFabricacao: '2020',
        modelo: 'Modelo X',
        numero: 0,
        status: status.NOVA,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'createTranca').mockResolvedValue(mockTranca)
      const result = await TrancaService.createTranca(mockTranca)
      expect(result).toEqual(mockTranca)
      expect(TrancaRepository.createTranca).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error creating tranca'
      const mockTranca: Tranca = {
        anoDeFabricacao: '2020',
        modelo: 'Modelo X',
        numero: 0,
        status: status.NOVA,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'createTranca').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.createTranca(mockTranca)).rejects.toThrow(errorMessage)
      expect(TrancaRepository.createTranca).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateTranca', () => {
    it('should update the tranca with the given ID', async () => {
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        bicicletaId: 1,
        status: status.EM_USO,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'updateTranca').mockResolvedValue(mockTranca)
      const result = await TrancaService.updateTranca(Number(mockTranca.id), mockTranca)
      expect(result).toEqual(mockTranca)
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error updating tranca'
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        bicicletaId: 1,
        status: status.EM_USO,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'updateTranca').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.updateTranca(Number(mockTranca.id), mockTranca)).rejects.toThrow(errorMessage)
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteTranca', () => {
    it('should delete a tranca and return true', async () => {
      const id = 1
      jest.spyOn(TrancaRepository, 'deleteTranca').mockResolvedValue(undefined)
      const result = await TrancaService.deleteTranca(id)
      expect(result).toBe(undefined)
      expect(TrancaRepository.deleteTranca).toHaveBeenCalledWith(id)
    })
    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error deleting tranca'
      const id = 1
      jest.spyOn(TrancaRepository, 'deleteTranca').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.deleteTranca(id)).rejects.toThrow(errorMessage)
      expect(TrancaRepository.deleteTranca).toHaveBeenCalledTimes(1)
    })
  })

  describe('insertBicicleta', () => {
    it('should insert a bicicleta into a tranca', async () => {
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaById').mockResolvedValue(mockTranca)
      jest.spyOn(TrancaRepository, 'updateTranca').mockResolvedValue({ ...mockTranca, bicicletaId: 1, status: status.EM_USO })
      const result = await TrancaService.insertBicicleta(Number(mockTranca.id), 1)
      expect(result).toEqual({ ...mockTranca, bicicletaId: 1, status: status.EM_USO })
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })
    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error inserting bicicleta'
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        bicicletaId: 1,
        status: status.EM_USO,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaById').mockResolvedValue(mockTranca)
      jest.spyOn(TrancaRepository, 'updateTranca').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.insertBicicleta(Number(mockTranca.id), 1)).rejects.toThrow(errorMessage)
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })
  })

  describe('removeBicicleta', () => {
    it('should remove a bicicleta from a tranca', async () => {
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        status: status.DISPONIVEL,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaById').mockResolvedValue({ ...mockTranca, bicicletaId: 1, status: status.EM_USO })
      jest.spyOn(TrancaRepository, 'updateTranca').mockResolvedValue(mockTranca)
      const result = await TrancaService.removeBicicleta(Number(mockTranca.id))
      expect(result).toEqual(mockTranca)
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })
    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error removing bicicleta'
      const mockTranca: Tranca = {
        id: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo X',
        numero: 1,
        status: status.DISPONIVEL,
        totemId: 1
      }
      jest.spyOn(TrancaRepository, 'getTrancaById').mockResolvedValue(mockTranca)
      jest.spyOn(TrancaRepository, 'updateTranca').mockRejectedValue(new Error(errorMessage))
      await expect(TrancaService.removeBicicleta(Number(mockTranca.id))).rejects.toThrow(errorMessage)
      expect(TrancaRepository.updateTranca).toHaveBeenCalledTimes(1)
    })
  })
})
