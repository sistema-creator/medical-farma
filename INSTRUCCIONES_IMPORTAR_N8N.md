# 🧠 INSTRUCCIONES DE IMPORTACIÓN (n8n)

⚠️ **IMPORTANTE:** He generado los flujos (cerebros) en archivos para que los importes. Es más seguro y rápido que dar acceso completo al asistente.

## PASOS PARA ACTIVARLOS:

1.  **Descarga** la carpeta `n8n_workflows` que acabo de crear en tu proyecto.
2.  Ingresa a tu n8n: [https://vps-5604742-x.dattaweb.com/](https://vps-5604742-x.dattaweb.com/)
3.  En el menú lateral, ve a **"Workflows"**.
4.  Arriba a la derecha, busca el botón o menú **"Add Workflow"** y selecciona **"Import from File"** (Importar desde archivo).
5.  Sube los 3 archivos `.json` uno por uno:
    *   `1_Nuevo_Pedido.json`
    *   `2_Alerta_Stock.json`
    *   `3_Validacion_Cliente.json`
6.  Una vez importados, entra a cada uno y haz clic en **"Activate"** (el interruptor arriba a la derecha).

---

## 🔧 CONFIGURACIÓN FINAL (Dentro de n8n)

Para que envíen correos de verdad, necesitarás configurar el nodo "Email" dentro de cada flujo:
1.  Haz doble clic en el nodo **"Email a..."**.
2.  Donde dice **"Credentials"**, selecciona "Create New".
3.  Ingresa los datos de tu servidor SMTP (Gmail, Outlook o DonWeb):
    *   **User:** tu-email@dominio.com
    *   **Password:** tu contraseña
    *   **Host:** smtp.gmail.com (o el que corresponda)
    *   **Port:** 465 (SSL) o 587 (TLS)

¡Listo! Tu sistema ya tendrá cerebro propio. 🧠
