import * as TotemService from './totemService'
import * as TotemRepository from '../repositories/totemRepository'
import * as TrancaRepository from '../repositories/trancaRepository'
import * as BicicletaRepository from '../repositories/bicicletaRepository'
import { Totem } from '../models/totemModel'

describe('TotemService', () => {
  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  describe('getAllTotems', () => {
    it('should return an array of totens', async () => {
      const mockTotens: Totem[] = [
        {
          id: 1,
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        },
        {
          id: 2,
          localizacao: 'Localização 2',
          descricao: 'Descrição 2'
        }
      ]
      jest.spyOn(TotemRepository, 'getTotens').mockResolvedValue(mockTotens)
      const result = await TotemService.getAllTotems()
      expect(result).toEqual(mockTotens)
      expect(TotemRepository.getTotens).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving totens'
      jest.spyOn(TotemRepository, 'getTotens').mockRejectedValue(new Error(errorMessage))
      await expect(TotemService.getAllTotems()).rejects.toThrow(errorMessage)
      expect(TotemRepository.getTotens).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTotemById', () => {
    it('should return the totem with the given ID', async () => {
      const mockTotem: Totem = {
        id: 1,
        localizacao: 'Localização 1',
        descricao: 'Descrição 1'
      }
      jest.spyOn(TotemRepository, 'getTotemById').mockResolvedValue(mockTotem)
      const result = await TotemService.getTotemById(Number(mockTotem.id))
      expect(result).toEqual(mockTotem)
      expect(TotemRepository.getTotemById).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error retrieving totem'
      jest.spyOn(TotemRepository, 'getTotemById').mockRejectedValue(new Error(errorMessage))
      await expect(TotemService.getTotemById(-1)).rejects.toThrow(errorMessage)
      expect(TotemRepository.getTotemById).toHaveBeenCalledTimes(1)
    })
  })

  describe('createTotem', () => {
    it('should create a new totem', async () => {
      const mockTotem: Totem = {
        localizacao: 'Localização X',
        descricao: 'Descrição X'
      }
      jest.spyOn(TotemRepository, 'createTotem').mockResolvedValue(mockTotem)
      const result = await TotemService.createTotem(mockTotem)
      expect(result).toEqual(mockTotem)
      expect(TotemRepository.createTotem).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error creating totem'
      const mockTotem: Totem = {
        localizacao: 'Localização X',
        descricao: 'Descrição X'
      }
      jest.spyOn(TotemRepository, 'createTotem').mockRejectedValue(new Error(errorMessage))
      await expect(TotemService.createTotem(mockTotem)).rejects.toThrow(errorMessage)
      expect(TotemRepository.createTotem).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateTotem', () => {
    it('should update the totem with the given ID', async () => {
      const mockTotem: Totem = {
        id: 1,
        localizacao: 'Localização X',
        descricao: 'Descrição X'
      }
      jest.spyOn(TotemRepository, 'updateTotem').mockResolvedValue(mockTotem)
      const result = await TotemService.updateTotem(Number(mockTotem.id), mockTotem)
      expect(result).toEqual(mockTotem)
      expect(TotemRepository.updateTotem).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error updating totem'
      const mockTotem: Totem = {
        id: 1,
        localizacao: 'Localização X',
        descricao: 'Descrição X'
      }
      jest.spyOn(TotemRepository, 'updateTotem').mockRejectedValue(new Error(errorMessage))
      await expect(TotemService.updateTotem(Number(mockTotem.id), mockTotem)).rejects.toThrow(errorMessage)
      expect(TotemRepository.updateTotem).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteTotem', () => {
    it('should delete a totem and return true', async () => {
      const id = 1

      jest.spyOn(TotemRepository, 'deleteTotem').mockResolvedValue(undefined)
      const result = await TotemService.deleteTotem(id)

      expect(result).toBe(undefined)
      expect(TotemRepository.deleteTotem).toHaveBeenCalledWith(id)
    })
    it('should throw an error when repository throws an error', async () => {
      const errorMessage = 'Error deleting totem'
      const id = 1

      jest.spyOn(TotemRepository, 'deleteTotem').mockRejectedValue(new Error(errorMessage))
      await expect(TotemService.deleteTotem(id)).rejects.toThrow(errorMessage)
      expect(TotemRepository.deleteTotem).toHaveBeenCalledTimes(1)
    })
  })

  describe('getAllTrancas', () => {
    it('should return an array of trancas of the same totem', async () => {
      const mockTrancas = [
        {
          id: 1,
          numero: 1,
          anoDeFabricacao: '2023',
          modelo: 'Modelo 1',
          totemId: 1
        },
        {
          id: 2,
          numero: 2,
          anoDeFabricacao: '2023',
          modelo: 'Modelo 2',
          totemId: 1
        }
      ]
      jest.spyOn(TrancaRepository, 'getTrancas').mockResolvedValue(mockTrancas)
      const result = await TotemService.getAllTrancas(1)
      expect(result).toEqual(mockTrancas)
      const resultEmpty = await TotemService.getAllTrancas(2)
      expect(resultEmpty).toEqual([])
    })
  })

  describe('getAllBicicletas', () => {
    it('should return an array of bicicletas of the same totem', async () => {
      const mockBicicletas = [
        {
          id: 1,
          numero: 1,
          marca: 'Marca 1',
          modelo: 'Modelo 1',
          ano: '2023',
          status: 'Disponível'
        },
        {
          id: 2,
          numero: 2,
          marca: 'Marca 2',
          modelo: 'Modelo 2',
          ano: '2023',
          status: 'Disponível'
        }
      ]
      jest.spyOn(BicicletaRepository, 'getBicicletas').mockResolvedValue(mockBicicletas)
      const result = await TotemService.getAllBicicletas(1)
      expect(result).toEqual(mockBicicletas)
      const resultEmpty = await TotemService.getAllBicicletas(2)
      expect(resultEmpty).toEqual([])
    })
  })
})
