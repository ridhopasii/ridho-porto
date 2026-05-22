import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ''
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''

const createMockSupabaseClient = () => {
  const mockAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
  }
  return {
    auth: mockAuth,
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    }),
  } as unknown as SupabaseClient
}

let supabase: SupabaseClient

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using mock fallback client.')
  supabase = createMockSupabaseClient()
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabase = createMockSupabaseClient()
  }
}

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

