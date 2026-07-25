const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME ?? "booking_slot_reserved";
const WHATSAPP_TEMPLATE_LANGUAGE = process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "en";

export const isWhatsAppConfigured = Boolean(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID);

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
}

/** Manual click-to-chat link — still used by the admin dashboard to jump into a customer's chat. */
export function waChatLink(phone: string, message?: string): string {
  const url = `https://wa.me/${normalizePhone(phone)}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/**
 * Sends the "your slot is reserved" message automatically via the WhatsApp
 * Cloud API. Requires a WhatsApp Business Platform setup through Meta — see
 * README. This has to go through a pre-approved message TEMPLATE, not free
 * text, since the business is initiating contact rather than replying
 * within a customer-opened conversation window. Submit a template named
 * WHATSAPP_TEMPLATE_NAME (default "booking_slot_reserved") with this body
 * and exactly 3 variables, in this order — name, date, time:
 *
 *   Hi {{1}}, your queensnails appointment on {{2}} at {{3}} WIB is
 *   reserved for the next 60 minutes. Please transfer Rp50,000 to BCA
 *   5490409051 (Aurelia Queena) and reply here with your payment proof to
 *   confirm. If we don't receive it in time, this slot will be released.
 *
 * No-ops (logs a warning) if not configured, so the booking flow never
 * breaks on a missing WhatsApp setup — the reservation email still goes
 * out either way.
 */
export async function sendReservationWhatsApp(params: {
  phone: string;
  customerName: string;
  date: string;
  time: string;
}): Promise<void> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("[whatsapp] WHATSAPP_ACCESS_TOKEN/WHATSAPP_PHONE_NUMBER_ID not set — skipping WhatsApp message.");
    return;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: normalizePhone(params.phone),
          type: "template",
          template: {
            name: WHATSAPP_TEMPLATE_NAME,
            language: { code: WHATSAPP_TEMPLATE_LANGUAGE },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: params.customerName },
                  { type: "text", text: params.date },
                  { type: "text", text: params.time },
                ],
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("[whatsapp] send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[whatsapp] send error", err);
  }
}
