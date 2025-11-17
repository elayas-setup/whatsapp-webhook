const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

if (!VERIFY_TOKEN) {
  console.warn(
    "No hay VERIFY_TOKEN definido. Configura la variable antes de verificar el webhook."
  );
}

app.use(express.json({ type: "*/*" }));
app.use(
  cors({
    origin: "*", // abrir para pruebas; restringe a tu dominio si lo deseas
  })
);

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Webhook WhatsApp listo", uptime: process.uptime() });
});

app.get("/webhook-whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Token inválido. Recibido:", token);
    res.sendStatus(403);
  }
});

app.post("/webhook-whatsapp", (req, res) => {
  console.log("📩 Webhook POST recibido:\n", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Endpoint para enviar mensajes vía Cloud API desde el frontend
app.post("/api/send", async (req, res) => {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    return res
      .status(500)
      .json({ success: false, error: "Falta WHATSAPP_TOKEN o PHONE_NUMBER_ID" });
  }

  const { to, body } = req.body || {};

  if (!to || !body) {
    return res.status(400).json({ success: false, error: "to y body son requeridos" });
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    const fbError = error?.response?.data || error.message;
    console.error("❌ Error enviando mensaje:", fbError);
    res.status(400).json({ success: false, error: fbError });
  }
});

app.listen(port, () => {
  console.log(`Servidor WhatsApp escuchando en puerto ${port}`);
});
