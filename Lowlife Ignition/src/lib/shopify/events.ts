import type { ShopifyImage, ShopifyTicketProduct } from "@/lib/shopify-types";
import { SHOPTICKETS_EVENT_HANDLES } from "./operations";

export type EventCollectionNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
      availableForSale: boolean;
      productType: string;
      tags: string[];
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      selectedOrFirstAvailableVariant: {
        id: string;
        availableForSale: boolean;
      } | null;
    }>;
  };
};

type ShopTicketsEventHandle = (typeof SHOPTICKETS_EVENT_HANDLES)[number];

// ShopTickets does not expose these schedule fields through Storefront API.
const schedules: Record<
  ShopTicketsEventHandle,
  Pick<ShopifyTicketProduct, "startsAt" | "timeLabel" | "location" | "address">
> = {
  "carmeet-mod-day": {
    startsAt: "2026-08-15T16:00:00-05:00",
    timeLabel: "4:00–8:00 PM CDT",
    location: "Apex Garage",
    address: "23633 Gosling Rd., Ste A, Spring, TX",
  },
  "importexpo-las-vegas": {
    startsAt: "2026-08-29T17:00:00-05:00",
    timeLabel: "5:00–10:00 PM CDT",
    location: "Las Vegas Convention Center",
    address: "Las Vegas, NV",
  },
  "importexpo-orlando": {
    startsAt: "2026-09-12T17:00:00-05:00",
    timeLabel: "5:00–10:00 PM CDT",
    location: "Orange County Convention Center",
    address: "Orlando, FL",
  },
};

export function mapEventCollection(
  collection: EventCollectionNode,
): ShopifyTicketProduct | null {
  const schedule = schedules[collection.handle as ShopTicketsEventHandle];
  const product = collection.products.nodes[0];
  const variant = product?.selectedOrFirstAvailableVariant;
  if (!schedule || !product || !variant) return null;

  return {
    id: product.id,
    variantId: variant.id,
    title: collection.title,
    handle: product.handle,
    productType: product.productType || "Event Ticket",
    tags: product.tags,
    price: product.priceRange.minVariantPrice,
    images: collection.image ? [collection.image] : [],
    options: [],
    variants: [
      {
        id: variant.id,
        availableForSale: variant.availableForSale,
        price: product.priceRange.minVariantPrice,
        selectedOptions: [],
      },
    ],
    description: collection.description,
    availableForSale: product.availableForSale && variant.availableForSale,
    collectionHandle: collection.handle,
    ...schedule,
    ticketType: product.title.split("—").at(-1)?.trim() || "General Admission",
  };
}
