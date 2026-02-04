const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
    console.log('Please add your Service Role Key (found in Supabase Project Settings > API) to .env.local as SUPABASE_SERVICE_ROLE_KEY=...');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const users = [
    {
        email: 'admin@medicalfarma.com',
        password: 'Password123!',
        role: 'admin', // or 'superuser' based on enum
        nombre: 'Administrador Principal'
    },
    {
        email: 'vendedor@medicalfarma.com',
        password: 'Password123!',
        role: 'vendedor_piloto',
        nombre: 'Vendedor Piloto'
    }
];

async function seedUsers() {
    console.log('Seeding users...');

    for (const u of users) {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true
        });

        if (authError) {
            console.error(`Error creating auth user ${u.email}:`, authError.message);
            continue;
        }

        const userId = authData.user.id;
        console.log(`Created auth user: ${u.email} (${userId})`);

        // 2. Create Public Profile (if trigger doesn't do it, or to update role)
        // Assuming 'usuarios' table exists and links to auth.users via handle_new_user trigger or similar.
        // We will update the role manually here.

        // Check if profile exists (created by trigger)
        const { data: profile, error: fetchError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'Row not found' which is fine if no trigger
            console.error(`Error checking profile for ${u.email}:`, fetchError.message);
        }

        const updateData = {
            nombre_completo: u.nombre,
            tipo_usuario: u.role,
            email: u.email,
            estado: 'aprobado'
        };

        if (profile) {
            const { error: updateError } = await supabase
                .from('usuarios')
                .update(updateData)
                .eq('id', userId);
            if (updateError) console.error(`Failed to update profile for ${u.email}:`, updateError.message);
            else console.log(`Updated profile for ${u.email}`);
        } else {
            // Insert if not exists
            const { error: insertError } = await supabase
                .from('usuarios')
                .insert({
                    id: userId,
                    ...updateData
                });
            if (insertError) console.error(`Failed to insert profile for ${u.email}:`, insertError.message);
            else console.log(`Inserted profile for ${u.email}`);
        }
    }
}

seedUsers();
