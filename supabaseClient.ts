import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Evita que o app quebre se as chaves não estiverem configuradas
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({ single: () => Promise.resolve({ data: null, error: null }), match: () => Promise.resolve({ data: null, error: null }) }),
            upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => ({ match: () => Promise.resolve({ data: null, error: null }) }),
            delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) })
        })
    } as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. App in local-only mode.');
}
