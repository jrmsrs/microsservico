import { db } from '../db'
import type { Tranca } from '../models/trancaModel'
import { status } from '../enums/statusTrancaEnum'

export async function getTrancas (): Promise<Tranca[]> {
  const { data: trancas, error: dbError } = await db
    .from('tranca')
    .select('*')
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return trancas
}

export async function getTrancaById (id: number): Promise<Tranca> {
  const { data: tranca, error: dbError } = await db
    .from('tranca')
    .select('*')
    .eq('id', id)
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (tranca.length === 0) {
    throw new Error('Tranca não encontrada')
  }
  return tranca[0]
}

export async function createTranca (tranca: Tranca): Promise<Tranca> {
  const { data: newTranca, error: dbError } = await db
    .from('tranca')
    .insert({ ...tranca, status: status.NOVA })
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return newTranca[0]
}

export async function updateTranca (id: number, updatedTranca: Tranca): Promise<Tranca> {
  const { data: newTranca, error: dbError } = await db
    .from('tranca')
    .update(updatedTranca)
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (newTranca.length === 0) {
    throw new Error('Tranca não encontrada')
  }
  return newTranca[0]
}

export async function deleteTranca (id: number): Promise<void> {
  const { data: deletedTranca, error: dbError } = await db
    .from('tranca')
    .delete()
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (deletedTranca.length === 0) {
    throw new Error('Tranca não encontrada')
  }
}

export async function getTrancaByBicicletaId (bicicletaId: number): Promise<Tranca | null> {
  const { data: tranca, error: dbError } = await db
    .from('tranca')
    .select('*')
    .eq('bicicletaId', bicicletaId)
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (tranca.length === 0) {
    return null
  }
  return tranca[0]
}
