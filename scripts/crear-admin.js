const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = 'https://leadwvoqisxpdrvwbbex.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWR3dm9xaXN4cGRydndiYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjQ0MjEsImV4cCI6MjA4NDkwMDQyMX0.Z2F0ElE9Xm0anZyo6wn5urbqFgndJcebcHA5a9jrdNU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function crearAdministrador() {
    console.log('🚀 Creando usuario administrador...\n')

    const email = 'medicalfarmaparana@gmail.com'
    const password = 'Pz938ue9E3102edj+'
    const nombreCompleto = 'Administrador Medical Farma'

    try {
        // Paso 1: Crear usuario en Supabase Auth
        console.log('📝 Paso 1: Creando usuario en Supabase Auth...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nombre_completo: nombreCompleto,
                }
            }
        })

        if (authError) {
            console.error('❌ Error al crear usuario en Auth:', authError.message)
            return
        }

        console.log('✅ Usuario creado en Auth')
        console.log('   User ID:', authData.user?.id)

        // Paso 2: Obtener el perfil de Gerencia
        console.log('\n📝 Paso 2: Obteniendo perfil de Gerencia...')
        const { data: perfiles, error: perfilError } = await supabase
            .from('perfiles')
            .select('*')
            .eq('nombre', 'Gerencia')
            .single()

        if (perfilError) {
            console.error('❌ Error al obtener perfil:', perfilError.message)
            return
        }

        console.log('✅ Perfil de Gerencia encontrado')
        console.log('   Perfil ID:', perfiles.id)

        // Paso 3: Crear registro en tabla usuarios
        console.log('\n📝 Paso 3: Creando registro en tabla usuarios...')
        const { data: usuario, error: usuarioError } = await supabase
            .from('usuarios')
            .insert({
                id: authData.user?.id,
                email: email,
                nombre_completo: nombreCompleto,
                tipo_usuario: 'gerencia',
                perfil_id: perfiles.id,
                estado: 'aprobado'
            })
            .select()
            .single()

        if (usuarioError) {
            console.error('❌ Error al crear usuario:', usuarioError.message)
            return
        }

        console.log('✅ Usuario creado en base de datos')

        // Resumen
        console.log('\n' + '='.repeat(60))
        console.log('🎉 ¡USUARIO ADMINISTRADOR CREADO EXITOSAMENTE!')
        console.log('='.repeat(60))
        console.log('\n📋 Datos de acceso:')
        console.log('   Email:    ', email)
        console.log('   Password: ', password)
        console.log('   Tipo:     ', 'Gerencia')
        console.log('   Estado:   ', 'Aprobado')
        console.log('   Perfil:   ', perfiles.nombre)
        console.log('\n🌐 Puedes iniciar sesión en:')
        console.log('   http://localhost:3000/auth/login')
        console.log('\n👥 Panel de administración:')
        console.log('   http://localhost:3000/admin/usuarios')
        console.log('\n' + '='.repeat(60))

    } catch (error) {
        console.error('❌ Error inesperado:', error)
    }
}

// Ejecutar
crearAdministrador()
