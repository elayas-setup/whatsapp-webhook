# Webhook WhatsApp Cloud

Backend mínimo listo para verificar el webhook de la API de WhatsApp Cloud y recibir eventos sin mantener un servidor encendido 24/7. Lo puedes ejecutar localmente o desplegarlo en cualquier proveedor serverless (Vercel, Render, Railway, Cloud Run, etc.).

## Requisitos

- Node.js 18+
- Una cadena de verificación que inventes (ej. `MI_TOKEN_SECRETO_123`)
- Una cuenta en el proveedor donde quieras desplegarlo (Vercel es el más directo)

## Configuración local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` con el contenido del `.env.example` y ajusta el `VERIFY_TOKEN`.
3. Inicia el servidor:
   ```bash
   npm start
   ```
4. Tu endpoint queda en `http://localhost:3000/webhook-whatsapp`.

## Prueba de verificación local

Simula la llamada que hará Meta:

```bash
curl "http://localhost:3000/webhook-whatsapp?hub.mode=subscribe&hub.verify_token=MI_TOKEN_SECRETO&hub.challenge=123456"
```

Si el token coincide, el servidor responde `123456` con estado 200; si no, 403.

## Despliegue rápido con Vercel

1. Sube este directorio a un repo (GitHub, GitLab, etc.).
2. En el panel de Vercel crea un nuevo proyecto desde el repo.
3. Define las variables de entorno en **Settings → Environment Variables**:
   - `VERIFY_TOKEN`: tu token inventado (mismo del panel de Meta).
   - `PORT`: opcional, Vercel asigna uno internamente.
4. Despliega. Obtendrás una URL del tipo `https://tuapp.vercel.app`.
5. El webhook quedará accesible en `https://tuapp.vercel.app/api/webhook-whatsapp` si lo montas como función serverless, o `https://tuapp.vercel.app/webhook-whatsapp` si usas el server Express con `vercel dev`. Para usar el servidor Express tal cual, despliega en Render/Railway (desde un repo basta con indicar `npm install` y `npm start`).

## Despliegue en Render (ejemplo)

1. En Render crea un **Web Service** conectado a tu repo.
2. Command: `npm start`.
3. En **Environment** agrega `VERIFY_TOKEN`.
4. Render te dará una URL pública (`https://tuapp.onrender.com`). Tu endpoint será `https://tuapp.onrender.com/webhook-whatsapp`.

## Cómo rellenar el panel de Meta

- **URL de devolución de llamada**: la URL pública del endpoint GET/POST (ej. `https://tuapp.onrender.com/webhook-whatsapp`).
- **Identificador de verificación**: exactamente la cadena que pusiste en `VERIFY_TOKEN`.

Pulsa **Verificar y guardar**. Meta hará el GET con `hub.challenge`; si el servidor está desplegado y el token coincide, responderá 200 y el webhook quedará activo. Después, cada mensaje real llegará como POST al mismo endpoint y lo verás en logs.
