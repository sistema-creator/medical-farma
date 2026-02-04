import DetalleProveedorClient from './client'
import { obtenerProveedores } from '@/lib/proveedores'
import { supabase } from '@/lib/supabase'

// Required for static export with dynamic routes
export async function generateStaticParams() {
    try {
        const { data: proveedores } = await supabase.from('proveedores').select('id')
        if (!proveedores || proveedores.length === 0) {
            return [{ id: 'mock-id-for-build' }]
        }

        return proveedores.map((proveedor: any) => ({
            id: String(proveedor.id),
        }))
    } catch (error) {
        console.warn('Error generating static params for proveedores:', error)
        return [{ id: 'mock-id-for-build' }]
    }
}

export default function DetalleProveedorPage({ params }: { params: { id: string } }) {
    return <DetalleProveedorClient id={params.id} />
}
