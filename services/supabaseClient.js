const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase Client Initialization
 * Adapts the standard Supabase client for use in an Express environment.
 */

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('WARNING: Supabase URL or Anon Key is missing. Supabase client will not be initialized.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
