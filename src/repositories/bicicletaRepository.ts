import { db } from '../db'
import type { Bicicleta } from '../models/bicicletaModel'
import { status } from '../enums/statusBicicletaEnum'

export async function getBicicletas (): Promise<Bicicleta[]> {
  const { data: bicicletas, error: dbError } = await db
    .from('bicicleta')
    .select('*')
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return bicicletas
}

export async function getBicicletaById (id: number): Promise<Bicicleta> {
  const { data: bicicleta, error: dbError } = await db
    .from('bicicleta')
    .select('*')
    .eq('id', id)
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (bicicleta.length === 0) {
    throw new Error('Bicicleta não encontrada')
  }
  return bicicleta[0]
}

export async function createBicicleta (bicicleta: Bicicleta): Promise<Bicicleta> {
  const { data: newBicicleta, error: dbError } = await db
    .from('bicicleta')
    .insert({ ...bicicleta, status: status.NOVA })
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return newBicicleta[0]
}

export async function updateBicicleta (id: number, updatedBicicleta: Bicicleta): Promise<Bicicleta> {
  const { data: newBicicleta, error: dbError } = await db
    .from('bicicleta')
    .update(updatedBicicleta)
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (newBicicleta.length === 0) {
    throw new Error('Bicicleta não encontrada')
  }
  return newBicicleta[0]
}

export async function deleteBicicleta (id: number): Promise<void> {
  const { data: deletedBicicleta, error: dbError } = await db
    .from('bicicleta')
    .delete()
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (deletedBicicleta.length === 0) {
    throw new Error('Bicicleta não encontrada')
  }
}
