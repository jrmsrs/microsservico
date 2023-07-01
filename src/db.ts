import { createClient } from '@supabase/supabase-js'
import type { Database } from './db.d'
import 'dotenv/config'

export const db = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
)
