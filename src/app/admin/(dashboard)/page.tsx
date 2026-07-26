import Link from "next/link";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isGoogleConfigured, getGoogleBlockedSlots } from "@/lib/google-calendar";
import { getAllBookings, bookingService } from "@/lib/admin/bookings-data";
import { dateKey } from "@/lib/availability";
import { formatIDR } from "@/lib/pricing";
import { DashboardCalendar, type CalendarBooking } from "@/components/admin/DashboardCalendar";
import type { DayOverrides } from "@/lib/availability";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const { google } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — there&apos;s nothing to show
        until real bookings start coming in. See the project README for the
        env vars this needs.
      </p>
    );
  }

  const supabase = await createClient();
  const now = new Date();

  const [bookings, { data: overrideRows }, { data: settings }, googleBlocked] = await Promise.all([
    getAllBookings(),
    supabase.from("day_overrides").select("booking_date, slots"),
    supabase.from("studio_settings").select("google_refresh_token").eq("id", true).single(),
    getGoogleBlockedSlots(startOfMonth(subMonths(now, 1)), endOfMonth(addMonths(now, 2))),
  ]);

  const overrides: DayOverrides = {};
  for (const row of overrideRows ?? []) {
    overrides[row.booking_date] = row.slots.length === 0 ? "closed" : row.slots;
  }
  const googleConnected = Boolean(settings?.google_refresh_token);

  const today = dateKey(now);
  const monthPrefix = today.slice(0, 7);

  const pendingVerification = bookings.filter(
    (b) => b.status === "pending_verification" && b.hold_expires_at > now.toISOString()
  ).length;
  const upcomingConfirmed = bookings.filter(
    (b) => b.status === "confirmed" && b.booking_date >= today
  ).length;

  const thisMonth = bookings.filter((b) => b.booking_date.startsWith(monthPrefix));
  const thisMonthSettled = thisMonth.filter(
    (b) => b.status === "confirmed" || b.status === "completed"
  );
  const thisMonthRevenue = thisMonthSettled.reduce(
    (sum, b) => sum + b.treatment_price + (b.extension_price ?? 0) + (b.removal_surcharge ?? 0),
    0
  );
  const thisMonthNoShows = thisMonth.filter((b) => b.status === "no_show").length;
  const thisMonthCancelled = thisMonth.filter((b) =>
    ["cancelled", "rejected", "expired"].includes(b.status)
  ).length;

  const stats: { label: string; value: string | number; href?: string }[] = [
    { label: "Pending Verification", value: pendingVerification, href: "/admin/bookings?status=pending_verification" },
    { label: "Upcoming Confirmed", value: upcomingConfirmed, href: "/admin/bookings?status=confirmed" },
    { label: "Bookings This Month", value: thisMonthSettled.length },
    { label: "Revenue This Month", value: formatIDR(thisMonthRevenue) },
    { label: "No-shows This Month", value: thisMonthNoShows },
    { label: "Cancelled / Expired This Month", value: thisMonthCancelled },
  ];

  const calendarBookings: CalendarBooking[] = bookings.map((b) => ({
    date: b.booking_date,
    time: b.booking_time,
    status: b.status,
    customerName: b.customer_name,
    service: bookingService(b),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Dashboard</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Overview of bookings, revenue, and the studio&apos;s schedule.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => {
          const Tile = (
            <div className="flex h-full flex-col gap-1 rounded-2xl border border-nude/60 bg-cream-dark/30 px-4 py-4">
              <p className="font-sans text-2xl font-semibold text-charcoal">{stat.value}</p>
              <p className="font-sans text-xs text-charcoal/60">{stat.label}</p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="transition-opacity hover:opacity-80">
              {Tile}
            </Link>
          ) : (
            <div key={stat.label}>{Tile}</div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-nude/60 bg-cream-dark/30 px-5 py-4">
        <span className="font-sans text-sm text-charcoal">
          Google Calendar:{" "}
          {googleConnected ? (
            <span className="text-rose-gold-dark">Connected</span>
          ) : (
            <span className="text-charcoal/50">Not connected</span>
          )}
        </span>
        {isGoogleConfigured ? (
          <a
            href="/api/google/connect"
            className="rounded-full bg-charcoal px-4 py-1.5 font-sans text-xs font-medium text-cream hover:bg-burgundy"
          >
            {googleConnected ? "Reconnect" : "Connect"}
          </a>
        ) : (
          <span className="font-sans text-xs text-charcoal/40">
            (Google OAuth credentials not set)
          </span>
        )}
        {google === "connected" && (
          <span className="font-sans text-xs text-rose-gold-dark">Connected successfully.</span>
        )}
        {google === "error" && (
          <span className="font-sans text-xs text-burgundy">
            Couldn&apos;t connect — please try again.
          </span>
        )}
      </div>

      <div>
        <h2 className="font-sans text-lg font-semibold text-charcoal">Schedule</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Tap a date to see its appointment, toggle which slots are open, or
          close the day entirely.
        </p>
        <div className="mt-4">
          <DashboardCalendar
            bookings={calendarBookings}
            initialOverrides={overrides}
            googleBlocked={googleBlocked}
          />
        </div>
      </div>
    </div>
  );
}
