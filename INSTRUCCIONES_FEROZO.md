# 🚀 Instrucciones para Subir a Ferozo Host

## 📋 Información Importante

Ferozo ofrece diferentes tipos de hosting. Necesitas verificar qué tipo de plan tienes:

- **Hosting Linux (cPanel)** → Solo archivos estáticos (HTML/CSS/JS)
- **Hosting Node.js** → Soporta aplicaciones Next.js completas

---

## ⚠️ IMPORTANTE: Verificar tu Plan

1. Ingresa a tu panel de Ferozo
2. Verifica si tienes **"Node.js"** en las opciones
3. Si NO tienes Node.js → Usa **OPCIÓN A** (Exportación Estática)
4. Si SÍ tienes Node.js → Usa **OPCIÓN B** (Aplicación Completa)

---

# OPCIÓN A: Hosting Linux/cPanel (SIN Node.js) ⭐ MÁS COMÚN

## Paso 1: Exportar el Sitio como Estático

### 1.1. Modificar next.config.js

Abre el archivo `next.config.js` y reemplaza TODO el contenido con:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### 1.2. Construir la Versión Estática

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```bash
# Limpiar build anterior
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue

# Instalar dependencias (por si acaso)
npm install

# Construir versión estática
npm run build
```

Esto creará una carpeta llamada **`out/`** con todos los archivos HTML/CSS/JS.

---

## Paso 2: Subir Archivos por FTP a Ferozo

### 2.1. Obtener Credenciales FTP

1. Ve a https://ferozo.host/#/website/ftp
2. Anota:
   - **Servidor FTP:** (ejemplo: ftp.tudominio.com)
   - **Usuario FTP:** (tu usuario)
   - **Contraseña FTP:** (tu contraseña)
   - **Puerto:** 21 (normalmente)

### 2.2. Conectar por FTP

**Opción 1: Usar FileZilla (Recomendado)**

1. Descarga FileZilla desde: https://filezilla-project.org/
2. Instala y abre FileZilla
3. Ingresa los datos:
   - Host: `ftp.tudominio.com` (o el que te dé Ferozo)
   - Usuario: tu usuario FTP
   - Contraseña: tu contraseña FTP
   - Puerto: 21
4. Haz clic en "Conexión Rápida"

**Opción 2: Usar el Administrador de Archivos Web de Ferozo**

1. Ve a tu panel de Ferozo
2. Busca "Administrador de Archivos" o "File Manager"
3. Navega a la carpeta `public_html` o `www`

### 2.3. Subir los Archivos

1. **Navega a la carpeta correcta en el servidor:**
   - Busca la carpeta `public_html` o `www` o `httpdocs`
   - Esta es la carpeta raíz de tu sitio web

2. **IMPORTANTE: Vacía la carpeta primero**
   - Elimina todos los archivos que haya (index.html, etc.)
   - Deja la carpeta vacía

3. **Sube TODOS los archivos de la carpeta `out/`:**
   - En tu computadora, abre la carpeta: `C:\Users\Pablo\Documents\MEDICAL FARMA WEB\out\`
   - Selecciona **TODOS** los archivos y carpetas dentro de `out/`
   - Arrástralos a la carpeta `public_html` del servidor
   - **NO subas la carpeta "out" en sí, solo su contenido**

4. **Espera a que termine la subida**
   - Puede tardar varios minutos dependiendo de tu conexión

---

## Paso 3: Verificar el Sitio

1. Abre tu navegador
2. Ve a tu dominio: `http://tudominio.com`
3. ¡Deberías ver tu sitio funcionando! 🎉

---

## 🔧 Solución de Problemas (Opción A)

### Problema: "404 Not Found"
**Solución:**
- Verifica que hayas subido los archivos a `public_html` (no a una subcarpeta)
- Asegúrate de que existe un archivo `index.html` en la raíz

### Problema: "Las imágenes no se ven"
**Solución:**
- Verifica que hayas subido la carpeta `_next/` completa
- Verifica que hayas subido la carpeta con las imágenes

### Problema: "El sitio se ve sin estilos"
**Solución:**
- Asegúrate de haber subido la carpeta `_next/static/`
- Limpia la caché del navegador (Ctrl + F5)

---

# OPCIÓN B: Hosting con Node.js (MENOS COMÚN en Ferozo)

⚠️ **Solo si tu plan de Ferozo incluye Node.js**

## Paso 1: Preparar los Archivos

Necesitas subir TODO el proyecto (excepto node_modules):

```
MEDICAL FARMA WEB/
├── app/
├── components/
├── public/
├── .next/              ← Ya generado con npm run build
├── package.json
├── next.config.js
└── ... (todos los demás archivos)
```

## Paso 2: Subir por FTP

1. Conecta por FTP a Ferozo
2. Sube TODA la carpeta del proyecto
3. **NO subas la carpeta `node_modules`** (es muy pesada)

## Paso 3: Configurar en el Panel de Ferozo

1. Ve al panel de Node.js en Ferozo
2. Configura:
   - **Versión de Node.js:** 18 o superior
   - **Comando de inicio:** `npm start`
   - **Puerto:** El que te asigne Ferozo (normalmente 3000)

3. Ejecuta en el terminal SSH de Ferozo:
   ```bash
   npm install
   npm run build
   npm start
   ```

---

# 📊 Comparación de Opciones

| Característica | Opción A (Estático) | Opción B (Node.js) |
|----------------|---------------------|-------------------|
| Compatibilidad | ✅ Todos los planes | ⚠️ Solo planes Node.js |
| Facilidad | ✅ Muy fácil | ⚠️ Más complejo |
| Costo | ✅ Más barato | 💰 Más caro |
| Rendimiento | ✅ Muy rápido | ✅ Rápido |
| Funcionalidades | ⚠️ Solo estático | ✅ Completo |

---

# ✅ Checklist de Subida (Opción A - Recomendada)

- [ ] Modificar `next.config.js` con `output: 'export'`
- [ ] Ejecutar `npm run build`
- [ ] Verificar que se creó la carpeta `out/`
- [ ] Conectar por FTP a Ferozo
- [ ] Navegar a `public_html` o `www`
- [ ] Vaciar la carpeta
- [ ] Subir TODO el contenido de la carpeta `out/`
- [ ] Esperar a que termine la subida
- [ ] Visitar tu dominio y verificar

---

# 🆘 Contacto con Soporte Ferozo

Si tienes problemas:

- **Teléfono:** +54 11 5272-4700
- **Email:** soporte@ferozo.com
- **Chat:** Desde tu panel de Ferozo

Pregúntales:
- "¿Mi plan soporta Node.js?"
- "¿Cuál es la carpeta raíz para subir mi sitio web?"

---

# 📝 Notas Importantes

1. **Ferozo normalmente usa hosting Linux/cPanel** → Usa OPCIÓN A
2. **La carpeta de destino suele ser `public_html`**
3. **Sube solo el CONTENIDO de `out/`, no la carpeta `out/` en sí**
4. **El archivo `index.html` debe estar en la raíz de `public_html`**
5. **Puede tardar 5-15 minutos en propagarse el DNS**

---

# 🎯 Resumen Rápido

1. Modifica `next.config.js` → Agrega `output: 'export'`
2. Ejecuta `npm run build`
3. Sube el contenido de `out/` a `public_html` por FTP
4. ¡Listo! 🎉

---

**Última actualización:** 30 de Enero 2026
