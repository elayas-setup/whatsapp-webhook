# InstitutoFront
Frontend de mensajería programada del instituto (Create React App) conectado al backend de WhatsApp Cloud API.

## Configuración

1. Copia `.env.example` a `.env` y ajusta `REACT_APP_API_BASE` si cambias la URL del backend.
2. Instala e inicia en local:
   ```bash
   npm install
   npm start
   ```
   Abre `http://localhost:3000` y permite pop-ups si usas el modo antiguo de envío.

## Envío vía API Cloud

El servicio `enviarWhatsAppReal` ahora usa el backend (`/api/send`) que re-lanza el mensaje por WhatsApp Cloud API. Necesitas que el backend tenga `WHATSAPP_TOKEN` y `PHONE_NUMBER_ID` definidos.

## Comandos

- `npm start`: modo desarrollo.
- `npm run build`: build de producción.
