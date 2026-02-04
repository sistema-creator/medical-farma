const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = 'https://leadwvoqisxpdrvwbbex.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWR3dm9xaXN4cGRydndiYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjQ0MjEsImV4cCI6MjA4NDkwMDQyMX0.Z2F0ElE9Xm0anZyo6wn5urbqFgndJcebcHA5a9jrdNU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function registrarAdministrador() {
    console.log('🚀 Registrando usuario administrador...\n')

    const email = 'medicalfarmaparana@gmail.com'
    const password = 'Pz938ue9E3102edj+'
    const nombreCompleto = 'Administrador Medical Farma'

    try {
        // Paso 1: Registrar usuario (esto creará el registro en usuarios automáticamente)
        console.log('📝 Registrando usuario...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('ℹ️  El usuario ya está registrado')
                console.log('   Iniciando sesión para obtener el ID...')

                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                })

                if (loginError) {
                    console.error('❌ Error al iniciar sesión:', loginError.message)
                    return
                }

                console.log('✅ Sesión iniciada')
                const userId = loginData.user.id

                // Actualizar el registro del usuario
                console.log('📝 Actualizando datos del usuario...')
                const { error: updateError } = await supabase
                    .from('usuarios')
                    .update({
                        nombre_completo: nombreCompleto,
                        tipo_usuario: 'gerencia',
                        estado: 'aprobado'
                    })
                    .eq('id', userId)

                if (updateError) {
                    console.error('❌ Error al actualizar:', updateError.message)
                    console.log('\n⚠️  SOLUCIÓN MANUAL:')
                    console.log('   1. Ir a: https://supabase.com/dashboard/project/leadwvoqisxpdrvwbbex')
                    console.log('   2. Table Editor → usuarios')
                    console.log('   3. Buscar usuario:', email)
                    console.log('   4. Cambiar:')
                    console.log('      - tipo_usuario: gerencia')
                    console.log('      - estado: aprobado')
                    return
                }

                console.log('✅ Usuario actualizado')
            } else {
                console.error('❌ Error al registrar:', authError.message)
                return
            }
        } else {
            console.log('✅ Usuario registrado en Auth')
            console.log('   User ID:', authData.user?.id)

            // Esperar un momento para que se cree el registro
            console.log('\n⏳ Esperando a que se cree el registro...')
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Iniciar sesión para poder actualizar
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (loginError) {
                console.error('❌ Error al iniciar sesión:', loginError.message)
                return
            }

            // Actualizar el usuario
            console.log('📝 Actualizando datos del usuario...')
            const { error: updateError } = await supabase
                .from('usuarios')
                .update({
                    nombre_completo: nombreCompleto,
                    tipo_usuario: 'gerencia',
                    estado: 'aprobado'
                })
                .eq('id', authData.user.id)

            if (updateError) {
                console.error('❌ Error al actualizar:', updateError.message)
                console.log('\n⚠️  SOLUCIÓN MANUAL:')
                console.log('   1. Ir a: https://supabase.com/dashboard/project/leadwvoqisxpdrvwbbex')
                console.log('   2. Table Editor → usuarios')
                console.log('   3. Buscar usuario:', email)
                console.log('   4. Cambiar:')
                console.log('      - tipo_usuario: gerencia')
                console.log('      - estado: aprobado')
                return
            }

            console.log('✅ Usuario actualizado')
        }

        // Resumen
        console.log('\n' + '='.repeat(60))
        console.log('🎉 ¡USUARIO ADMINISTRADOR CONFIGURADO!')
        console.log('='.repeat(60))
        console.log('\n📋 Datos de acceso:')
        console.log('   Email:    ', email)
        console.log('   Password: ', password)
        console.log('   Tipo:     ', 'Gerencia')
        console.log('   Estado:   ', 'Aprobado')
        console.log('\n🌐 Iniciar sesión:')
        console.log('   http://localhost:3000/auth/login')
        console.log('\n👥 Panel de administración:')
        console.log('   http://localhost:3000/admin/usuarios')
        console.log('\n' + '='.repeat(60))

    } catch (error) {
        console.error('❌ Error inesperado:', error)
    }
}

// Ejecutar
registrarAdministrador()
