import { UUID } from 'crypto'

export interface Totem {
  id: UUID
  localizacao: string
  descricao: string
}
