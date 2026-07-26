"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { PricelistContent } from "@/components/PricelistContent";
import type { PublicPricingData } from "@/lib/services-data";

const noopSubscribe = () => () => {};

/** True only after hydration — lets the portal below render server/client-consistent (nothing) on the first pass, then attach to document.body once it exists. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function PricelistModal({
  className,
  pricing,
}: {
  className?: string;
  pricing: PublicPricingData;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The trigger below often sits inline inside a <p> (e.g. in ServiceStep's
  // copy) — <p> can't legally contain block content like <dialog>/<h1>, so
  // the dialog is portaled straight to <body> instead of rendered in place.
  const isClient = useIsClient();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={className ?? "underline hover:text-burgundy"}
      >
        full pricelist
      </button>

      {isClient &&
        createPortal(
          <dialog
            ref={dialogRef}
            onClick={(e) => {
              if (e.target === dialogRef.current) dialogRef.current?.close();
            }}
            className="fixed top-1/2 left-1/2 m-0 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border-0 bg-cream p-0 backdrop:bg-charcoal/60"
          >
            <div className="relative max-h-[85vh] overflow-y-auto p-6 sm:p-10">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close pricelist"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-cream-dark text-charcoal transition-colors hover:bg-blush"
              >
                <X className="h-4 w-4" />
              </button>
              <PricelistContent {...pricing} />
            </div>
          </dialog>,
          document.body
        )}
    </>
  );
}
