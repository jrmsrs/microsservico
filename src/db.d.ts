export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bicicleta: {
        Row: {
          ano: string
          created_at: string | null
          id: number
          marca: string
          modelo: string
          numero: number
          status: string
        }
        Insert: {
          ano: string
          created_at?: string | null
          id?: number
          marca: string
          modelo: string
          numero: number
          status: string
        }
        Update: {
          ano?: string
          created_at?: string | null
          id?: number
          marca?: string
          modelo?: string
          numero?: number
          status?: string
        }
        Relationships: []
      }
      totem: {
        Row: {
          created_at: string | null
          descricao: string
          id: number
          localizacao: string
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: number
          localizacao: string
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: number
          localizacao?: string
        }
        Relationships: []
      }
      tranca: {
        Row: {
          anoDeFabricacao: string
          bicicletaId: number | null
          created_at: string | null
          id: number
          modelo: string
          numero: number
          status: string
          totemId: number | null
        }
        Insert: {
          anoDeFabricacao: string
          bicicletaId?: number | null
          created_at?: string | null
          id?: number
          modelo: string
          numero: number
          status: string
          totemId?: number | null
        }
        Update: {
          anoDeFabricacao?: string
          bicicletaId?: number | null
          created_at?: string | null
          id?: number
          modelo?: string
          numero?: number
          status?: string
          totemId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'tranca_bicicletaId_fkey'
            columns: ['bicicletaId']
            referencedRelation: 'bicicleta'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tranca_totemId_fkey'
            columns: ['totemId']
            referencedRelation: 'totem'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
