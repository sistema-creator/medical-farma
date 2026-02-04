# 📋 PLAN DE IMPLEMENTACIÓN - MEDICAL PHARMA "SENSAÇÃO"

**Fecha de creación:** 31 de Enero 2026  
**Versión:** 1.0  
**Estado:** En planificación

---

## 🎯 VISIÓN GENERAL DEL PROYECTO

Sistema integral de gestión para Medical Pharma que incluye:
- Landing page institucional moderna
- Sistema de gestión completo "Medical Connect"
- Automatizaciones inteligentes con n8n
- Integración con AFIP (Argentina)
- Base de datos escalable en Supabase
- Despliegue en Ferozo Hosting

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
├─────────────────────────────────────────────────────────────┤
│  Landing Page          │  Medical Connect (Sistema Web)     │
│  (Next.js Static)      │  (Next.js + React)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE LÓGICA                            │
├─────────────────────────────────────────────────────────────┤
│  API Routes (Next.js)  │  n8n Workflows                     │
│  Validaciones          │  Automatizaciones                   │
│  Reglas de negocio     │  Integraciones                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
├─────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL   │  Supabase Storage                  │
│  Supabase Auth         │  Supabase Realtime                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 INTEGRACIONES EXTERNAS                       │
├─────────────────────────────────────────────────────────────┤
│  AFIP (Facturación)    │  WhatsApp Business API             │
│  Mercado Pago          │  Correo Argentino / Andreani       │
│  Google Drive          │  Email (SMTP)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 STACK TECNOLÓGICO

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (con 2FA)
- **Storage:** Supabase Storage
- **API:** Next.js API Routes + Supabase REST API
- **Automatizaciones:** n8n (self-hosted o cloud)

### Integraciones
- **Facturación:** AFIP SDK (Argentina)
- **Pagos:** Mercado Pago SDK
- **Mensajería:** WhatsApp Business API
- **Email:** Nodemailer (SMTP)
- **Logística:** APIs de Correo Argentino y Andreani

### DevOps
- **Hosting Web:** Ferozo (static export para landing + Node.js para app)
- **Hosting n8n:** Servidor dedicado o Railway/Render
- **Backups:** Google Drive + Supabase automated backups
- **Monitoring:** Supabase Dashboard + n8n logs

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales (15 tablas)

#### 1. **usuarios**
```sql
- id (uuid, PK)
- tipo_usuario (enum: 'cliente', 'vendedor', 'facturacion', 'despacho', 'compras', 'gerencia')
- perfil_id (FK a perfiles)
- nombre_completo (text)
- dni_cuit (text, unique)
- email (text, unique)
- whatsapp (text)
- institucion (text, nullable)
- estado (enum: 'pendiente', 'aprobado', 'rechazado', 'suspendido')
- fecha_alta (timestamp)
- autenticacion_2fa (boolean)
- preferencia_notificaciones (jsonb)
- avatar_url (text, nullable)
- created_at, updated_at
```

#### 2. **productos**
```sql
- id (uuid, PK)
- nombre (text)
- marcas (text[])
- descripcion_tecnica (text)
- medidas (text)
- stock_actual (integer)
- stock_minimo (integer)
- precio_unitario (decimal)
- precio_lote (decimal)
- categoria (text)
- ubicacion_almacen (text, nullable)
- imagen_url (text)
- estado (enum: 'activo', 'inactivo')
- created_at, updated_at
```

#### 3. **pedidos**
```sql
- id (uuid, PK)
- numero_pedido (text, unique)
- cliente_id (FK a usuarios)
- vendedor_id (FK a usuarios)
- productos (jsonb) -- [{producto_id, cantidad, precio}]
- subtotal (decimal)
- descuento (decimal)
- total (decimal)
- fecha_confirmacion (timestamp)
- fecha_entrega_estimada (timestamp)
- fecha_entrega_real (timestamp, nullable)
- fecha_facturacion (timestamp, nullable)
- tiempo_facturacion_horas (integer, nullable)
- estado_pedido (enum: 'cotizacion', 'confirmado', 'en_preparacion', 'despachado', 'entregado', 'cancelado')
- estado_pago (enum: 'pendiente', 'parcial', 'pagado')
- direccion_entrega (jsonb)
- comentarios (text)
- created_at, updated_at
```

#### 4. **despachos**
```sql
- id (uuid, PK)
- pedido_id (FK a pedidos)
- usuario_despacho_id (FK a usuarios)
- stock_corroborado (boolean)
- num_guia (text)
- transportista (text)
- fecha_retiro (timestamp)
- fecha_entrega_real (timestamp, nullable)
- recibido_por (text, nullable)
- estado_despacho (enum: 'pendiente', 'preparando', 'despachado', 'en_transito', 'entregado')
- link_seguimiento (text, nullable)
- created_at, updated_at
```

#### 5. **proveedores**
```sql
- id (uuid, PK)
- nombre (text)
- cuit (text, unique)
- contacto_nombre (text)
- telefono (text)
- email (text)
- productos_suministrados (text[])
- tiempo_entrega_promedio_dias (integer)
- condiciones_pago (text)
- calificacion (decimal) -- 0-5 estrellas
- logo_url (text, nullable)
- estado (enum: 'activo', 'inactivo')
- created_at, updated_at
```

#### 6. **listas_precios**
```sql
- id (uuid, PK)
- tipo_cliente (enum: 'minorista', 'mayorista', 'institucional', 'especial')
- producto_id (FK a productos)
- precio_unitario (decimal)
- precio_lote (decimal)
- descuento_porcentaje (decimal)
- vigencia_desde (date)
- vigencia_hasta (date, nullable)
- created_at, updated_at
```

#### 7. **comisiones**
```sql
- id (uuid, PK)
- vendedor_id (FK a usuarios)
- pedido_id (FK a pedidos)
- porcentaje (decimal)
- monto (decimal)
- fecha_liquidacion (date)
- estado_comision (enum: 'pendiente', 'aprobada', 'pagada')
- observaciones (text)
- created_at, updated_at
```

#### 8. **historial_pagos**
```sql
- id (uuid, PK)
- pedido_id (FK a pedidos)
- monto (decimal)
- fecha_pago (timestamp)
- metodo_pago (enum: 'efectivo', 'transferencia', 'mercadopago', 'cheque', 'otro')
- comprobante_url (text, nullable)
- link_pago (text, nullable)
- estado (enum: 'pendiente', 'confirmado', 'rechazado')
- created_at, updated_at
```

#### 9. **landing_page_contenido**
```sql
- id (uuid, PK)
- seccion (enum: 'hero', 'historia', 'mision', 'vision', 'valores', 'socios', 'productos', 'testimonios', 'contacto')
- titulo (text)
- contenido (text)
- imagen_url (text, nullable)
- orden (integer)
- estado (enum: 'activo', 'inactivo')
- configuracion (jsonb) -- datos específicos por sección
- created_at, updated_at
```

#### 10. **alertas**
```sql
- id (uuid, PK)
- tipo_alerta (enum: 'stock_bajo', 'pedido_pendiente', 'pago_vencido', 'entrega_retrasada', 'sistema')
- elemento_relacionado_tipo (text) -- 'producto', 'pedido', etc.
- elemento_relacionado_id (uuid)
- mensaje (text)
- prioridad (enum: 'baja', 'media', 'alta', 'critica')
- usuario_notificado_id (FK a usuarios, nullable)
- leida (boolean)
- fecha_alerta (timestamp)
- created_at, updated_at
```

#### 11. **perfiles**
```sql
- id (uuid, PK)
- nombre (text, unique)
- descripcion (text)
- es_predefinido (boolean)
- created_at, updated_at
```

#### 12. **permisos**
```sql
- id (uuid, PK)
- codigo (text, unique) -- 'ver_productos', 'editar_precios', etc.
- nombre (text)
- descripcion (text)
- modulo (text) -- 'productos', 'ventas', etc.
- created_at, updated_at
```

#### 13. **asignacion_permisos**
```sql
- id (uuid, PK)
- perfil_id (FK a perfiles, nullable)
- usuario_id (FK a usuarios, nullable)
- permiso_id (FK a permisos)
- estado (boolean)
- fecha_asignacion (timestamp)
- usuario_modifico_id (FK a usuarios)
- created_at, updated_at
```

#### 14. **historial_uso**
```sql
- id (uuid, PK)
- usuario_id (FK a usuarios)
- accion (text)
- modulo (text)
- detalles (jsonb)
- fecha_hora (timestamp)
- dispositivo (text)
- ip (text)
- ubicacion (text, nullable)
- created_at
```

#### 15. **bitacora_cambios**
```sql
- id (uuid, PK)
- tipo_cambio (enum: 'crear', 'editar', 'eliminar')
- tabla_afectada (text)
- registro_id (uuid)
- datos_anterior (jsonb, nullable)
- datos_nuevo (jsonb)
- usuario_modifico_id (FK a usuarios)
- motivo (text)
- reversible (boolean)
- fecha_cambio (timestamp)
- created_at
```

---

## 🚀 FASES DE DESARROLLO

### **FASE 0: PREPARACIÓN Y CONFIGURACIÓN** (Semana 1)
**Duración estimada:** 3-5 días

#### Tareas:
1. ✅ Crear cuenta en Supabase
2. ✅ Configurar proyecto en Supabase
3. ✅ Crear todas las tablas de la base de datos
4. ✅ Configurar Row Level Security (RLS)
5. ✅ Configurar Supabase Auth con 2FA
6. ✅ Configurar Supabase Storage para imágenes
7. ✅ Instalar y configurar n8n (Railway o servidor propio)
8. ✅ Configurar credenciales de AFIP
9. ✅ Configurar WhatsApp Business API
10. ✅ Crear estructura de carpetas del proyecto

**Entregables:**
- Base de datos completa y funcional
- n8n instalado y conectado
- Credenciales de integraciones configuradas
- Documentación de accesos

---

### **FASE 1: SISTEMA DE AUTENTICACIÓN Y USUARIOS** (Semana 2)
**Duración estimada:** 5-7 días

#### Módulos a desarrollar:
1. **Sistema de autenticación**
   - Login con email/contraseña
   - Autenticación de 2 factores (2FA)
   - Recuperación de contraseña
   - Sesiones seguras

2. **Gestión de usuarios**
   - Registro de usuarios externos (clientes)
   - Registro de usuarios internos (staff)
   - Validación de usuarios pendientes
   - Panel de administración de usuarios
   - Asignación de perfiles y permisos

3. **Sistema de permisos**
   - Perfiles predefinidos (vendedor, facturación, despacho, etc.)
   - Permisos granulares por módulo
   - Interfaz visual para asignar permisos
   - Middleware de validación de permisos

**Entregables:**
- Sistema de login funcional
- Panel de gestión de usuarios
- Sistema de permisos operativo
- Flujo n8n de validación de usuarios

---

### **FASE 2: MÓDULO DE PRODUCTOS Y STOCK** (Semana 3)
**Duración estimada:** 5-7 días

#### Funcionalidades:
1. **Gestión de productos**
   - CRUD completo de productos
   - Carga masiva desde Excel
   - Búsqueda inteligente y filtros
   - Categorización de productos
   - Gestión de imágenes

2. **Control de stock**
   - Visualización de stock en tiempo real
   - Alertas de stock bajo
   - Historial de movimientos
   - Ubicaciones en almacén
   - Sugerencias de reposición automática

3. **Listas de precios**
   - Precios por tipo de cliente
   - Descuentos configurables
   - Vigencias de precios
   - Comparador de precios

**Entregables:**
- Panel de productos completo
- Sistema de alertas de stock
- Flujo n8n de notificaciones de stock bajo
- Importador de productos desde Excel

---

### **FASE 3: MÓDULO DE PROVEEDORES** (Semana 4)
**Duración estimada:** 3-4 días

#### Funcionalidades:
1. **Gestión de proveedores**
   - CRUD de proveedores
   - Ficha completa con datos de contacto
   - Productos suministrados
   - Calificación de proveedores

2. **Seguimiento de pedidos a proveedores**
   - Registro de pedidos
   - Alertas por retrasos
   - Comparación de precios entre proveedores
   - Historial de compras

**Entregables:**
- Panel de proveedores
- Sistema de calificación
- Flujo n8n de alertas de retrasos

---

### **FASE 4: MÓDULO DE VENTAS Y FACTURACIÓN** (Semanas 5-6)
**Duración estimada:** 10-12 días

#### Funcionalidades:
1. **Cotizaciones**
   - Creación de cotizaciones
   - Envío por email/WhatsApp
   - Conversión a pedido

2. **Pedidos**
   - Gestión completa de pedidos
   - Estados del pedido
   - Historial y seguimiento
   - Portal del cliente

3. **Facturación electrónica**
   - Integración con AFIP
   - Generación de facturas A, B, C
   - Envío automático al cliente
   - Registro de pagos
   - Integración con Mercado Pago

4. **Control de pagos**
   - Historial de pagos
   - Estados de pago
   - Recordatorios automáticos
   - Links de pago online

**Entregables:**
- Sistema de cotizaciones
- Sistema de pedidos completo
- Facturación electrónica AFIP
- Portal del cliente
- Flujos n8n de automatización de ventas

---

### **FASE 5: MÓDULO DE COMISIONES** (Semana 7)
**Duración estimada:** 3-4 días

#### Funcionalidades:
1. **Configuración de comisiones**
   - Porcentajes por producto/vendedor
   - Reglas de cálculo
   - Excepciones

2. **Cálculo automático**
   - Cálculo al confirmar pago
   - Visualización en tiempo real
   - Exportación para nóminas

**Entregables:**
- Panel de comisiones
- Calculadora de comisiones
- Reportes exportables

---

### **FASE 6: MÓDULO DE DESPACHO Y LOGÍSTICA** (Semana 8)
**Duración estimada:** 5-7 días

#### Funcionalidades:
1. **Gestión de despachos**
   - Remitos pendientes
   - Corroboración de stock
   - Registro de envíos
   - Priorización de pedidos urgentes

2. **Integración con transportistas**
   - Correo Argentino API
   - Andreani API
   - Seguimiento automático
   - Confirmación de entrega

3. **Notificaciones al cliente**
   - Envío despachado
   - En tránsito
   - Entregado

**Entregables:**
- Panel de despacho
- Integración con transportistas
- Flujos n8n de seguimiento de envíos
- Sistema de confirmación de entregas

---

### **FASE 7: MÓDULO DE ESTADÍSTICAS Y REPORTES** (Semana 9)
**Duración estimada:** 5-6 días

#### Funcionalidades:
1. **Dashboard interactivo**
   - Métricas en tiempo real
   - Gráficos dinámicos
   - Filtros personalizables

2. **Reportes automáticos**
   - Ventas mensuales
   - Productos más vendidos
   - Desempeño de vendedores
   - Tiempos de facturación
   - Stock crítico

3. **Predicciones**
   - Tendencias de ventas
   - Demanda de productos
   - Sugerencias de compra

**Entregables:**
- Dashboard completo
- Generador de reportes
- Flujo n8n de reportes automáticos
- Exportación a Excel/PDF

---

### **FASE 8: LANDING PAGE INSTITUCIONAL** (Semana 10)
**Duración estimada:** 4-5 días

#### Secciones:
1. Hero con imagen de fondo
2. Historia con timeline
3. Misión, Visión, Valores
4. Socios comerciales
5. Productos destacados
6. Testimonios
7. Contacto con formulario

#### Funcionalidades:
- Diseño responsive
- Animaciones suaves
- Panel de edición CMS
- Formulario de contacto con notificaciones

**Entregables:**
- Landing page completa
- Panel CMS para edición
- Formulario de contacto funcional

---

### **FASE 9: SEGURIDAD Y RESPALDOS** (Semana 11)
**Duración estimada:** 3-4 días

#### Funcionalidades:
1. **Respaldos automáticos**
   - Configuración de backups diarios
   - Almacenamiento en Google Drive
   - Restauración de backups

2. **Seguridad avanzada**
   - Cifrado de datos sensibles
   - Auditoría de accesos
   - Detección de accesos sospechosos
   - Rate limiting

3. **Bitácora de cambios**
   - Registro detallado
   - Opción de reversión
   - Motivos obligatorios

**Entregables:**
- Sistema de backups automático
- Auditoría de seguridad
- Bitácora funcional

---

### **FASE 10: INTEGRACIONES Y AUTOMATIZACIONES** (Semana 12)
**Duración estimada:** 5-7 días

#### Flujos n8n a crear:
1. Registro y validación de usuarios
2. Consultas por WhatsApp inteligentes
3. Cotización y confirmación de pedidos
4. Alertas de stock bajo
5. Seguimiento de envíos
6. Recordatorios de pago
7. Reportes automáticos
8. Sincronización con Google Calendar
9. Notificaciones multi-canal

**Entregables:**
- 9+ flujos n8n operativos
- Integración WhatsApp Business
- Integración con AFIP
- Integración con Mercado Pago
- Integración con transportistas

---

### **FASE 11: TESTING Y OPTIMIZACIÓN** (Semana 13)
**Duración estimada:** 5-7 días

#### Actividades:
1. Testing de todos los módulos
2. Pruebas de integración
3. Pruebas de seguridad
4. Optimización de rendimiento
5. Corrección de bugs
6. Pruebas de carga
7. Testing en dispositivos móviles

**Entregables:**
- Sistema completamente testeado
- Reporte de bugs corregidos
- Métricas de rendimiento

---

### **FASE 12: DOCUMENTACIÓN Y CAPACITACIÓN** (Semana 14)
**Duración estimada:** 4-5 días

#### Entregables:
1. **Manual de usuario por perfil**
   - Vendedores
   - Facturación
   - Despacho
   - Compras
   - Gerencia
   - Clientes

2. **Video tutoriales**
   - Cómo registrar un pedido
   - Cómo emitir una factura
   - Cómo gestionar stock
   - Cómo usar el portal del cliente

3. **Documentación técnica**
   - Arquitectura del sistema
   - API endpoints
   - Flujos n8n
   - Guía de mantenimiento

**Entregables:**
- Manuales completos
- 10+ video tutoriales
- Documentación técnica

---

### **FASE 13: DESPLIEGUE Y PUESTA EN PRODUCCIÓN** (Semana 15)
**Duración estimada:** 3-4 días

#### Actividades:
1. Configuración de Ferozo para hosting
2. Despliegue de la aplicación
3. Configuración de dominio
4. Configuración de SSL
5. Migración de datos (si aplica)
6. Pruebas en producción
7. Monitoreo inicial

**Entregables:**
- Sistema en producción
- Dominio configurado
- SSL activo
- Monitoreo configurado

---

## 📅 CRONOGRAMA GENERAL

| Fase | Descripción | Semanas | Días |
|------|-------------|---------|------|
| 0 | Preparación y configuración | 1 | 3-5 |
| 1 | Autenticación y usuarios | 1 | 5-7 |
| 2 | Productos y stock | 1 | 5-7 |
| 3 | Proveedores | 1 | 3-4 |
| 4 | Ventas y facturación | 2 | 10-12 |
| 5 | Comisiones | 1 | 3-4 |
| 6 | Despacho y logística | 1 | 5-7 |
| 7 | Estadísticas y reportes | 1 | 5-6 |
| 8 | Landing page | 1 | 4-5 |
| 9 | Seguridad y respaldos | 1 | 3-4 |
| 10 | Integraciones n8n | 1 | 5-7 |
| 11 | Testing y optimización | 1 | 5-7 |
| 12 | Documentación | 1 | 4-5 |
| 13 | Despliegue | 1 | 3-4 |

**TOTAL: 15 semanas (aproximadamente 3.5 meses)**

---

## 💰 ESTIMACIÓN DE COSTOS MENSUALES

### Servicios Cloud:
- **Supabase:** $0 - $25/mes (plan Free o Pro)
- **n8n:** $0 - $20/mes (self-hosted en Railway/Render)
- **Ferozo Hosting:** Según plan contratado
- **WhatsApp Business API:** Variable según uso
- **Google Drive:** $0 (incluido en cuenta Google)

### APIs y Servicios:
- **AFIP:** Gratis (requiere certificado digital)
- **Mercado Pago:** Comisión por transacción
- **Correo Argentino/Andreani:** Según contrato

**Total estimado: $50-100 USD/mes** (sin contar hosting Ferozo)

---

## ⚠️ RIESGOS Y CONSIDERACIONES

### Riesgos Técnicos:
1. **Integración con AFIP:** Puede ser compleja, requiere certificado digital
2. **WhatsApp Business API:** Requiere aprobación de Meta
3. **Hosting en Ferozo:** Verificar si soporta Node.js o solo static
4. **Límites de Supabase:** Plan free tiene límites de requests

### Mitigaciones:
1. Comenzar trámites de AFIP en Fase 0
2. Solicitar WhatsApp Business API temprano
3. Confirmar capacidades de Ferozo antes de Fase 13
4. Monitorear uso de Supabase y escalar si es necesario

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

Según tu requerimiento de priorizar las integraciones:

### Prioridad CRÍTICA (10/10):
1. Integración con AFIP (facturación electrónica)
2. Integración con WhatsApp Business API
3. Integración con Supabase (base de datos)

### Prioridad ALTA (8-9/10):
4. Integración con Mercado Pago
5. Integración con transportistas
6. Sistema de notificaciones multi-canal

### Prioridad MEDIA (6-7/10):
7. Integración con Google Calendar
8. Integración con Google Drive (backups)
9. Sistema de reportes automáticos

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

### Para comenzar AHORA:

1. **Configurar Supabase** (30 minutos)
   - Crear cuenta
   - Crear proyecto
   - Obtener credenciales

2. **Configurar n8n** (1-2 horas)
   - Decidir: ¿Self-hosted o cloud?
   - Instalación
   - Configuración inicial

3. **Tramitar credenciales AFIP** (varios días)
   - Solicitar certificado digital
   - Configurar acceso a web services

4. **Solicitar WhatsApp Business API** (varios días)
   - Crear cuenta de Meta Business
   - Solicitar acceso a API
   - Verificar número de teléfono

¿Quieres que comencemos con el **Paso 1: Configurar Supabase**?
