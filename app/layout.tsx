import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Medical Farma - Compromiso con la Salud y la Vida',
    description: 'Empresa familiar líder en distribución de insumos médicos y farmacéuticos con alcance nacional. Desde 1978, sirviendo a instituciones de salud en toda Argentina.',
    keywords: 'insumos médicos, distribución médica, alta complejidad, hospitales, farmacias, Medical Farma',
    authors: [{ name: 'Medical Farma' }],
    openGraph: {
        title: 'Medical Farma - Compromiso con la Salud y la Vida',
        description: 'Empresa familiar líder en distribución de insumos médicos y farmacéuticos con alcance nacional',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <head>
                {/* Google Analytics - Placeholder para hooks */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              // Google Analytics tracking code
              // window.dataLayer = window.dataLayer || [];
              // function gtag(){dataLayer.push(arguments);}
              // gtag('js', new Date());
              // gtag('config', 'GA_MEASUREMENT_ID');
            `,
                    }}
                />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
