'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Assuming you have a client setup or use this directly
import { useRouter } from 'next/navigation';

// Initialize client (replace with your hook if you have one, e.g. useSupabase)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Template = {
    id: string;
    code: string;
    type: 'whatsapp' | 'email' | 'pdf';
    content: string;
    is_active: boolean;
};

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Template | null>(null);
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('templates')
            .select('*')
            .order('code');

        if (error) {
            console.error('Error fetching templates:', error);
            setError(error.message);
        } else {
            setTemplates(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (template: Template) => {
        // In a real app, optimize this to not use 'upsert' blindly without ID for new ones properly handled
        // But for editing existing or new with manual code:
        const { error } = await supabase
            .from('templates')
            .upsert(template);

        if (error) {
            alert('Error saving: ' + error.message);
        } else {
            setEditing(null);
            fetchTemplates();
        }
    };

    const createNew = () => {
        setEditing({
            id: crypto.randomUUID(), // Optimistic ID
            code: '',
            type: 'whatsapp',
            content: '',
            is_active: true
        });
    };

    if (loading) return <div className="p-8">Cargando plantillas...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de Plantillas</h1>

            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

            <div className="mb-4">
                <button
                    onClick={createNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Nueva Plantilla
                </button>
            </div>

            <div className="grid gap-4">
                {templates.map((t) => (
                    <div key={t.id} className="border p-4 rounded shadow-sm flex justify-between items-center bg-white">
                        <div>
                            <p className="font-bold">{t.code}</p>
                            <p className="text-sm text-gray-500">{t.type}</p>
                        </div>
                        <button
                            onClick={() => setEditing(t)}
                            className="text-blue-600 hover:underline"
                        >
                            Editar
                        </button>
                    </div>
                ))}
                {templates.length === 0 && <p className="text-gray-500">No hay plantillas definidas.</p>}
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">
                            {templates.find(t => t.id === editing.id) ? 'Editar' : 'Nueva'} Plantilla
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium">Código (Único)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={editing.code}
                                    onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={editing.type}
                                    onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                                >
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="email">Email</option>
                                    <option value="pdf">PDF</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 mb-4 flex flex-col">
                            <label className="block text-sm font-medium mb-1">Contenido</label>
                            <textarea
                                className="w-full border p-2 rounded flex-1 font-mono text-sm"
                                value={editing.content}
                                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleSave(editing)}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
