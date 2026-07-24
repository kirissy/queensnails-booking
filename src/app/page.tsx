import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { STUDIO_ADDRESS } from "@/lib/policy";
import { getRecentInstagramPosts } from "@/lib/instagram";

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STUDIO_ADDRESS)}&output=embed`;

export default async function Home() {
  const instagramPosts = await getRecentInstagramPosts(6);

  return (
    <div className="flex flex-1 flex-col">
      {/* Header + hero together fill exactly one screen (h-dvh) — the hero
          takes whatever height remains after the header's actual rendered
          height, so this stays correct even if header sizing changes. */}
      <div className="flex h-dvh flex-col">
        <SiteHeader />

        <div className="flex-1 px-6 pt-2 pb-8 sm:px-10">
          <section className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src="/hero.png"
              alt="Nail art by queensnails — red gel polish with pearl and chrome accents"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative flex h-full flex-col justify-end gap-6 p-6 sm:p-10 lg:p-12">
              <h1 className="max-w-3xl font-sans text-4xl font-medium leading-tight text-white sm:text-6xl lg:text-7xl">
                Premium quality,
                <br />
                private nail studio
              </h1>
              <Link
                href="/book"
                className="w-fit rounded-full border-2 border-white px-8 py-3 font-sans text-base font-semibold text-white transition-colors hover:bg-white hover:text-charcoal sm:px-10 sm:text-xl"
              >
                Book now
              </Link>
            </div>
          </section>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-20 px-6 py-2 sm:gap-32 sm:px-10">
        {/* Address & hours + map */}
        <section id="hours" className="grid w-full scroll-mt-8 grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-sans text-3xl font-semibold text-charcoal sm:text-5xl">
                Address
              </h2>
              <p className="mt-3 font-sans text-base text-charcoal/80">
                {STUDIO_ADDRESS}
              </p>
            </div>
            <div>
              <h2 className="font-sans text-3xl font-semibold text-charcoal sm:text-5xl">
                Opening hours
              </h2>
              <p className="mt-3 font-sans text-base text-charcoal/80">
                Monday – Saturday
                <br />
                Two daily slots: 11:00 &amp; 18:00 WIB
              </p>
              <span className="mt-3 inline-block bg-burgundy px-3 py-1.5 font-sans text-sm font-bold text-white">
                By appointment only
              </span>
            </div>
          </div>
          <div className="min-h-[320px] overflow-hidden rounded-2xl">
            <iframe
              src={MAP_EMBED_URL}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              title="Queensnails studio location"
            />
          </div>
        </section>

        {/* Instagram */}
        <section className="flex w-full flex-col gap-6 pb-20 sm:pb-28">
          <InstagramCarousel posts={instagramPosts} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
