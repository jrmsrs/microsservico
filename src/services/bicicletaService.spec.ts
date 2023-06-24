import * as BicicletaService from './bicicletaService'
import * as BicicletaRepository from '../repositories/bicicletaRepository'
import { Bicicleta } from '../repositories/bicicleta'
import { status } from '../enums/statusBicicletaEnum'

describe('BicicletaService', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getAllBicicletas', () => {
    it('should return an array of bicicletas', async () => {
      const mockBicicletas: Bicicleta[] = [
        {
          id: 1,
          ano: '2021',
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          status: status.DISPONIVEL
        },
        {
          id: 2,
          ano: '2022',
          modelo: 'Modelo 2',
          marca: 'Marca 2',
          numero: 2,
          status: status.EM_USO
        }
      ]
      jest.spyOn(BicicletaRepository, 'getBicicletas').mockResolvedValue(mockBicicletas)
      const result = await BicicletaService.getAllBicicletas()
      expect(result).toEqual(mockBicicletas)
      expect(BicicletaRepository.getBicicletas).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving bicicletas'
      jest.spyOn(BicicletaRepository, 'getBicicletas').mockRejectedValue(new Error(errorMessage))
      await expect(BicicletaService.getAllBicicletas()).rejects.toThrow(errorMessage)
      expect(BicicletaRepository.getBicicletas).toHaveBeenCalledTimes(1)
    })
  })

  describe('getBicicletaById', () => {
    it('should return the bicicleta with the given ID', async () => {
      const mockBicicleta: Bicicleta = {
        id: 1,
        ano: '2021',
        modelo: 'Modelo 1',
        marca: 'Marca 1',
        numero: 1,
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaRepository, 'getBicicletaById').mockResolvedValue(mockBicicleta)
      const result = await BicicletaService.getBicicletaById(Number(mockBicicleta.id))
      expect(result).toEqual(mockBicicleta)
      expect(BicicletaRepository.getBicicletaById).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving bicicleta'
      jest.spyOn(BicicletaRepository, 'getBicicletaById').mockRejectedValue(new Error(errorMessage))
      await expect(BicicletaService.getBicicletaById(-1)).rejects.toThrow(errorMessage)
      expect(BicicletaRepository.getBicicletaById).toHaveBeenCalledTimes(1)
    })
  })

  describe('createBicicleta', () => {
    it('should create a new bicicleta', async () => {
      const mockBicicleta: Bicicleta = {
        ano: '2021',
        modelo: 'Modelo X',
        marca: 'Marca X',
        numero: 1,
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaRepository, 'createBicicleta').mockResolvedValue(mockBicicleta)
      const result = await BicicletaService.createBicicleta(mockBicicleta)
      expect(result).toEqual(mockBicicleta)
      expect(BicicletaRepository.createBicicleta).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error creating bicicleta'
      const mockBicicleta: Bicicleta = {
        ano: '2021',
        modelo: 'Modelo X',
        marca: 'Marca X',
        numero: 1,
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaRepository, 'createBicicleta').mockRejectedValue(new Error(errorMessage))
      await expect(BicicletaService.createBicicleta(mockBicicleta)).rejects.toThrow(errorMessage)
      expect(BicicletaRepository.createBicicleta).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateBicicleta', () => {
    it('should update the bicicleta with the given ID', async () => {
      const mockBicicleta: Bicicleta = {
        id: 1,
        ano: '2021',
        modelo: 'Modelo X',
        marca: 'Marca X',
        numero: 1,
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaRepository, 'updateBicicleta').mockResolvedValue(mockBicicleta)
      const result = await BicicletaService.updateBicicleta(Number(mockBicicleta.id), mockBicicleta)
      expect(result).toEqual(mockBicicleta)
      expect(BicicletaRepository.updateBicicleta).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error updating bicicleta'
      const mockBicicleta: Bicicleta = {
        id: 1,
        ano: '2021',
        modelo: 'Modelo X',
        marca: 'Marca X',
        numero: 1,
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaRepository, 'updateBicicleta').mockRejectedValue(new Error(errorMessage))
      await expect(BicicletaService.updateBicicleta(Number(mockBicicleta.id), mockBicicleta)).rejects.toThrow(errorMessage)
      expect(BicicletaRepository.updateBicicleta).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteBicicleta', () => {
    it('should delete a bicicleta and return true', async () => {
      const id = 1

      jest.spyOn(BicicletaRepository, 'deleteBicicleta').mockResolvedValue(undefined)
      const result = await BicicletaService.deleteBicicleta(id)

      expect(result).toBe(undefined)
      expect(BicicletaRepository.deleteBicicleta).toHaveBeenCalledWith(id)
    })
    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error deleting bicicleta'
      const id = 1

      jest.spyOn(BicicletaRepository, 'deleteBicicleta').mockRejectedValue(new Error(errorMessage))
      await expect(BicicletaService.deleteBicicleta(id)).rejects.toThrow(errorMessage)
      expect(BicicletaRepository.deleteBicicleta).toHaveBeenCalledTimes(1)
    })
  })
})
