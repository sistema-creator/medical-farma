const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = 'https://leadwvoqisxpdrvwbbex.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWR3dm9xaXN4cGRydndiYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjQ0MjEsImV4cCI6MjA4NDkwMDQyMX0.Z2F0ElE9Xm0anZyo6wn5urbqFgndJcebcHA5a9jrdNU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function completarAdministrador() {
    console.log('🚀 Completando configuración de administrador...\n')

    const userId = '20cf0034-7060-4540-a291-91b0d8578216'
    const email = 'medicalfarmaparana@gmail.com'
    const nombreCompleto = 'Administrador Medical Farma'

    try {
        // Verificar si ya existe en la tabla usuarios
        console.log('📝 Verificando si el usuario ya existe en la tabla...')
        const { data: existente, error: checkError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (existente) {
            console.log('ℹ️  El usuario ya existe en la tabla usuarios')
            console.log('   Actualizando estado a aprobado...')

            const { error: updateError } = await supabase
                .from('usuarios')
                .update({
                    estado: 'aprobado',
                    tipo_usuario: 'gerencia'
                })
                .eq('id', userId)

            if (updateError) {
                console.error('❌ Error al actualizar:', updateError.message)
                return
            }

            console.log('✅ Usuario actualizado')
        } else {
            console.log('📝 Creando registro en tabla usuarios...')

            const { data: usuario, error: usuarioError } = await supabase
                .from('usuarios')
                .insert({
                    id: userId,
                    email: email,
                    nombre_completo: nombreCompleto,
                    tipo_usuario: 'gerencia',
                    perfil_id: null,
                    estado: 'aprobado'
                })
                .select()

            if (usuarioError) {
                console.error('❌ Error al crear usuario:', usuarioError.message)
                return
            }

            console.log('✅ Usuario creado en base de datos')
        }

        // Resumen
        console.log('\n' + '='.repeat(60))
        console.log('🎉 ¡USUARIO ADMINISTRADOR CONFIGURADO EXITOSAMENTE!')
        console.log('='.repeat(60))
        console.log('\n📋 Datos de acceso:')
        console.log('   Email:    ', email)
        console.log('   Password: ', 'Pz938ue9E3102edj+')
        console.log('   Tipo:     ', 'Gerencia')
        console.log('   Estado:   ', 'Aprobado')
        console.log('\n🌐 Puedes iniciar sesión en:')
        console.log('   http://localhost:3000/auth/login')
        console.log('\n👥 Panel de administración:')
        console.log('   http://localhost:3000/admin/usuarios')
        console.log('\n📦 Gestión de productos:')
        console.log('   http://localhost:3000/productos')
        console.log('\n' + '='.repeat(60))

    } catch (error) {
        console.error('❌ Error inesperado:', error)
    }
}

// Ejecutar
completarAdministrador()
