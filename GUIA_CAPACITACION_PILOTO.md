# 🏥 Guía de Capacitación - Grupo Piloto Medical Farma

Bienvenido al grupo piloto del Sistema Integrado de Medical Farma. Esta guía contiene los pasos esenciales para que puedas probar las nuevas herramientas de manera efectiva.

## 👥 Roles del Piloto
- **Vendedores (3)**: Encargados de la toma de pedidos y relación con farmacias/hospitales.
- **Administradores (2)**: Encargados de la validación de clientes y monitoreo de pagos.

---

## 📦 Para Vendedores: Gestión de Pedidos

### 1. Acceso al Portal
- Ingresa a: [http://localhost:3000/acceso](http://localhost:3000/acceso)
- Haz clic en **"Iniciar Sesión"**.
- Usa tus credenciales asignadas.

### 2. Navegación en el Catálogo
- Explora los productos disponibles.
- Puedes filtrar por marcas o buscar por nombre.
- **Acción a probar**: Agrega varios productos al carrito y ajusta las cantidades.

### 3. Finalización de Pedido
- Ve al carrito de compras.
- Confirma que los montos sean correctos.
- Haz clic en **"Finalizar Pedido"**.
- Verifica que recibas una confirmación en pantalla.

---

## ⚖️ Para Administradores: Gestión y Control

### 1. Panel de Administración
- Al iniciar sesión con tu cuenta de Gerencia, serás redirigido automáticamente a: `/admin/dashboard`.
- En la sección **"Usuarios"**, podrás ver las solicitudes pendientes.

### 2. Aprobación de Nuevos Clientes
- Revisa los datos de los nuevos registros.
- Cambia el estado a **"Aprobado"** o **"Suspendido"**.
- **Notificación**: Al cambiar el estado, el sistema enviará un email automático (vía n8n) al cliente informándole sobre la activación.

### 3. Alertas y Seguridad
- Recibirás correos de alerta ante:
    - Cambios de contraseña.
    - Intentos de inicio de sesión desde dispositivos nuevos.
    - Facturas vencidas (simulado en el piloto).

---

## 📝 Reporte de Feedback
Durante la prueba piloto, por favor anota:
1. ¿El sistema te pareció rápido?
2. ¿Algún paso te resultó confuso?
3. ¿Recibiste los emails de notificación correctamente?

**¡Gracias por ser parte de la evolución tecnológica de Medical Farma!**
