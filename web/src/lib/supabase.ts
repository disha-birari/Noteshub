import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check for placeholders
if (supabaseUrl.includes('your-project-id') || !supabaseUrl) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase Configuration: Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
