/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Activado para Ferozo Hosting (Static)
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    // trailingSlash: true, // Generalmente mejor desactivado para apps Node.js
}

module.exports = nextConfig
