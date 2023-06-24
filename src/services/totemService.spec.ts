import * as TotemService from './totemService'
import * as TotemRepository from '../repositories/totemRepository'
import { Totem } from '../repositories/totem'

describe('TotemService', () => {
  afterEach(() => {
    jest.restoreAllMocks()
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
})