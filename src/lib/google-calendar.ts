import { google } from "googleapis";
import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import type { BookingRow } from "./supabase/types";
import { STUDIO_TIMEZONE, type DateKey, type SlotTime } from "./availability";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const isGoogleConfigured = Boolean(
  GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REDIRECT_URI
);

/** Slot durations aren't tracked precisely (2-4h, varies by design) — these are the widest candidate windows used only to detect Google Calendar overlaps. */
const SLOT_WINDOWS: Record<SlotTime, { startHour: number; endHour: number }> = {
  "11:00": { startHour: 11, endHour: 15 },
  "18:00": { startHour: 18, endHour: 22 },
};

function getOAuthClient() {
  if (!isGoogleConfigured) {
    throw new Error("Google Calendar isn't configured (GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI).");
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
}

export function getGoogleAuthUrl(): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function saveGoogleAuthCode(code: string): Promise<void> {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google didn't return a refresh token — revoke prior access at https://myaccount.google.com/permissions and reconnect."
    );
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("studio_settings")
    .update({ google_refresh_token: tokens.refresh_token })
    .eq("id", true);
  if (error) throw new Error(error.message);
}

async function getAuthorizedCalendarClient() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("studio_settings")
    .select("google_refresh_token, google_calendar_id")
    .eq("id", true)
    .single();

  if (!data?.google_refresh_token) return null;

  const client = getOAuthClient();
  client.setCredentials({ refresh_token: data.google_refresh_token });
  return {
    calendar: google.calendar({ version: "v3", auth: client }),
    calendarId: data.google_calendar_id ?? "primary",
  };
}

export async function createCalendarEventForBooking(
  booking: BookingRow
): Promise<string | null> {
  if (!isGoogleConfigured || !isSupabaseConfigured) return null;
  const authorized = await getAuthorizedCalendarClient();
  if (!authorized) return null;

  const { startHour, endHour } = SLOT_WINDOWS[booking.booking_time];
  const service = booking.extension_name
    ? `${booking.treatment_name} + ${booking.extension_name}`
    : booking.treatment_name;

  const event = await authorized.calendar.events.insert({
    calendarId: authorized.calendarId,
    requestBody: {
      summary: `${booking.customer_name} — ${service}`,
      description: [
        `Phone: ${booking.customer_phone}`,
        `Email: ${booking.customer_email}`,
        booking.customer_notes ? `Notes: ${booking.customer_notes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: `${booking.booking_date}T${String(startHour).padStart(2, "0")}:00:00`,
        timeZone: STUDIO_TIMEZONE,
      },
      end: {
        dateTime: `${booking.booking_date}T${String(endHour).padStart(2, "0")}:00:00`,
        timeZone: STUDIO_TIMEZONE,
      },
    },
  });

  return event.data.id ?? null;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const authorized = await getAuthorizedCalendarClient();
  if (!authorized) return;
  await authorized.calendar.events
    .delete({ calendarId: authorized.calendarId, eventId })
    .catch(() => {});
}

/**
 * Slots the owner has blocked directly on her Google Calendar (personal time,
 * off-platform bookings) — layered on top of day_overrides / bookings so the
 * app treats them as unavailable too.
 */
export async function getGoogleBlockedSlots(
  startDate: Date,
  endDate: Date
): Promise<Record<DateKey, SlotTime[]>> {
  const blocked: Record<DateKey, SlotTime[]> = {};
  if (!isGoogleConfigured) return blocked;

  const authorized = await getAuthorizedCalendarClient();
  if (!authorized) return blocked;

  const { data } = await authorized.calendar.freebusy.query({
    requestBody: {
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      timeZone: STUDIO_TIMEZONE,
      items: [{ id: authorized.calendarId }],
    },
  });

  const busy = data.calendars?.[authorized.calendarId]?.busy ?? [];

  for (const range of busy) {
    if (!range.start || !range.end) continue;
    const busyStart = new Date(range.start);
    const busyEnd = new Date(range.end);

    for (
      let d = new Date(busyStart);
      d <= busyEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().slice(0, 10);
      for (const time of Object.keys(SLOT_WINDOWS) as SlotTime[]) {
        const { startHour, endHour } = SLOT_WINDOWS[time];
        const windowStart = new Date(`${dateStr}T${String(startHour).padStart(2, "0")}:00:00`);
        const windowEnd = new Date(`${dateStr}T${String(endHour).padStart(2, "0")}:00:00`);
        const overlaps = busyStart < windowEnd && busyEnd > windowStart;
        if (overlaps) {
          blocked[dateStr] = [...(blocked[dateStr] ?? []), time];
        }
      }
    }
  }

  return blocked;
}
