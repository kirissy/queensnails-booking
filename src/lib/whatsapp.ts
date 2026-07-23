/**
 * No WhatsApp Business API is configured — spec explicitly allows click-to-chat
 * as the "bonus" channel instead. This just builds wa.me deep links; sending
 * still requires a human (owner or customer) to tap through.
 */
export function waChatLink(phone: string, message?: string): string {
  const digits = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const url = `https://wa.me/${digits}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
