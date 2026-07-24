"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GradientPanel } from "@/components/GradientPanel";
import type { InstagramPost } from "@/lib/instagram";

const PLACEHOLDER_VARIANTS = ["blush", "gold", "clay", "cream", "blush", "gold"] as const;

export function InstagramCarousel({ posts }: { posts: InstagramPost[] | null }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const items: (InstagramPost | { id: string; mediaUrl: null; permalink: string })[] =
    posts && posts.length > 0
      ? posts
      : Array.from({ length: 6 }, (_, i) => ({
          id: `placeholder-${i}`,
          mediaUrl: null,
          permalink: "https://instagram.com/queensnailsid",
        }));

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((post, i) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-[1080/1350] w-[45%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[30%] lg:w-[15.5%]"
          >
            {post.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.mediaUrl}
                alt={"caption" in post ? (post.caption ?? "Instagram post") : "Instagram post"}
                className="h-full w-full object-cover"
              />
            ) : (
              <GradientPanel
                variant={PLACEHOLDER_VARIANTS[i % PLACEHOLDER_VARIANTS.length]}
                className="h-full w-full"
              />
            )}
          </a>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-burgundy text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
            aria-label="Scroll Instagram posts left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-burgundy text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
            aria-label="Scroll Instagram posts right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <a
          href="https://instagram.com/queensnailsid"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-burgundy px-6 py-3 font-sans text-sm font-semibold text-cream transition-colors hover:bg-charcoal sm:text-lg"
        >
          View more on Instagram
        </a>
      </div>
    </div>
  );
}
