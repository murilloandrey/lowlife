// TODO(client-content): Owner names, build nicknames, Instagram handles, and
// recognition captions are placeholders. Collect and approve real owner credits
// with the client before this section ships to production.

import { Award, Instagram } from "lucide-react";
import { useShopifyGallery } from "@/lib/shopify/hooks";
import { SPOTLIGHT_BUILDS } from "@/lib/mock-storefront-data";
import type { SpotlightBuild } from "@/lib/shopify-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeader } from "./SectionHeader";

export function OwnerSpotlight() {
  const { data } = useShopifyGallery();
  const spotlightBuilds: SpotlightBuild[] =
    data?.spotlights ?? SPOTLIGHT_BUILDS;

  return (
    <section
      id="owner-spotlight"
      className="relative scroll-mt-20 overflow-hidden border-b border-border py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(236,72,153,0.1),rgba(109,40,217,0.06)_40%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Owner Spotlight"
          title="Built by you. Repped by all."
          subtitle="Giving the builders behind the scene their flowers — one owner, one car, one story at a time."
        />

        <Carousel opts={{ align: "start", loop: true }} className="sm:px-12">
          <CarouselContent>
            {spotlightBuilds.map((build, index) => {
              const ownerLabel = build.ownerName || "Member Build";
              return (
                <CarouselItem key={build.id}>
                  <article className="bg-gradient-brand p-px shadow-[0_0_48px_-24px_rgba(236,72,153,0.75)]">
                    <div className="grid overflow-hidden bg-card lg:grid-cols-[1.35fr_0.65fr]">
                      <div className="relative min-h-80 overflow-hidden sm:min-h-[32rem]">
                        <img
                          src={build.image.url}
                          alt={build.image.altText}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:to-card/25" />
                        <div className="absolute left-4 top-4 flex items-center gap-2 border border-white/25 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
                          <Award className="h-3.5 w-3.5 text-primary" />
                          Spotlight {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center p-6 sm:p-10">
                        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                          Repping the build
                        </div>
                        <h3 className="mt-3 font-serif text-4xl font-black leading-none sm:text-5xl">
                          {build.buildNickname || ownerLabel}
                        </h3>
                        {build.buildNickname && (
                          <p className="mt-2 font-display text-xl tracking-wide text-chrome">
                            {ownerLabel}
                          </p>
                        )}
                        <p className="mt-5 text-sm leading-relaxed text-chrome-dim sm:text-base">
                          {build.caption}
                        </p>
                        <div className="mt-8 border-t border-border pt-5">
                          {build.instagramHandle ? (
                            <a
                              href={`https://instagram.com/${build.instagramHandle.replace("@", "")}`}
                              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
                            >
                              <Instagram className="h-4 w-4" />
                              {build.instagramHandle}
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                              Owner credit coming soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden border-border bg-card hover:border-primary sm:inline-flex" />
          <CarouselNext className="right-0 hidden border-border bg-card hover:border-primary sm:inline-flex" />
        </Carousel>

        <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground sm:hidden">
          Swipe to meet the builds
        </p>
      </div>
    </section>
  );
}
