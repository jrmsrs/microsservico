import { UUID } from 'crypto'

export interface Bicicleta {
  id: UUID
  marca: string
  modelo: string
  ano: string
  numero: number
  status: string
}
