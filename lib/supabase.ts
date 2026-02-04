import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('WARNING: Supabase credentials missing! Using dummy client.')
}

const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder'

console.log(`[Supabase] Initializing client with URL: ${url.substring(0, 20)}...`)

let supabaseClient;
try {
    supabaseClient = createClient(url, key)
    console.log('[Supabase] Client initialized successfully')
} catch (e) {
    console.error('[Supabase] Client initialization FAILED:', e)
    // Minimal mock to prevent importing module crash
    supabaseClient = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: 'Mock Error' } }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Mock Error' } }),
            update: () => Promise.resolve({ data: null, error: { message: 'Mock Error' } }),
            delete: () => Promise.resolve({ data: null, error: { message: 'Mock Error' } }),
            eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Mock Error' } }) }), // Chainable mock
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: { message: 'Mock Error' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
    } as any
}

// Cliente público (con RLS activado)
export const supabase = supabaseClient

// Cliente para operaciones del servidor
let supabaseAdminClient;
try {
    supabaseAdminClient = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
} catch (e) {
    supabaseAdminClient = supabaseClient // Fallback to same mock
}
export const supabaseAdmin = supabaseAdminClient
