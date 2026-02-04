# 📦 Instrucciones para Subir a Hosting

## ✅ Build Completado Exitosamente

La aplicación se ha compilado correctamente y está lista para producción.

---

## 📁 Archivos Necesarios para el Hosting

Dependiendo del tipo de hosting que uses, necesitarás diferentes archivos:

### **Opción 1: Hosting Node.js (Recomendado)**
Si tu hosting soporta Node.js (como Vercel, Netlify, Railway, Render, etc.):

**Archivos a subir:**
- Toda la carpeta del proyecto completa
- Especialmente importantes:
  - `.next/` (carpeta generada por el build)
  - `public/` (imágenes y archivos estáticos)
  - `node_modules/` (o instalar con `npm install` en el servidor)
  - `package.json`
  - `next.config.js`
  - Todos los archivos de configuración

**Comando para iniciar en el servidor:**
```bash
npm start
```

---

### **Opción 2: Hosting Estático (HTML/CSS/JS)**
Si tu hosting solo soporta archivos estáticos, necesitas exportar la aplicación:

**Pasos:**
1. Modificar `next.config.js` para agregar:
   ```javascript
   output: 'export'
   ```

2. Ejecutar:
   ```bash
   npm run build
   ```

3. Subir solo la carpeta `out/` que se genera

⚠️ **NOTA:** Algunas funcionalidades pueden no funcionar en modo estático (como API routes).

---

## 🚀 Opciones de Hosting Recomendadas

### **1. Vercel (Más Fácil - GRATIS)**
- Sitio web: https://vercel.com
- Pasos:
  1. Crear cuenta en Vercel
  2. Conectar tu repositorio Git o subir la carpeta
  3. Vercel detecta automáticamente Next.js y lo despliega
  4. ¡Listo! Te da una URL automáticamente

### **2. Netlify (GRATIS)**
- Sitio web: https://netlify.com
- Similar a Vercel, muy fácil de usar

### **3. Railway (Node.js - GRATIS con límites)**
- Sitio web: https://railway.app
- Soporta Node.js completo

### **4. Hosting Tradicional (cPanel, etc.)**
- Necesitas soporte para Node.js
- O usar la exportación estática (Opción 2)

---

## 📋 Checklist Pre-Despliegue

- [x] Build completado sin errores
- [x] Imagen de fondo copiada a `/public`
- [ ] Verificar variables de entorno (si las hay)
- [ ] Probar la aplicación localmente con `npm start`
- [ ] Elegir plataforma de hosting
- [ ] Configurar dominio personalizado (opcional)

---

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Limpiar cache de Next.js
rm -rf .next
```

---

## 📊 Estadísticas del Build

- **Páginas generadas:** 10
- **Tamaño total:** ~142 KB (página principal)
- **Tipo:** Sitio estático pre-renderizado
- **Rendimiento:** Optimizado ✓

---

## 🆘 Soporte

Si tienes problemas con el despliegue:
1. Verifica que Node.js esté instalado (versión 18 o superior)
2. Revisa los logs del hosting
3. Asegúrate de que todas las dependencias estén instaladas

---

## 🌐 URLs Actuales

- **Local Development:** http://localhost:3001
- **Production:** (Pendiente de configurar en tu hosting)
