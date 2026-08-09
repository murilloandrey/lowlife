import { Instagram, Play } from "lucide-react";
import { useShopifyVideoPosts } from "@/lib/shopify/hooks";
import { embeddableUrl } from "@/lib/embeds";
import { VIDEO_POSTS } from "@/lib/mock-storefront-data";
import type { ShopifyVideoPostMetaobject } from "@/lib/shopify-types";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeader } from "./SectionHeader";

export function VideoCarousel() {
  const { data } = useShopifyVideoPosts();
  const videoPosts: ShopifyVideoPostMetaobject[] = data ?? VIDEO_POSTS;
  return (
    <section className="overflow-hidden border-b border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Seen in Motion"
          title="From the feed."
          subtitle="Meet recaps, build details, and parking-lot moments from the Lowlife community."
        />
        <Carousel
          opts={{ align: "start", loop: true }}
          className="px-0 sm:px-10"
        >
          <CarouselContent className="-ml-3">
            {videoPosts.map((video) => {
              // An uploaded video file wins over an embed link, which in turn
              // wins over the static thumbnail placeholder.
              const embedSrc = embeddableUrl(video.embedUrl);
              return (
                <CarouselItem
                  key={video.id}
                  className="basis-[84%] pl-3 sm:basis-1/2 lg:basis-1/3"
                >
                  <article className="group overflow-hidden border border-border bg-card">
                    <div className="relative aspect-[9/16] bg-surface-2">
                      {video.videoFileUrl ? (
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          poster={video.thumbnail.url}
                          src={video.videoFileUrl}
                          className="h-full w-full object-cover"
                        />
                      ) : embedSrc ? (
                        <iframe
                          src={embedSrc}
                          title={video.caption}
                          loading="lazy"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          className="h-full w-full border-0"
                        />
                      ) : (
                        <>
                          <img
                            src={video.thumbnail.url}
                            alt={video.thumbnail.altText ?? video.caption}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
                          <span className="brand-glow absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-gradient-brand text-white">
                            <Play className="ml-1 h-5 w-5 fill-current" />
                          </span>
                        </>
                      )}
                      {/* Native controls live along the bottom edge, so the
                        caption moves to the top for uploaded video files. */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 flex justify-between gap-4 p-4 ${
                          video.videoFileUrl
                            ? "top-0 items-start"
                            : "bottom-0 items-end"
                        }`}
                      >
                        <p className="text-sm font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                          {video.caption}
                        </p>
                        <span className="shrink-0 rounded-full border border-white/30 bg-black/50 p-2 text-white backdrop-blur">
                          {video.platform === "instagram" ? (
                            <Instagram className="h-4 w-4" />
                          ) : (
                            <TikTokIcon className="h-4 w-4" />
                          )}
                        </span>
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
      </div>
    </section>
  );
}
