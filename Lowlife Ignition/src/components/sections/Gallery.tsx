import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { useShopifyGallery } from "@/lib/shopify/hooks";
import { GALLERY } from "@/lib/mock-storefront-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader } from "./SectionHeader";

export function Gallery() {
  const { data } = useShopifyGallery();
  const gallery = data?.gallery ?? GALLERY;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : gallery[activeIndex];

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
          {gallery.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Open photo ${index + 1}: ${item.caption}`}
              className={`group relative overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${index === 0 || index === 5 ? "row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <img
                src={item.image.url}
                alt={item.image.altText ?? item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 transition-all group-hover:bg-primary/20" />
              <span className="sr-only">{item.caption}</span>
            </button>
          ))}
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
                <DialogTitle>{activeItem.caption}</DialogTitle>
                <DialogDescription>
                  Full-size gallery photo {activeIndex! + 1} of {gallery.length}
                </DialogDescription>
              </DialogHeader>
              <div className="relative flex min-h-0 items-center justify-center bg-black">
                <img
                  src={activeItem.image.url}
                  alt={activeItem.image.altText ?? activeItem.caption}
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
                  <p className="text-sm text-chrome">{activeItem.caption}</p>
                  {activeItem.image.altText &&
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
