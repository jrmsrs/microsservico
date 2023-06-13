import { UUID } from 'crypto'

export interface Tranca {
  id: UUID
  totemId: UUID
  bicicletaId?: UUID
  numero: number
  anoDeFabricacao: string
  modelo: string
  status?: string
}
