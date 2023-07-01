import { db } from '../db'
import type { Totem } from '../models/totemModel'

export async function getTotens (): Promise<Totem[]> {
  const { data: totens, error: dbError } = await db
    .from('totem')
    .select('*')
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return totens
}

export async function getTotemById (id: number): Promise<Totem> {
  const { data: totem, error: dbError } = await db
    .from('totem')
    .select('*')
    .eq('id', id)
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (totem.length === 0) {
    throw new Error('Totem não encontrado')
  }
  return totem[0]
}

export async function createTotem (totem: Totem): Promise<Totem> {
  const { data: newTotem, error: dbError } = await db
    .from('totem')
    .insert(totem)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  return newTotem[0]
}

export async function updateTotem (id: number, updatedTotem: Totem): Promise<Totem> {
  const { data: newTotem, error: dbError } = await db
    .from('totem')
    .update(updatedTotem)
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (newTotem.length === 0) {
    throw new Error('Totem não encontrado')
  }
  return newTotem[0]
}

export async function deleteTotem (id: number): Promise<void> {
  const { data: deletedTotem, error: dbError } = await db
    .from('totem')
    .delete()
    .eq('id', id)
    .select()
  if (dbError !== null) {
    throw new Error('Erro no banco de dados: ' + dbError?.message)
  }
  if (deletedTotem.length === 0) {
    throw new Error('Totem não encontrado')
  }
}
