export async function sendWhatsAppMessage(phone: string, message: string) {
  const baseUrl = process.env.WHATSAPP_SERVICE_URL;

  if (!baseUrl) {
    console.warn("WHATSAPP_SERVICE_URL is not defined in environment variables.");
    return { status: "error", message: "Service URL not configured" };
  }

  try {
    const response = await fetch(`${baseUrl}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, message }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return { status: "success", data };
    }

    console.error("WhatsApp Service Error:", data);
    return { status: "error", message: data.message || "Failed to send message" };
  } catch (error) {
    console.error("WhatsApp Service Exception:", error);
    return { status: "error", message: "Failed to connect to WhatsApp Service" };
  }
}
