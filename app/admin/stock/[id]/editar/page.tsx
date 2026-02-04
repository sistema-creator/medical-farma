import EditProductClient from './client'
import { supabase } from '@/lib/supabase'

// Required for static export with dynamic routes
export async function generateStaticParams() {
    try {
        const { data: productos } = await supabase.from('productos').select('id')
        if (!productos || productos.length === 0) {
            return [{ id: 'mock-id-for-build' }]
        }

        return productos.map((producto: any) => ({
            id: String(producto.id),
        }))
    } catch (error) {
        console.warn('Error generating static params for productos:', error)
        return [{ id: 'mock-id-for-build' }]
    }
}

export default function EditProductPage() {
    return <EditProductClient />
}
