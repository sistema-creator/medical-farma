import { create } from 'zustand'

export type UserRole = 'guest' | 'hospital' | 'farmacia' | 'pending' | 'gerencia' | 'compras' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    razonSocial?: string
    cuit?: string
    condicionIVA?: string
    approved: boolean
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    // Usuario de prueba con UUID real de Supabase
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    updateUser: (userData) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
        })),
}))
