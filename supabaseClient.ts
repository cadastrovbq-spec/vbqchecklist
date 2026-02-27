import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Evita que o app quebre se as chaves não estiverem configuradas
const mockResponse = { data: [], error: null };
const mockSingleResponse = { data: null, error: null };

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => Object.assign(Promise.resolve(mockResponse), {
                single: () => Promise.resolve(mockSingleResponse),
                match: () => Object.assign(Promise.resolve(mockResponse), {
                    select: () => Promise.resolve(mockResponse)
                })
            }),
            upsert: () => Object.assign(Promise.resolve(mockResponse), {
                select: () => ({
                    single: () => Promise.resolve(mockSingleResponse)
                })
            }),
            insert: () => Promise.resolve(mockResponse),
            update: () => ({ match: () => Promise.resolve(mockResponse) }),
            delete: () => ({ eq: () => Promise.resolve(mockResponse) })
        })
    } as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. App in local-only mode.');
}
