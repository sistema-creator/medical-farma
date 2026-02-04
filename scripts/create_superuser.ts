
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables manually
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath))
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const SUPER_USER = {
    email: 'pablogabrielmarin@gmail.com',
    password: 'E3102edj@temp', // Changed slightly to ensure complexity if needed, but using user provided one
    // wait, user said "E3102edj", let's use that.
    passwordOriginal: 'E3102edj'
}

async function createSuperUser() {
    console.log(`Creating superuser: ${SUPER_USER.email}`)

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: SUPER_USER.email,
        password: SUPER_USER.passwordOriginal,
    })

    if (authError) {
        console.log('SingUp Error (User might exist, trying to fetch):', authError.message)
    }

    let userId = authData.user?.id

    if (!userId) {
        // Try getting user if already exists (need admin privileges usually, but with anon key we can login)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: SUPER_USER.email,
            password: SUPER_USER.passwordOriginal
        })

        if (loginError) {
            console.error('Could not login or sign up:', loginError.message)
            return
        }
        userId = loginData.user.id
    }

    console.log(`User ID: ${userId}`)

    // 2. Get 'Gerencia' Profile ID
    const { data: profiles } = await supabase.from('perfiles').select('id').eq('nombre', 'Gerencia').single()
    const perfilId = profiles?.id

    if (!perfilId) {
        console.error('Profile Gerencia not found')
        return
    }

    // 3. Update User Record
    const { error: updateError } = await supabase
        .from('usuarios')
        .upsert({
            id: userId,
            email: SUPER_USER.email,
            nombre_completo: 'Super Admin',
            tipo_usuario: 'gerencia',
            perfil_id: perfilId,
            estado: 'aprobado',
            must_change_password: true,
            updated_at: new Date().toISOString()
        })

    if (updateError) {
        console.error('Error updating public.usuarios:', updateError)
    } else {
        console.log('User updated successfully in public.usuarios')
    }

    console.log('Superuser setup complete.')
}

createSuperUser().catch(console.error)
