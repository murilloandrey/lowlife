import { Instagram } from "lucide-react";
import { useShopifyGallery } from "@/lib/shopify/hooks";
import { GALLERY } from "@/lib/mock-storefront-data";
import { SectionHeader } from "./SectionHeader";

export function Gallery() {
  const { data } = useShopifyGallery();
  const gallery = data?.gallery ?? GALLERY;
  return (
    <section
      id="gallery"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="The Culture" title="From the meets." />
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {gallery.map((item, index) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden ${index === 0 || index === 5 ? "row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <img
                src={item.image.url}
                alt={item.image.altText ?? item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 transition-all group-hover:bg-primary/20" />
              <figcaption className="sr-only">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a href="#social" className="btn-ghost">
            <Instagram className="h-4 w-4" /> Follow the Culture on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
