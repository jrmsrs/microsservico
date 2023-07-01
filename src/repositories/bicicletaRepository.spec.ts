import {
  getBicicletas,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
} from './bicicletaRepository'
import { Bicicleta } from '../models/bicicletaModel'
import { status } from '../enums/statusBicicletaEnum'
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

const bicicletaGen = (id: number): Bicicleta => ({
  id,
  marca: `marca ${id}`,
  modelo: `modelo ${id}`,
  numero: id,
  ano: '2021',
  status: status.DISPONIVEL
})

describe('Repository bicicletaRepository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('Repository getBicicletas', () => {
    it('should get a list of bicicletas', async () => {
      const testBicicletas: Bicicleta[] = [bicicletaGen(1), bicicletaGen(2), bicicletaGen(3)]
      const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: testBicicletas, error: null }) }
      jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
      const result = await getBicicletas() // as Array<{ id: number, localizacao: string, descricao: string }>
      expect(result[0].id).toEqual(1)
      expect(result[result.length - 1].id).toEqual(testBicicletas[testBicicletas.length - 1].id)
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, select: jest.fn().mockResolvedValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn((db), 'from').mockImplementationOnce(() => mock)
        await getBicicletas()
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Erro no banco de dados: error XYZ')
        } else expect(true).toBe(false)
      }
    })
  })

  describe('Repository getBicicletaById', () => {
    it('should get a bicicleta by id', async () => {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        eq: jest.fn().mockReturnValue({ data: [testBicicleta], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await getBicicletaById(1)
      expect(mock.eq).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(testBicicleta)
    })

    it('should throw an error if bicicleta is not found', async () => {
      try {
        const mock = { ...mockFrom, eq: jest.fn().mockReturnValue({ data: [], error: null }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getBicicletaById(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Bicicleta não encontrada')
        } else {
          expect(true).toBe(false)
        }
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = { ...mockFrom, eq: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } }) }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await getBicicletaById(1)
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

  describe('Repository createBicicleta', () => {
    it('should create a bicicleta', async () => {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [{ ...testBicicleta, status: status.NOVA }], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      const result = await createBicicleta(testBicicleta)
      expect(mock.insert).toHaveBeenCalledWith({ ...testBicicleta, status: status.NOVA })
      expect(result).toEqual({ ...testBicicleta, status: status.NOVA })
    })
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await createBicicleta(testBicicleta)
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

describe('Repository updateBicicleta', () => {
  it('should update a bicicleta', async () => {
    const testBicicleta: Bicicleta = bicicletaGen(1)
    const mock = {
      ...mockFrom,
      select: jest.fn().mockReturnValue({ data: [{ ...testBicicleta, marca: 'updated' }], error: null })
    }
    jest.spyOn(db, 'from').mockReturnValue(mock)
    const result = await updateBicicleta(1, { ...testBicicleta, marca: 'updated' })
    expect(mock.update).toHaveBeenCalledWith({ ...testBicicleta, marca: 'updated' })
    expect(result).toEqual({ ...testBicicleta, marca: 'updated' })
  })

  it('should throw an error if bicicleta is not found', async () => {
    try {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateBicicleta(1, testBicicleta)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Bicicleta não encontrada')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  it('should throw an error if database returns an error', async () => {
    try {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await updateBicicleta(1, testBicicleta)
      expect(true).toBe(false)
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Erro no banco de dados: error XYZ')
      } else {
        expect(true).toBe(false)
      }
    }
  })

  describe('Repository deleteBicicleta', () => {
    it('should delete a bicicleta', async () => {
      const testBicicleta: Bicicleta = bicicletaGen(1)
      const mock = {
        ...mockFrom,
        select: jest.fn().mockReturnValue({ data: [testBicicleta], error: null })
      }
      jest.spyOn(db, 'from').mockReturnValue(mock)
      await deleteBicicleta(1)
      expect(mock.delete).toHaveBeenCalledWith()
    })

    it('should throw an error if bicicleta is not found', async () => {
      try {
        const mock = {
          ...mockFrom,
          select: jest.fn().mockReturnValue({ data: [], error: null })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteBicicleta(1)
        expect(true).toBe(false)
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('Bicicleta não encontrada')
        } else {
          expect(true).toBe(false)
        }
      }
    })

    it('should throw an error if database returns an error', async () => {
      try {
        const mock = {
          ...mockFrom,
          select: jest.fn().mockReturnValue({ data: null, error: { message: 'error XYZ' } })
        }
        jest.spyOn(db, 'from').mockReturnValue(mock)
        await deleteBicicleta(1)
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
