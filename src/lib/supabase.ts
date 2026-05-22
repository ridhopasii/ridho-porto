import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Check .env or .env.local')
}

const supabase: SupabaseClient = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export default supabase

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}
