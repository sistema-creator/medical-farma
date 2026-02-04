# 📘 GUÍA PASO A PASO: INTEGRACIONES (Explicación No Técnica)

Esta guía explica qué necesitamos para la **Fase 4** de forma sencilla, sin términos complicados de programación.

---

## 1️⃣ PRIMER DESAFÍO: EL CEREBRO DE AUTOMATIZACIÓN (n8n)

### ¿Qué es y para qué sirve?
Imagine que **n8n** es un **secretario digital muy eficiente** que trabaja las 24 horas.
- **Sin n8n:** Cuando entra un pedido, alguien tiene que mirar el sistema, abrir WhatsApp web, escribirle al cliente, abrir la página de AFIP, hacer la factura...
- **Con n8n:** El sistema avisa al secretario (n8n) y él hace todo eso solo en segundos.

### ¿Qué necesito de usted?
Este "secretario" necesita una oficina donde vivir (un servidor). Tenemos dos opciones:

#### OPCIÓN A: PROPIO SERVIDOR (Recomendado si ya tiene Ferozo VPS)
Si usted contrato un **VPS (Servidor Privado Virtual)** en Ferozo o DonWeb, podemos instalarlo ahí.
*   **Costo:** Ya incluido en su hosting (si es VPS).
*   **Lo que necesito:**
    *   Dirección IP del servidor (ej: `190.23.12.55`)
    *   Usuario (normalmente `root`)
    *   Contraseña

#### OPCIÓN B: FERROCARRIL (Railway - Nube Económica)
Es un servicio donde alquilamos un espacio pequeño solo para este robot.
*   **Costo:** Unos $5 USD/mes aprox.
*   **Lo que necesito:** Que cree una cuenta en [Railway.app](https://railway.app/) y me de acceso, o yo le guío para crearlo.

#### OPCIÓN C: NUBE OFICIAL (n8n Cloud)
Es la opción más fácil y estable, pero más cara.
*   **Costo:** Unos $20-30 USD/mes.
*   **Lo que necesito:** Usuario y contraseña de su cuenta en [n8n.io](https://n8n.io/).

---

## 2️⃣ SEGUNDO DESAFÍO: LA LLAVE DE AFIP (Facturación)

### ¿Qué es?
Para que su sistema web pueda crear facturas reales (o de prueba), AFIP exige una **"llave digital"** (Certificado). Es un archivo que le dice a AFIP: "Hola, soy el sistema de Medical Farma y tengo permiso de Pablo para facturar".

### ¿Qué vamos a hacer primero?
No vamos a emitir facturas reales todavía. Vamos a trabajar en **MODO TESTING (Homologación)**. Esto nos permite emitir miles de facturas de prueba sin validez fiscal ni deuda real, para verificar que todo funcione perfecto.

### 📝 TAREA: Cómo conseguir los certificados de prueba

Necesito que siga estos pasos en la página de AFIP (o se los pida a su contador):

1.  Ingrese a la web de **AFIP** con su CUIT y Clave Fiscal.
2.  Busque el servicio **"WSASS - Autogestión Certificados Homologación"**.
    *   *Si no aparece, debe darlo de alta desde "Administrador de Relaciones de Clave Fiscal".*
3.  Dentro de WSASS, cree un nuevo **Certificado (Alias)**. Póngale de nombre `medical_testing`.
4.  El sistema le pedirá un archivo llamado `.csr`. **Yo puedo generarle ese archivo si me dice los datos de su empresa.**
5.  Una vez subido, AFIP le dejará descargar un archivo `.crt` (Certificado).
6.  Ese archivo `.crt` es el que necesito.

**¿Le parece muy complicado?**
Si prefiere, puedo crear yo un archivo de "Solicitud de Certificado" de prueba genérico para avanzar, pero lo ideal es usar el suyo para que quede vinculado a su CUIT de prueba.

---

## 3️⃣ TERCER DESAFÍO: WHATSAPP (Meta)

### ¿Qué es?
Para que el sistema mande mensajes automáticos (ej: "Su pedido salió"), no puede usar su celular personal directamente. Debe usar la **API de WhatsApp**.

### ¿Qué necesito?
1.  Una cuenta en **Facebook Business Manager**.
2.  Un número de teléfono que **NO** tenga WhatsApp activo actualmente (o estar dispuesto a borrar el WhatsApp de un número existente para transformarlo en robot).

---

## ✅ RESUMEN DE LO QUE NECESITO AHORA

Para avanzar hoy mismo, por favor responda estas preguntas:

1.  **¿Sobre n8n (El Robot):** ¿Tiene un VPS en Ferozo, prefiere Railway ($5), o la nube oficial ($20)?
2.  **Sobre AFIP:** ¿Se anima a generar el certificado de prueba (Testing) si le paso una guía detallada, o prefiere que lo veamos juntos más adelante?

**Mi recomendación:** Empecemos instalando **n8n** (punto 1). Simplemente dígame qué opción prefiere y yo me encargo de la instalación técnica.
