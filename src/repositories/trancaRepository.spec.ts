import {
  getTrancas,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca,
  getTrancaByBicicletaId
} from './trancaRepository'
import { Tranca } from '../models/trancaModel'
import { status } from '../enums/statusTrancaEnum'
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

const trancaGen = (id: number): Tranca => ({
  id,
  modelo: `modelo ${id}`,
  numero: id,
  anoDeFabricacao: '2021',
  status: status.DISPONIVEL
})

describe('Repository trancaRepository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('Repository getTrancas', () => {
    it('should get a list of trancas', async () => {
      const testTrancas: Tranca[] = [trancaGen(1), trancaGen(2), trancaGen(3)]
      const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: testTrancas, error: null }) }
      jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
      const result = await getTrancas() // as Array<{ id: number, localizacao: string, descricao: string }>
      expect(result[0].id).toEqual(1)
      expect(result[result.length - 1].id).toEqual(testTrancas[testTrancas.length - 1].id)
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
        await getTrancas()
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository getTrancaById', () => {
    it('should get a tranca by id', async () => {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        eq: jest.fn().mockReturnValue({ data: [testTranca], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await getTrancaById(1)
      expect(mock.eq).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(testTranca)
    })

    it('should throw an error if tranca is not found', async () => {
      try {
        const mock = { ...mockFrom, eq: jest.fn().mockReturnValue({ data: [], error: null }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getTrancaById(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Tranca não encontrada')
        } else {
          expect(true).toBe(false)
        }
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, eq: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getTrancaById(1)
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

  describe('Repository createTranca', () => {
    it('should create a tranca', async () => {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [{ ...testTranca, status: status.NOVA }], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await createTranca(testTranca)
      expect(mock.insert).toHaveBeenCalledWith({ ...testTranca, status: status.NOVA })
      expect(result).toEqual({ ...testTranca, status: status.NOVA })
    })
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await createTranca(testTranca)
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

describe('Repository updateTranca', () => {
  it('should update a tranca', async () => {
    const testTranca: Tranca = trancaGen(1)
    const mock = {
      ...mockFrom,
      select: jest.fn().mockReturnValue({ data: [{ ...testTranca, modelo: 'updated' }], error: null })
    }
    jest.spyOn(db, 'from').mockReturnValue(mock)
    const result = await updateTranca(1, { ...testTranca, modelo: 'updated' })
    expect(mock.update).toHaveBeenCalledWith({ ...testTranca, modelo: 'updated' })
    expect(result).toEqual({ ...testTranca, modelo: 'updated' })
  })

  it('should throw an error if tranca is not found', async () => {
    try {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateTranca(1, testTranca)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Tranca não encontrada')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateTranca(1, testTranca)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Erro no banco de dados: error XYZ')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  describe('Repository deleteTranca', () => {
    it('should delete a tranca', async () => {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [testTranca], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await deleteTranca(1)
      expect(mock.delete).toHaveBeenCalledWith()
    })

    it('should throw an error if tranca is not found', async () => {
      try {
        const mock = {
          ...mockFrom,
          select: jest.fn().mockReturnValue({ data: [], error: null })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteTranca(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) expect(error.message).toEqual('Tranca não encontrada')
        else expect(true).toBe(false)
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = {
          ...mockFrom,
          select: jest.fn().mockReturnValue({
            data: null, error: { message: 'error XYZ' }
          })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteTranca(1)
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

  describe('Repository getTrancaByBicicletaId', () => {
    it('should get a tranca by bicicletaId', async () => {
      const testTranca: Tranca = trancaGen(1)
      const mock = {
        ...mockFrom,
        eq: jest.fn().mockReturnValue({ data: [testTranca], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await getTrancaByBicicletaId(1)
      expect(mock.select).toHaveBeenCalledWith('*')
      expect(mock.eq).toHaveBeenCalledWith('bicicletaId', 1)
      expect(result).toEqual(testTranca)
    })

    it('should return null if tranca is not found', async () => {
      const mock = {
        ...mockFrom,
        eq: jest.fn().mockReturnValue({ data: [], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await getTrancaByBicicletaId(1)
      expect(mock.select).toHaveBeenCalledWith('*')
      expect(mock.eq).toHaveBeenCalledWith('bicicletaId', 1)
      expect(result).toEqual(null)
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = {
          ...mockFrom,
          eq: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getTrancaByBicicletaId(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        } else expect(true).toBe(false)
      }
    })
  })
})
