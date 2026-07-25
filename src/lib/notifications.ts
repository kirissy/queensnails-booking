import { Resend } from "resend";
import { formatIDR } from "./pricing";
import { STUDIO_ADDRESS, POLICY_PARAGRAPHS } from "./policy";
import type { SlotTime } from "./availability";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Queensnails <booking@queensnails.id>";
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** No-op with a console note when Resend isn't configured, so the booking flow never breaks on a missing email key. */
function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("[notifications] RESEND_API_KEY not set — skipping email send.");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

export async function notifyOwnerOfNewReservation(params: {
  customerName: string;
  date: string;
  time: SlotTime;
}) {
  const resend = getResendClient();
  if (!resend || !OWNER_EMAIL) {
    if (!OWNER_EMAIL) console.warn("[notifications] OWNER_EMAIL not set — skipping owner alert.");
    return;
  }
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New reservation — ${params.customerName}, ${params.date} ${params.time}`,
    html: `
      <p>${params.customerName} just reserved ${params.date} at ${params.time} WIB and was sent payment instructions on WhatsApp.</p>
      <p>This slot is held for 60 minutes but not yet secured — check WhatsApp for their payment proof, then confirm or reject in the dashboard.</p>
      <p><a href="${SITE_URL}/admin">Open verification queue</a></p>
    `,
  });
}

export async function notifyCustomerReservation(params: {
  email: string;
  customerName: string;
  date: string;
  time: SlotTime;
}) {
  const resend = getResendClient();
  if (!resend) return;
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: params.email,
    subject: "Your slot is reserved — complete payment on WhatsApp",
    html: `
      <p>Hi ${params.customerName},</p>
      <p>Your slot for ${params.date} at ${params.time} WIB is reserved for the next 60 minutes.</p>
      <p>We've sent you a WhatsApp message with the deposit transfer details — please transfer Rp50,000 and reply there with your payment proof to confirm your booking. If we don't hear back in time, this slot will be released.</p>
    `,
  });
}

export async function notifyCustomerConfirmed(params: {
  email: string;
  customerName: string;
  date: string;
  time: SlotTime;
  treatmentName: string;
  extensionName?: string | null;
  depositAmount: number;
}) {
  const resend = getResendClient();
  if (!resend) return;
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: params.email,
    subject: "Your Queensnails appointment is confirmed",
    html: `
      <p>Hi ${params.customerName},</p>
      <p>Your appointment is confirmed:</p>
      <ul>
        <li>Service: ${params.treatmentName}${params.extensionName ? ` + ${params.extensionName}` : ""}</li>
        <li>Date: ${params.date} at ${params.time} WIB</li>
        <li>Deposit paid: ${formatIDR(params.depositAmount)}</li>
      </ul>
      <p>${STUDIO_ADDRESS}</p>
      <p>The remaining balance is paid in person after your service. Please arrive on time — we hold appointments for a maximum of 20 minutes.</p>
      <p>Need to change something? Contact us directly on WhatsApp or Instagram — bookings can't be self-cancelled once the deposit is paid.</p>
    `,
  });
}

export async function notifyCustomerRejected(params: {
  email: string;
  customerName: string;
  reason?: string | null;
}) {
  const resend = getResendClient();
  if (!resend) return;
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: params.email,
    subject: "We couldn't verify your proof of payment",
    html: `
      <p>Hi ${params.customerName},</p>
      <p>We weren't able to verify your proof of payment${params.reason ? `: ${params.reason}` : "."}</p>
      <p>Your slot has been released. Please message us on Instagram (@queensnailsid) or start a new booking with a clearer receipt.</p>
    `,
  });
}

export async function notifyCustomerReminder(params: {
  email: string;
  customerName: string;
  date: string;
  time: SlotTime;
}) {
  const resend = getResendClient();
  if (!resend) return;
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: params.email,
    subject: "Reminder: your Queensnails appointment is tomorrow",
    html: `
      <p>Hi ${params.customerName},</p>
      <p>Just a reminder — your appointment is tomorrow, ${params.date} at ${params.time} WIB.</p>
      <p>${STUDIO_ADDRESS}</p>
      <p>${POLICY_PARAGRAPHS[2]}</p>
    `,
  });
}

export async function notifyOwnerEvent(subject: string, message: string) {
  const resend = getResendClient();
  if (!resend || !OWNER_EMAIL) return;
  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: OWNER_EMAIL,
    subject,
    html: `<p>${message}</p>`,
  });
}
