# Instrucciones de Fase 1: Configuración

Has completado la generación de archivos para la Fase 1. Sigue estos pasos para finalizar la configuración.

## 1. Configurar n8n (Docker)
1.  Abre una terminal en la carpeta `n8n_setup`.
2.  Ejecuta `docker-compose up -d`.
3.  Accede a `http://localhost:5678`.

## 2. Configurar Usuarios de Prueba
1.  Obtén tu `service_role_secret` desde el Dashboard de Supabase (Settings > API).
2.  Agrega la clave a tu archivo `.env.local`:
    ```bash
    SUPABASE_SERVICE_ROLE_KEY=eyJ...
    ```
3.  Instala las dependencias del script (si es necesario):
    `npm install dotenv`
4.  Ejecuta el script de creación de usuarios:
    `node scripts/seed-users.js`
5.  Esto creará:
    - `admin@medicalfarma.com` / `Password123!`
    - `vendedor@medicalfarma.com` / `Password123!`

## 3. Verificar Interfaz de Plantillas
1.  Inicia tu servidor Next.js: `npm run dev`
2.  Ve a `http://localhost:3000/admin/templates`.
3.  Crea una nueva plantilla de prueba.

## Estado Actual
- ✅ **Base de Datos**: Tabla `templates` creada, roles actualizados.
- ✅ **API**: Endpoint `/api/n8n/health` listo.
- ✅ **UI**: Panel de Plantillas básico creado.
- ⏳ **n8n**: Archivos listos, requiere ejecución de Docker.
- ⏳ **Usuarios**: Script listo, requiere ejecución manual con clave secreta.
