"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CustomerDetails } from "@/lib/booking-draft";

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a valid WhatsApp number")
    .max(16, "Enter a valid WhatsApp number")
    .regex(/^[0-9+ ]+$/, "Numbers only, e.g. +62 812 3456 789"),
  email: z.string().trim().email("Enter a valid email address"),
  notes: z.string().trim().max(500, "Keep notes under 500 characters"),
});

type Props = {
  defaultValues: CustomerDetails | null;
  referencePhoto: File | null;
  onSubmit: (customer: CustomerDetails, referencePhoto: File | null) => void;
  onBack: () => void;
};

export function DetailsStep({
  defaultValues,
  referencePhoto,
  onSubmit,
  onBack,
}: Props) {
  const [photo, setPhoto] = useState<File | null>(referencePhoto);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetails>({
    resolver: zodResolver(detailsSchema),
    defaultValues: defaultValues ?? {
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, photo))}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="font-serif text-xl text-charcoal">Your Details</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          We&apos;ll use these to confirm your appointment.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">Full name</span>
        <input
          {...register("name")}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
          placeholder="Aurelia Queena"
        />
        {errors.name && (
          <span className="font-sans text-xs text-burgundy">
            {errors.name.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">
          WhatsApp number
        </span>
        <input
          {...register("phone")}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
          placeholder="+62 812 3456 789"
        />
        {errors.phone && (
          <span className="font-sans text-xs text-burgundy">
            {errors.phone.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">Email</span>
        <input
          type="email"
          {...register("email")}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
          placeholder="you@example.com"
        />
        {errors.email && (
          <span className="font-sans text-xs text-burgundy">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">
          Notes{" "}
          <span className="font-normal text-charcoal/50">
            (nail shape/length, allergies, reference design)
          </span>
        </span>
        <textarea
          {...register("notes")}
          rows={3}
          className="rounded-xl border border-nude/60 bg-cream px-4 py-2.5 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
          placeholder="Optional"
        />
        {errors.notes && (
          <span className="font-sans text-xs text-burgundy">
            {errors.notes.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">
          Reference photo{" "}
          <span className="font-normal text-charcoal/50">(optional)</span>
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="font-sans text-sm text-charcoal/70 file:mr-3 file:rounded-full file:border-0 file:bg-blush file:px-4 file:py-2 file:font-sans file:text-sm file:text-charcoal hover:file:bg-blush-dark"
        />
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-nude px-6 py-3 font-sans text-sm text-charcoal transition-colors hover:bg-blush/30"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
