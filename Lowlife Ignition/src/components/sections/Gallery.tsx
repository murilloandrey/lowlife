import { useCallback, useEffect, useState, type MouseEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Volume2,
  VolumeX,
} from "lucide-react";
import { HlsVideo } from "@/components/media/HlsVideo";
import { useShopifyGallery } from "@/lib/shopify/hooks";
import { GALLERY } from "@/lib/mock-storefront-data";
import type { GalleryMetaobject } from "@/lib/shopify-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader } from "./SectionHeader";

function mediaLabel(item: GalleryMetaobject, index: number) {
  return (
    item.caption ||
    item.image?.altText ||
    `Lowlife gallery ${item.mediaType === "video" ? "video" : "photo"} ${index + 1}`
  );
}

function GalleryMedia({
  item,
  className,
  loading,
  muted = true,
}: {
  item: GalleryMetaobject;
  className: string;
  loading?: "eager" | "lazy";
  muted?: boolean;
}) {
  if (item.mediaType === "video" && item.videoFileUrl) {
    return (
      <HlsVideo
        src={item.videoFileUrl}
        poster={item.image?.url}
        autoPlay
        loop
        muted={muted}
        controls={false}
        className={className}
      />
    );
  }

  if (!item.image) return null;
  return (
    <img
      src={item.image.url}
      alt={item.image.altText ?? item.caption}
      loading={loading}
      className={className}
    />
  );
}

export function Gallery() {
  const { data } = useShopifyGallery();
  const gallery: GalleryMetaobject[] = data?.gallery ?? GALLERY;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [audibleVideoId, setAudibleVideoId] = useState<string | null>(null);
  const activeItem = activeIndex === null ? null : gallery[activeIndex];

  const toggleVideoSound = useCallback(
    (event: MouseEvent<HTMLButtonElement>, videoId: string) => {
      const video = event.currentTarget.querySelector("video");
      if (!video) return;

      const makeAudible = audibleVideoId !== videoId;
      event.currentTarget
        .closest("#gallery")
        ?.querySelectorAll("video")
        .forEach((candidate) => {
          candidate.muted = true;
        });

      if (!makeAudible) {
        setAudibleVideoId(null);
        return;
      }

      video.muted = false;
      setAudibleVideoId(videoId);
      void video.play().catch(() => {
        video.muted = true;
        setAudibleVideoId((current) => (current === videoId ? null : current));
      });
    },
    [audibleVideoId],
  );

  const move = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((current) => {
        if (current === null) return null;
        return (current + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, move]);

  return (
    <section
      id="gallery"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="The Culture" title="From the meets." />
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {gallery.map((item, index) => {
            const isVideo = item.mediaType === "video";
            const isAudible = isVideo && audibleVideoId === item.id;
            const label = mediaLabel(item, index);
            return (
              <button
                type="button"
                key={item.id}
                onClick={(event) =>
                  isVideo
                    ? toggleVideoSound(event, item.id)
                    : setActiveIndex(index)
                }
                aria-label={
                  isVideo
                    ? `${isAudible ? "Mute" : "Play with sound"}: ${label}`
                    : `Open photo ${index + 1}: ${label}`
                }
                aria-pressed={isVideo ? isAudible : undefined}
                className="group relative aspect-square overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <GalleryMedia
                  item={item}
                  loading="lazy"
                  muted={!isAudible}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 transition-all group-hover:bg-primary/20" />
                {isVideo && (
                  <span className="pointer-events-none absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-black/65 text-white shadow-lg backdrop-blur transition-colors group-hover:border-primary">
                    {isAudible ? (
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                )}
                <span className="sr-only">{label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.instagram.com/lowlife_est15/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Instagram className="h-4 w-4" /> Follow the Culture on Instagram
          </a>
        </div>
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => !open && setActiveIndex(null)}
      >
        <DialogContent className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto border-border bg-card p-3 [&>button]:z-20 [&>button]:grid [&>button]:h-11 [&>button]:w-11 [&>button]:place-items-center [&>button]:border [&>button]:border-white/30 [&>button]:bg-black/70 [&>button]:text-white [&>button]:opacity-100 sm:p-5">
          {activeItem && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>
                  {mediaLabel(activeItem, activeIndex!)}
                </DialogTitle>
                <DialogDescription>
                  Full-size gallery{" "}
                  {activeItem.mediaType === "video" ? "video" : "photo"}{" "}
                  {activeIndex! + 1} of {gallery.length}
                </DialogDescription>
              </DialogHeader>
              <div className="relative flex min-h-0 items-center justify-center bg-black">
                <GalleryMedia
                  item={activeItem}
                  className="max-h-[72svh] w-full object-contain"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => move(-1)}
                      aria-label="Previous gallery photo"
                      className="absolute left-2 grid h-11 w-11 place-items-center border border-white/30 bg-black/65 text-white backdrop-blur transition-colors hover:border-primary sm:left-4"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(1)}
                      aria-label="Next gallery photo"
                      className="absolute right-2 grid h-11 w-11 place-items-center border border-white/30 bg-black/65 text-white backdrop-blur transition-colors hover:border-primary sm:right-4"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-start justify-between gap-4 px-1 pb-1">
                <div>
                  {activeItem.caption && (
                    <p className="text-sm text-chrome">{activeItem.caption}</p>
                  )}
                  {activeItem.image?.altText &&
                    activeItem.image.altText !== activeItem.caption && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activeItem.image.altText}
                      </p>
                    )}
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {activeIndex! + 1} / {gallery.length}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
