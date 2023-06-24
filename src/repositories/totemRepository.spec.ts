import {
  getTotens,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem
} from './totemRepository'

const testExistentId = 3
const testNonExistentId = -1

describe('Model totemModel', () => {
  describe('Model getTotens', () => {
    it('should get a list of totens', async () => {
      const testTotens: any[] = []
      for (let i = 0; i < 3; i++) {
        testTotens.push({
          id: i + 1, localizacao: `Localização ${i + 1}`, descricao: `Descrição ${i + 1}`
        })
      }
      const result = await getTotens() as Array<{ id: number, localizacao: string, descricao: string }>
      expect(result[0].id).toEqual(testTotens[0].id)
      expect(result[result.length - 1].id).toEqual(testTotens[testTotens.length - 1].id)
    })
  })

  describe('Model getTotemById', () => {
    it('should get the totem with the given ID', async () => {
      const testTotens = {
        id: testExistentId, localizacao: `Localização ${testExistentId}`, descricao: `Descrição ${testExistentId}`
      }
      const result = await getTotemById(testExistentId)
      expect(result.id).toEqual(testTotens.id)
    })
    it('should throw an error if totem is not found', async () => {
      try {
        await getTotemById(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Totem não encontrado')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Model createTotem', () => {
    it('should create a new totem', async () => {
      const testTotem = { localizacao: 'Localização X', descricao: 'Descrição X' }
      const totem = await createTotem(testTotem)
      const result = await getTotemById(totem.id ?? -1)
      expect(result).toEqual(testTotem)
    })
    it('should create a new totem with id 1 if there are no totens', async () => {
      const testTotem = { localizacao: 'Localização Y', descricao: 'Descrição Y' }
      const result = await createTotem(testTotem, [])
      expect(result).toEqual({ ...testTotem, id: 1 })
    })
  })

  describe('Model updateTotem', () => {
    it('should update the totem with the given ID if found', async () => {
      const testTotem = { testExistentId, localizacao: 'Localização X', descricao: 'Descrição X' }
      const result = await updateTotem(testExistentId, testTotem)
      expect(result).toEqual({ ...testTotem, id: testExistentId })
    })
    it('should throw an error if the totem with the given ID is not found', async () => {
      try {
        const testTotem = { testNonExistentId, localizacao: 'Localização X', descricao: 'Descrição X' }
        await updateTotem(testNonExistentId, testTotem)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Totem não encontrado') {
          expect(error.message).toBe('Totem não encontrado')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Model deleteTotem', () => {
    it('should delete the totem with the given ID if found', async () => {
      const result = await deleteTotem(testExistentId)
      expect(result).toBeUndefined()
    })
    it('should throw an error if the totem with the given ID is not found', async () => {
      try {
        await deleteTotem(testNonExistentId)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error && error.message === 'Totem não encontrado') {
          expect(error.message).toBe('Totem não encontrado')
        } else expect(true).toBe(false)
      }
    })
  })
})
