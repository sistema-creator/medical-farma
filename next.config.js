/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // Desactivado para Vercel/GitHub (permite Serverless Functions)
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    // trailingSlash: true, // Generalmente mejor desactivado para apps Node.js
}

module.exports = nextConfig
