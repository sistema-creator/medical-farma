
# 🔗 CONEXIÓN CON TU N8N (DonWeb Cloud)

¡Perfecto! Al tener ya un **Cloud Server activo con n8n**, nos ahorramos toda la configuración inicial. Veo en tu captura que tienes:

*   **IP:** 66.97.44.201
*   **Host:** vps-5604742-x.dattaweb.com
*   **Sistema:** Ubuntu 24.04 con n8n preinstalado

---

## 🚀 PASO 1: Acceder a tu Panel de Control (n8n)

Necesito que entres a la siguiente dirección en tu navegador para ver si el "Cerebro" ya está despierto:

🔗 **http://66.97.44.201:5678/** (o prueba con https://vps-5604742-x.dattaweb.com)

Debería aparecerte una pantalla pidiendo **Usuario y Contraseña**.
*   **Si es la primera vez:** Te pedirá crear una cuenta de "Owner" (Dueño). Crea una con tu correo.
*   **Si ya tiene clave:** Necesito que me la proporciones (o crees un usuario para mí).

---

## 🔑 PASO 2: Datos que necesito para conectar

Para que yo pueda crear los flujos automáticos (Integrar AFIP, WhatsApp, etc.), necesito 3 cosas:

1.  **Credenciales de acceso a n8n:**
    *   Usuario (email):
    *   Contraseña:

2.  **Credenciales de Acceso al Servidor (SSH)** (Para instalar certificados de seguridad si hace falta):
    *   *Normalmente te llegan por mail al contratar el Cloud Server.*
    *   Usuario: `root`
    *   Contraseña: `(la que te envió DonWeb)`

---

## 📝 TU TAREA AHORA

1.  Intenta entrar a `http://66.97.44.201:5678/` desde tu navegador.
2.  Si entras, **confírmame si ves el panel de n8n**.
3.  Si NO entras (da error de conexión), avísame, porque significa que hay que "encender" el servicio desde la consola (SSH).

**Espero tu confirmación para proceder con la conexión.**
