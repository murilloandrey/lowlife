// TODO(client-content): Owner names, build nicknames, Instagram handles, and
// recognition captions are placeholders. Collect and approve real owner credits
// with the client before this section ships to production.

import { useState } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Music2,
  Play,
} from "lucide-react";
import { useShopifyGallery } from "@/lib/shopify/hooks";
import { embeddableUrl } from "@/lib/embeds";
import { SPOTLIGHT_BUILDS } from "@/lib/mock-storefront-data";
import type { SpotlightBuild } from "@/lib/shopify-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader } from "./SectionHeader";

function songEmbedUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname === "open.spotify.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIndex = parts[0] === "embed" ? 1 : 0;
      const type = parts[embedIndex];
      const id = parts[embedIndex + 1];
      if (["track", "album", "playlist"].includes(type) && id) {
        return `https://open.spotify.com/embed/${type}/${id}`;
      }
    }

    let videoId = "";
    if (url.hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    }
    if (
      url.hostname === "youtube.com" ||
      url.hostname.endsWith(".youtube.com")
    ) {
      videoId =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
        "";
    }
    if (/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  } catch {
    return null;
  }
  return null;
}

function FavoriteSong({
  song,
}: {
  song: NonNullable<SpotlightBuild["favoriteSong"]>;
}) {
  const [showPlayer, setShowPlayer] = useState(false);
  const embedUrl = songEmbedUrl(song.embedUrl);

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-primary/50 bg-primary/10 text-primary">
          <Music2 className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            Owner's pick
          </div>
          <div className="mt-1 font-display text-xl tracking-wide text-chrome">
            {song.title}
          </div>
          <div className="text-sm text-muted-foreground">{song.artist}</div>
        </div>
      </div>

      {embedUrl && (
        <>
          <button
            type="button"
            onClick={() => setShowPlayer((current) => !current)}
            aria-expanded={showPlayer}
            className="mt-4 inline-flex min-h-11 items-center gap-2 border border-border px-4 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:border-primary hover:text-primary"
          >
            <Play className="h-4 w-4" />
            {showPlayer ? "Hide player" : "Play owner's pick"}
          </button>
          {showPlayer && (
            <iframe
              src={embedUrl}
              title={`${song.title} by ${song.artist}`}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              className="mt-4 h-40 w-full border-0 bg-surface-2"
            />
          )}
        </>
      )}
    </div>
  );
}

export function OwnerSpotlight() {
  const { data } = useShopifyGallery();
  const spotlightBuilds: SpotlightBuild[] =
    data?.spotlights ?? SPOTLIGHT_BUILDS;
  const [selectedBuild, setSelectedBuild] = useState<SpotlightBuild | null>(
    null,
  );
  const [photoIndex, setPhotoIndex] = useState(0);

  const openBuild = (build: SpotlightBuild) => {
    setPhotoIndex(0);
    setSelectedBuild(build);
  };

  const movePhoto = (direction: -1 | 1) => {
    if (!selectedBuild) return;
    setPhotoIndex(
      (current) =>
        (current + direction + selectedBuild.images.length) %
        selectedBuild.images.length,
    );
  };

  return (
    <section
      id="owner-spotlight"
      className="relative scroll-mt-20 overflow-hidden border-b border-border py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(236,72,153,0.1),rgba(109,40,217,0.06)_40%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Owner Spotlight"
          title="Owner Spotlight"
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
                          src={build.images[0].url}
                          alt={build.images[0].altText}
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
                          From the driver's seat
                        </div>
                        <h3 className="mt-3 font-display text-4xl leading-none tracking-wide sm:text-5xl">
                          {build.buildNickname || ownerLabel}
                        </h3>
                        {build.buildNickname && (
                          <p className="mt-2 font-display text-xl tracking-wide text-chrome">
                            {ownerLabel}
                          </p>
                        )}
                        <blockquote className="relative mt-5 border-l border-primary pl-5 text-sm italic leading-relaxed text-chrome-dim sm:text-base">
                          “{build.caption}”
                        </blockquote>
                        <button
                          type="button"
                          onClick={() => openBuild(build)}
                          className="btn-brand mt-7 w-full sm:w-auto"
                        >
                          Read Full Story
                        </button>
                        <div className="mt-6 border-t border-border pt-5">
                          {build.instagramHandle ? (
                            <a
                              href={`https://instagram.com/${build.instagramHandle.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
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

      <Dialog
        open={Boolean(selectedBuild)}
        onOpenChange={(open) => !open && setSelectedBuild(null)}
      >
        <DialogContent className="max-h-[calc(100svh-1rem)] w-[calc(100%-1rem)] max-w-6xl overflow-y-auto border-primary/40 bg-card p-0 [&>button]:z-20 [&>button]:grid [&>button]:h-11 [&>button]:w-11 [&>button]:place-items-center [&>button]:border [&>button]:border-white/30 [&>button]:bg-black/70 [&>button]:text-white [&>button]:opacity-100 sm:max-h-[calc(100svh-2rem)] sm:w-[calc(100%-2rem)]">
          {selectedBuild && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>
                  {selectedBuild.buildNickname ||
                    selectedBuild.ownerName ||
                    "Member Build"}
                </DialogTitle>
                <DialogDescription>
                  Full owner spotlight story and build media
                </DialogDescription>
              </DialogHeader>
              <div className="h-1.5 bg-gradient-brand" />
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-black sm:min-h-[34rem]">
                  <img
                    src={selectedBuild.images[photoIndex].url}
                    alt={selectedBuild.images[photoIndex].altText}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  {selectedBuild.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => movePhoto(-1)}
                        aria-label="Previous build photo"
                        className="absolute left-3 grid h-11 w-11 place-items-center border border-white/30 bg-black/65 text-white backdrop-blur hover:border-primary"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhoto(1)}
                        aria-label="Next build photo"
                        className="absolute right-3 grid h-11 w-11 place-items-center border border-white/30 bg-black/65 text-white backdrop-blur hover:border-primary"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                    {photoIndex + 1} / {selectedBuild.images.length}
                  </span>
                </div>

                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                    Owner Spotlight
                  </div>
                  <h3 className="mt-3 pr-8 font-display text-4xl leading-none tracking-wide sm:text-5xl">
                    {selectedBuild.buildNickname ||
                      selectedBuild.ownerName ||
                      "Member Build"}
                  </h3>
                  {selectedBuild.buildNickname && (
                    <p className="mt-2 font-display text-xl tracking-wide text-chrome">
                      {selectedBuild.ownerName || "Member Build"}
                    </p>
                  )}
                  {selectedBuild.instagramHandle && (
                    <a
                      href={`https://instagram.com/${selectedBuild.instagramHandle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
                    >
                      <Instagram className="h-4 w-4" />
                      {selectedBuild.instagramHandle}
                    </a>
                  )}

                  <div className="mt-7">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                      In{" "}
                      {selectedBuild.ownerName &&
                      selectedBuild.ownerName !== "Member Build"
                        ? `${selectedBuild.ownerName}'s`
                        : "the owner's"}{" "}
                      words
                    </div>
                    <blockquote className="relative mt-3 border-l border-primary pl-5 text-base italic leading-relaxed text-chrome-dim before:absolute before:-left-0.5 before:-top-5 before:font-serif before:text-5xl before:text-primary before:content-['“'] sm:text-lg">
                      <span className="whitespace-pre-line">
                        {selectedBuild.fullStory}
                      </span>
                    </blockquote>
                  </div>

                  {selectedBuild.favoriteSong && (
                    <FavoriteSong song={selectedBuild.favoriteSong} />
                  )}

                  {selectedBuild.video && (
                    <div className="mt-8 border-t border-border pt-6">
                      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                        Build video
                      </div>
                      {/* Priority: uploaded video file, then a normalized
                          Instagram/TikTok embed, then the static thumbnail. */}
                      <div className="relative aspect-video overflow-hidden bg-surface-2">
                        {selectedBuild.video.videoFileUrl ? (
                          <video
                            controls
                            playsInline
                            preload="metadata"
                            poster={selectedBuild.video.thumbnail.url}
                            src={selectedBuild.video.videoFileUrl}
                            className="h-full w-full object-cover"
                          />
                        ) : embeddableUrl(selectedBuild.video.embedUrl) ? (
                          <iframe
                            src={embeddableUrl(selectedBuild.video.embedUrl)!}
                            title={selectedBuild.video.caption}
                            loading="lazy"
                            allow="encrypted-media; picture-in-picture"
                            className="h-full w-full border-0"
                          />
                        ) : (
                          <>
                            <img
                              src={selectedBuild.video.thumbnail.url}
                              alt={
                                selectedBuild.video.thumbnail.altText ??
                                selectedBuild.video.caption
                              }
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/45" />
                            <span className="brand-glow absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-gradient-brand text-white">
                              <Play className="ml-1 h-5 w-5 fill-current" />
                            </span>
                            <span className="absolute inset-x-3 bottom-3 text-xs font-medium text-white">
                              {selectedBuild.video.caption}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
