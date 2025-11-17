const API_BASE =
  process.env.REACT_APP_API_BASE || "https://whatsapp-webhook-44tw.onrender.com";

export async function enviarMensajeCloud(to, body) {
  const resp = await fetch(`${API_BASE}/api/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, body }),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.error || "Error enviando mensaje");
  }

  return resp.json();
}

