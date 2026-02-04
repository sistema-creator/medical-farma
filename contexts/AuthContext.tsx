'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser, obtenerUsuarioActual } from '@/lib/auth'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean; user?: AuthUser | null }>
    signOut: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar sesión actual
        checkUser()

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN' && session) {
                await checkUser()
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    async function checkUser() {
        try {
            const userData = await obtenerUsuarioActual()
            setUser(userData)
        } catch (error) {
            console.error('Error obteniendo usuario:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            await checkUser()
            // We need to fetch the user again to get the must_change_password flag properly or inspect the result of checkUser
            // Since checkUser updates state, let's fetch directly here for the return value
            const userData = await obtenerUsuarioActual()
            return {
                success: true,
                user: userData,
                mustChangePassword: userData?.must_change_password || false
            }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    async function signOut() {
        await supabase.auth.signOut()
        setUser(null)
    }

    async function refreshUser() {
        await checkUser()
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}
