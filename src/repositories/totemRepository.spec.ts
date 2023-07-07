import {
  getTotens,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem
} from './totemRepository'
import { Totem } from '../models/totemModel'
import { db } from '../db'

const mockFrom = {
  url: new URL('http://localhost:3000'),
  headers: {},
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis()
}

const totemGen = (id: number): Totem => ({
  id,
  descricao: `Descrição ${id}`,
  localizacao: `Localização ${id}`
})

describe('Repository totemRepository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('Repository getTotens', () => {
    it('should get a list of totens', async () => {
      const testTotens: Totem[] = [totemGen(1), totemGen(2), totemGen(3)]
      const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: testTotens, error: null }) }
      jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
      const result = await getTotens() // as Array<{ id: number, localizacao: string, descricao: string }>
      expect(result[0].id).toEqual(1)
      expect(result[result.length - 1].id).toEqual(testTotens[testTotens.length - 1].id)
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
        await getTotens()
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository getTotemById', () => {
    it('should get a totem by id', async () => {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        eq: jest.fn().mockReturnValue({ data: [testTotem], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await getTotemById(1)
      expect(mock.eq).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(testTotem)
    })

    it('should throw an error if totem is not found', async () => {
      try {
        const mock = { ...mockFrom, eq: jest.fn().mockReturnValue({ data: [], error: null }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getTotemById(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Totem não encontrado')
        } else {
          expect(true).toBe(false)
        }
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = {
          ...mockFrom,
          eq: jest.fn().mockReturnValue({
            data: null,
            error: {
              message: 'error XYZ'
            }
          })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getTotemById(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        else expect(true).toBe(false)
      }
    })
  })

  describe('Repository createTotem', () => {
    it('should create a totem', async () => {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [testTotem], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await createTotem(testTotem)
      expect(mock.insert).toHaveBeenCalledWith(testTotem)
      expect(result).toEqual(testTotem)
    })
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await createTotem(testTotem)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Erro no banco de dados: error XYZ')
      } else {
        expect(true).toBe(false)
      }
    }
  })
})

describe('Repository updateTotem', () => {
  it('should update a totem', async () => {
    const testTotem: Totem = totemGen(1)
    const mock = {
      ...mockFrom,
      select: jest.fn().mockReturnValue({ data: [{ ...testTotem, descricao: 'updated' }], error: null })
    }
    jest.spyOn(db, 'from').mockReturnValue(mock)
    const result = await updateTotem(1, { ...testTotem, descricao: 'updated' })
    expect(mock.update).toHaveBeenCalledWith({ ...testTotem, descricao: 'updated' })
    expect(result).toEqual({ ...testTotem, descricao: 'updated' })
  })

  it('should throw an error if totem is not found', async () => {
    try {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateTotem(1, testTotem)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Totem não encontrado')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateTotem(1, testTotem)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Erro no banco de dados: error XYZ')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  describe('Repository deleteTotem', () => {
    it('should delete a totem', async () => {
      const testTotem: Totem = totemGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [testTotem], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await deleteTotem(1)
      expect(mock.delete).toHaveBeenCalledWith()
    })

    it('should throw an error if totem is not found', async () => {
      try {
        const mock = {
          ...mockFrom,
          select: jest.fn().mockReturnValue({ data: [], error: null })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteTotem(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Totem não encontrado')
        } else {
          expect(true).toBe(false)
        }
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteTotem(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        } else {
          expect(true).toBe(false)
        }
      }
    })
  })
})
