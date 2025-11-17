import { enviarMensajeCloud } from './apiService';

/**
 * Envía el mensaje usando la API de WhatsApp Cloud a través del backend.
 * No abre ventanas; delega en el endpoint /api/send del servidor.
 */
export const enviarWhatsAppReal = async (numeroDestino, mensaje, nombreDocente) => {
  try {
    const numeroLimpio = numeroDestino.replace(/[^\d+]/g, '');
    const mensajeCompleto = `${mensaje}\n\n---\n_Enviado a: ${nombreDocente}_`;

    const data = await enviarMensajeCloud(numeroLimpio, mensajeCompleto);

    return {
      success: true,
      canal: 'whatsapp-cloud',
      hacia: numeroDestino,
      nombreDestino: nombreDocente,
      response: data
    };
  } catch (error) {
    return {
      success: false,
      canal: 'whatsapp-cloud',
      error: error.message
    };
  }
};

export const getAdminWhatsApp = () => 'API Cloud';
