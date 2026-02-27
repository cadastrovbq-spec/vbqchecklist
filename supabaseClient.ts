import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Evita que o app quebre se as chaves não estiverem configuradas
const mockResponse = { data: [], error: null };
const mockSingleResponse = { data: null, error: null };

const createMockChain = (responseData: any) => {
    const chain = Promise.resolve(responseData) as any;
    const methods = ['select', 'insert', 'upsert', 'update', 'delete', 'eq', 'match', 'single', 'maybeSingle', 'order', 'limit', 'range'];

    methods.forEach(method => {
        chain[method] = () => method === 'single' || method === 'maybeSingle'
            ? createMockChain(mockSingleResponse)
            : createMockChain(responseData);
    });

    return chain;
};

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => createMockChain(mockResponse),
            upsert: () => createMockChain(mockResponse),
            insert: () => createMockChain(mockResponse),
            update: () => createMockChain(mockResponse),
            delete: () => createMockChain(mockResponse),
        })
    } as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. App in local-only mode.');
}
