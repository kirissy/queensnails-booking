import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { STUDIO_ADDRESS } from "@/lib/policy";
import { INCLUDED_ITEMS } from "@/lib/pricing";

const FAQS: { question: string; answer: React.ReactNode }[] = [
  {
    question: "How do I book an appointment?",
    answer:
      "Book online — choose a treatment, pick an available date and time, fill in your details, and pay the Rp 50,000 deposit by bank transfer. Your booking is confirmed instantly once you submit.",
  },
  {
    question: "Is the deposit refundable?",
    answer:
      "No. The deposit is non-refundable, and once it's paid your booking is unchangeable and can't be cancelled without the studio's permission.",
  },
  {
    question: "What happens if I'm late?",
    answer:
      "We hold your appointment for a maximum of 20 minutes after the scheduled time. After that, your slot is automatically cancelled and the deposit is not refunded.",
  },
  {
    question: "How long does a treatment take?",
    answer: "Approximately 2–4 hours, depending on the complexity of the design.",
  },
  {
    question: "How do I pay the remaining balance?",
    answer: "In person, right after the service, on the day of your appointment.",
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: (
      <>
        Not directly online — per our policy, bookings can&apos;t be
        self-cancelled once the deposit is paid. Contact us directly on
        WhatsApp or Instagram and we&apos;ll sort it out.
      </>
    ),
  },
  {
    question: "What are your hours?",
    answer:
      "Monday–Saturday, closed Sundays. One booking a day, at 11:00, 15:00 or 18:00 WIB. Appointment-based only, no walk-ins.",
  },
  {
    question: "Where are you located?",
    answer: STUDIO_ADDRESS,
  },
  {
    question: "What's included in a treatment?",
    answer: `${INCLUDED_ITEMS.join(", ")}.`,
  },
  {
    question: "Do you offer classes or custom press-on nails?",
    answer: (
      <>
        Not through online booking — message us on{" "}
        <a
          href="https://instagram.com/queensnailsid"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-burgundy"
        >
          Instagram
        </a>{" "}
        to ask about classes or custom premium press-on orders.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
        <div className="text-center">
          <h1 className="font-sans text-4xl font-semibold text-charcoal">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 font-sans text-base text-charcoal/70">
            Can&apos;t find what you&apos;re looking for? See the{" "}
            <Link href="/services" className="underline hover:text-burgundy">
              full pricelist
            </Link>{" "}
            or message us on Instagram.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-blush px-6 py-5"
            >
              <p className="font-sans text-base font-semibold text-charcoal">
                {faq.question}
              </p>
              <p className="mt-2 font-sans text-sm text-charcoal/70">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/book"
            className="inline-block rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark"
          >
            Book Your Appointment
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
