const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

if (!VERIFY_TOKEN) {
  console.warn(
    "No hay VERIFY_TOKEN definido. Configura la variable antes de verificar el webhook."
  );
}

app.use(express.json({ type: "*/*" }));

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

app.listen(port, () => {
  console.log(`Servidor WhatsApp escuchando en puerto ${port}`);
});
