# ✅ CHECKLIST RÁPIDO - SUBIR A FEROZO

## 📋 Antes de Empezar

- [x] ✅ Sitio exportado a carpeta "out"
- [x] ✅ Imagen de fondo incluida
- [x] ✅ Todas las páginas generadas
- [ ] 🔲 Credenciales FTP de Ferozo obtenidas
- [ ] 🔲 FileZilla instalado

---

## 🚀 Pasos de Subida

### 1. Obtener Credenciales FTP
- [ ] 🔲 Ir a https://ferozo.host/#/website/ftp
- [ ] 🔲 Anotar servidor FTP
- [ ] 🔲 Anotar usuario
- [ ] 🔲 Anotar contraseña

### 2. Instalar FileZilla (si no lo tienes)
- [ ] 🔲 Ir a https://filezilla-project.org/
- [ ] 🔲 Descargar FileZilla Client
- [ ] 🔲 Instalar

### 3. Conectar a Ferozo
- [ ] 🔲 Abrir FileZilla
- [ ] 🔲 Ingresar servidor FTP
- [ ] 🔲 Ingresar usuario
- [ ] 🔲 Ingresar contraseña
- [ ] 🔲 Puerto: 21
- [ ] 🔲 Hacer clic en "Conexión Rápida"

### 4. Preparar el Servidor
- [ ] 🔲 Buscar carpeta "public_html" o "www"
- [ ] 🔲 Entrar en esa carpeta
- [ ] 🔲 Eliminar todos los archivos existentes

### 5. Subir los Archivos
- [ ] 🔲 En FileZilla (panel izquierdo), navegar a:
      `C:\Users\Pablo\Documents\MEDICAL FARMA WEB\out\`
- [ ] 🔲 Seleccionar TODO el contenido de "out"
      (NO la carpeta "out", solo su contenido)
- [ ] 🔲 Arrastrar al panel derecho (public_html)
- [ ] 🔲 Esperar a que termine la subida (5-15 min)

### 6. Verificar
- [ ] 🔲 Abrir navegador
- [ ] 🔲 Ir a tu dominio
- [ ] 🔲 Verificar que el sitio se vea correctamente
- [ ] 🔲 Probar todas las páginas
- [ ] 🔲 Verificar que la imagen de fondo se vea

---

## ⚠️ RECORDATORIOS IMPORTANTES

❗ **Sube el CONTENIDO de "out", NO la carpeta "out"**

❗ **El archivo index.html debe quedar en la raíz de public_html**

❗ **Estructura correcta:**
```
public_html/
├── index.html          ← ✅ CORRECTO
├── hospital-reception.jpg
├── _next/
└── ...
```

❗ **Estructura INCORRECTA:**
```
public_html/
└── out/                ← ❌ MAL
    ├── index.html
    └── ...
```

---

## 🆘 Si Algo Sale Mal

### No puedo conectar por FTP
→ Verifica las credenciales en el panel de Ferozo
→ Prueba con puerto 21 o 22
→ Contacta soporte: soporte@ferozo.com

### El sitio muestra "404 Not Found"
→ Verifica que index.html esté en la raíz de public_html
→ No debe estar dentro de una subcarpeta

### Las imágenes no se ven
→ Asegúrate de haber subido TODO el contenido de "out"
→ Verifica que hospital-reception.jpg esté en la raíz

### El sitio se ve sin estilos
→ Sube nuevamente la carpeta "_next"
→ Limpia la caché del navegador (Ctrl + F5)

---

## 📞 Contacto Soporte Ferozo

- **Teléfono:** +54 11 5272-4700
- **Email:** soporte@ferozo.com
- **Chat:** Desde tu panel de Ferozo

---

## 📄 Más Información

- `LISTO_PARA_FEROZO.txt` - Resumen visual completo
- `INSTRUCCIONES_FEROZO.md` - Guía detallada paso a paso
- `README.md` - Información del proyecto

---

**¡Éxito con tu despliegue! 🚀**
