import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import articleFallbackImage from "@/assets/hero-fusion.jpg";
import { reportClientError } from "@/lib/observability";
import {
  ARTICLES,
  GALLERY,
  PRODUCTS,
  SPOTLIGHT_BUILDS,
} from "@/lib/mock-storefront-data";
import type {
  GalleryMetaobject,
  HeroSlide,
  ShopifyArticle,
  ShopifyImage,
  ShopifyProduct,
  ShopifyTicketProduct,
  SpotlightBuild,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  ARTICLES_QUERY,
  EVENT_TICKETS_QUERY,
  GALLERY_QUERY,
  HERO_SLIDES_QUERY,
  PRODUCTS_QUERY,
  SHOPTICKETS_EVENT_HANDLES,
} from "./operations";
import { selectableProductOptions } from "./variants";

type ProductsResponse = {
  products: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
      description: string;
      productType: string;
      tags: string[];
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      images: {
        nodes: ShopifyImage[];
      };
      options: Array<{ name: string; values: string[] }>;
      variants: {
        nodes: Array<{
          id: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
          selectedOptions: Array<{ name: string; value: string }>;
          image: ShopifyImage | null;
        }>;
      };
      selectedOrFirstAvailableVariant: {
        id: string;
      } | null;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

type ProductsPage = {
  products: ShopifyProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

type ArticlesResponse = {
  blog: {
    articles: {
      nodes: Array<{
        handle: string;
        title: string;
        excerpt: string | null;
        contentHtml: string;
        publishedAt: string;
        authorV2: { name: string } | null;
        image: ShopifyImage | null;
        instagramHandle: { value: string } | null;
      }>;
    };
  } | null;
};

type EventCollectionNode = {
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
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      selectedOrFirstAvailableVariant: {
        id: string;
        availableForSale: boolean;
      } | null;
    }>;
  };
};

type EventTicketsResponse = {
  carmeet: EventCollectionNode | null;
  vegas: EventCollectionNode | null;
  orlando: EventCollectionNode | null;
};

type ShopTicketsEventHandle = (typeof SHOPTICKETS_EVENT_HANDLES)[number];

// ShopTickets does not currently expose its structured schedule fields through
// this store's Storefront API. These values are the client-confirmed Admin data;
// titles, descriptions, banners, products, and publication visibility remain
// live Shopify data. Replace this map when ShopTickets exposes public fields.
const SHOPTICKETS_EVENT_SCHEDULE: Record<
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

type MetaobjectReference = {
  __typename?: "MediaImage" | "Video" | "GenericFile";
  /** Present on MediaImage references. */
  image?: ShopifyImage | null;
  /** Present on Video references (an uploaded, Shopify-transcoded video file). */
  previewImage?: ShopifyImage | null;
  sources?: Array<{ url: string; mimeType: string | null }> | null;
  /** Present on GenericFile references (an uploaded file Shopify didn't transcode). */
  url?: string | null;
  mimeType?: string | null;
};

type MetaobjectField = {
  key: string;
  value: string | null;
  reference: MetaobjectReference | null;
  /** Populated for "List of files"-style fields; null for single references. */
  references?: { nodes: MetaobjectReference[] } | null;
};

type MetaobjectNode = {
  id: string;
  updatedAt: string;
  fields: MetaobjectField[];
};

type GalleryResponse = {
  gallery: { nodes: MetaobjectNode[] };
  spotlights: { nodes: MetaobjectNode[] };
};

type HeroSlidesResponse = {
  heroSlides: { nodes: MetaobjectNode[] };
};

const HERO_FALLBACK_ALT =
  "Blue Ford Fusion with a Lowlife windshield decal at a Houston car show";

const HERO_SLIDES_FALLBACK: HeroSlide[] = [
  {
    id: "local-hero-fusion",
    image: {
      url: articleFallbackImage,
      altText: HERO_FALLBACK_ALT,
      width: 1467,
      height: 2200,
    },
  },
];

const ARTICLE_FALLBACK_IMAGE: ShopifyImage = {
  url: articleFallbackImage,
  altText: "Lowlife car at a community meet — article image coming soon",
  width: 1224,
  height: 1944,
};

function fallbackOnError<T>(label: string, fallback: T) {
  return (error: unknown) => {
    reportClientError(error, {
      area: "shopify_content",
      action: label,
      fallbackUsed: true,
    });
    return fallback;
  };
}

async function fetchProductsPage(params: {
  first: number;
  after?: string;
}): Promise<ProductsPage> {
  const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, params);
  const products = data.products.nodes
    .filter((product) => product.selectedOrFirstAvailableVariant)
    .map((product) => ({
      id: product.id,
      variantId: product.selectedOrFirstAvailableVariant!.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      productType: product.productType,
      tags: product.tags,
      price: product.priceRange.minVariantPrice,
      images: product.images.nodes,
      options: selectableProductOptions(product.options),
      variants: product.variants.nodes,
    }))
    .filter((product) => product.images.length > 0);
  return { products, pageInfo: data.products.pageInfo };
}

async function fetchProducts(): Promise<ShopifyProduct[]> {
  try {
    const { products } = await fetchProductsPage({ first: 24 });
    return products;
  } catch (error) {
    return fallbackOnError("products", PRODUCTS)(error);
  }
}

async function fetchArticles(): Promise<ShopifyArticle[]> {
  try {
    const data = await shopifyFetch<ArticlesResponse>(ARTICLES_QUERY, {
      first: 12,
    });
    const articles = (data.blog?.articles.nodes ?? []).map((article) => ({
      handle: article.handle,
      title: article.title,
      excerpt: article.excerpt ?? "",
      contentHtml: article.contentHtml,
      image: article.image ?? ARTICLE_FALLBACK_IMAGE,
      publishedAt: article.publishedAt,
      author: { name: article.authorV2?.name ?? "Lowlife Editorial" },
      instagramHandle: article.instagramHandle?.value.trim() || undefined,
    }));
    return articles.length > 0 ? articles : ARTICLES;
  } catch (error) {
    return fallbackOnError("articles", ARTICLES)(error);
  }
}

async function fetchEventTickets(): Promise<ShopifyTicketProduct[]> {
  try {
    const data = await shopifyFetch<EventTicketsResponse>(EVENT_TICKETS_QUERY, {
      carmeetHandle: SHOPTICKETS_EVENT_HANDLES[0],
      vegasHandle: SHOPTICKETS_EVENT_HANDLES[1],
      orlandoHandle: SHOPTICKETS_EVENT_HANDLES[2],
    });
    const collections = [data.carmeet, data.vegas, data.orlando].flatMap(
      (collection) => (collection ? [collection] : []),
    );
    const tickets = collections.flatMap((collection) => {
      const schedule =
        SHOPTICKETS_EVENT_SCHEDULE[collection.handle as ShopTicketsEventHandle];
      if (!schedule) return [];
      const product = collection.products.nodes[0];
      if (!product) return [];
      const variant = product.selectedOrFirstAvailableVariant;
      if (!variant) return [];

      return [
        {
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
          availableForSale:
            product.availableForSale && variant.availableForSale,
          collectionHandle: collection.handle,
          ...schedule,
          ticketType:
            product.title.split("—").at(-1)?.trim() || "General Admission",
        },
      ];
    });

    return tickets.sort(
      (left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt),
    );
  } catch (error) {
    return fallbackOnError("ShopTickets event collections", [])(error);
  }
}

function fieldMap(node: MetaobjectNode) {
  return new Map(node.fields.map((field) => [field.key, field]));
}

function imageFrom(
  fields: Map<string, MetaobjectField>,
  key: string = "image",
) {
  return fields.get(key)?.reference?.image ?? null;
}

/**
 * Reads every image out of a "List of files" field. Returns an empty array when
 * the field is absent from the metaobject definition, empty, or holds
 * non-image references — callers fall back to their single-image path.
 */
function imageListFrom(fields: Map<string, MetaobjectField>, key: string) {
  return (fields.get(key)?.references?.nodes ?? []).flatMap((node) =>
    node.image ? [node.image] : [],
  );
}

/**
 * Reads the playable URL out of a File-type field holding an uploaded video.
 * Shopify transcodes uploaded videos into `Video` (with `sources`), but an
 * untranscoded upload can come back as a `GenericFile` with a plain `url`.
 * Returns null when the field doesn't exist yet or is empty.
 */
function videoFileUrlFrom(fields: Map<string, MetaobjectField>, key: string) {
  const reference = fields.get(key)?.reference;
  if (!reference) return null;
  // Shopify Video references expose HLS plus progressive MP4 renditions. The
  // first MP4 is currently the HD rendition and plays natively everywhere;
  // retain the HLS/GenericFile paths for older or differently processed files.
  const source =
    reference.sources?.find(
      (candidate) => candidate.mimeType === "video/mp4" && candidate.url,
    ) ?? reference.sources?.find((candidate) => candidate.url);
  if (source) return source.url;
  return reference.mimeType?.startsWith("video/") && reference.url
    ? reference.url
    : null;
}

async function fetchCommunityImages(): Promise<{
  gallery: GalleryMetaobject[];
  spotlights: SpotlightBuild[];
}> {
  const fallback = { gallery: GALLERY, spotlights: SPOTLIGHT_BUILDS };
  try {
    const data = await shopifyFetch<GalleryResponse>(GALLERY_QUERY, {
      first: 50,
    });
    const gallery = data.gallery.nodes.flatMap<GalleryMetaobject>((node) => {
      const fields = fieldMap(node);
      const reference = fields.get("image")?.reference;
      if (!reference) return [];
      const caption = fields.get("caption")?.value ?? "";

      if (
        reference.__typename === "Video" ||
        (reference.__typename === "GenericFile" &&
          reference.mimeType?.startsWith("video/"))
      ) {
        const videoFileUrl = videoFileUrlFrom(fields, "image");
        if (!videoFileUrl) return [];
        return [
          {
            id: node.id,
            mediaType: "video" as const,
            image: reference.previewImage ?? null,
            videoFileUrl,
            caption,
          },
        ];
      }

      if (reference.__typename !== "MediaImage" || !reference.image) return [];
      return [
        {
          id: node.id,
          mediaType: "image" as const,
          image: reference.image,
          caption,
        },
      ];
    });
    const spotlights = data.spotlights.nodes.flatMap((node) => {
      const fields = fieldMap(node);
      const image = imageFrom(fields);
      if (!image) return [];
      const videoThumbnail =
        fields.get("video_thumbnail")?.reference?.image ?? image;
      const videoPlatform: "tiktok" | "instagram" =
        fields.get("video_platform")?.value?.toLowerCase() === "tiktok"
          ? "tiktok"
          : "instagram";
      const favoriteSongTitle = fields.get("favorite_song_title")?.value;
      const favoriteSongArtist = fields.get("favorite_song_artist")?.value;
      // `build_photos` is a newer multi-image field; entries that predate it (or
      // stores where it isn't defined yet) keep the single "Image" field.
      const buildPhotos = imageListFrom(fields, "build_photos");
      const galleryImages = buildPhotos.length > 0 ? buildPhotos : [image];
      return [
        {
          id: node.id,
          images: galleryImages.map((photo) => ({
            url: photo.url,
            altText: photo.altText ?? "Lowlife member build",
          })),
          ownerName: fields.get("owner_name")?.value ?? "",
          buildNickname: fields.get("build_nickname")?.value || undefined,
          caption: fields.get("caption")?.value ?? "",
          fullStory:
            fields.get("full_story")?.value ??
            fields.get("caption")?.value ??
            "",
          instagramHandle: fields.get("instagram_handle")?.value || undefined,
          video: {
            id: `${node.id}-video`,
            platform: videoPlatform,
            embedUrl: fields.get("video_embed_url")?.value ?? null,
            videoFileUrl: videoFileUrlFrom(fields, "video_file"),
            thumbnail: videoThumbnail,
            caption:
              fields.get("video_caption")?.value ?? "Build video coming soon.",
          },
          favoriteSong:
            favoriteSongTitle && favoriteSongArtist
              ? {
                  title: favoriteSongTitle,
                  artist: favoriteSongArtist,
                  embedUrl:
                    fields.get("favorite_song_embed_url")?.value || undefined,
                }
              : undefined,
        },
      ];
    });
    return {
      gallery: gallery.length > 0 ? gallery : GALLERY,
      spotlights: spotlights.length > 0 ? spotlights : SPOTLIGHT_BUILDS,
    };
  } catch (error) {
    return fallbackOnError("metaobjects", fallback)(error);
  }
}

async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const data = await shopifyFetch<HeroSlidesResponse>(HERO_SLIDES_QUERY, {
      first: 20,
    });
    const heroSlides = data.heroSlides.nodes.flatMap((node) => {
      const fields = fieldMap(node);
      const image = imageFrom(fields);
      if (!image) return [];
      const customAlt = fields.get("alt_text")?.value?.trim();
      return [
        {
          id: node.id,
          image: {
            ...image,
            altText:
              customAlt || image.altText?.trim() || "Lowlife featured car",
          },
        },
      ];
    });
    return heroSlides.length > 0 ? heroSlides : HERO_SLIDES_FALLBACK;
  } catch (error) {
    return fallbackOnError("hero slides", HERO_SLIDES_FALLBACK)(error);
  }
}

export function useShopifyProducts() {
  const configured = isShopifyConfigured();
  return useQuery({
    queryKey: ["shopify", "products", configured],
    queryFn: configured ? fetchProducts : async () => PRODUCTS,
    initialData: PRODUCTS,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}

const CATALOG_FIRST_PAGE_SIZE = 16;
const CATALOG_PAGE_SIZE = 12;

export function useShopifyProductCatalog() {
  const configured = isShopifyConfigured();
  return useInfiniteQuery({
    queryKey: ["shopify", "product-catalog", configured],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<ProductsPage> => {
      if (!configured) {
        return {
          products: PRODUCTS,
          pageInfo: { hasNextPage: false, endCursor: null },
        };
      }
      try {
        return await fetchProductsPage({
          first: pageParam ? CATALOG_PAGE_SIZE : CATALOG_FIRST_PAGE_SIZE,
          after: pageParam,
        });
      } catch (error) {
        return fallbackOnError("product catalog", {
          products: PRODUCTS,
          pageInfo: { hasNextPage: false, endCursor: null },
        })(error);
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopifyArticles() {
  const configured = isShopifyConfigured();
  return useQuery({
    queryKey: ["shopify", "articles", configured],
    queryFn: configured ? fetchArticles : async () => ARTICLES,
    initialData: ARTICLES,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopifyEvents() {
  const configured = isShopifyConfigured();
  return useQuery({
    queryKey: [
      "shopify",
      "event-tickets",
      SHOPTICKETS_EVENT_HANDLES,
      configured,
    ],
    queryFn: configured ? fetchEventTickets : async () => [],
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopifyGallery() {
  const configured = isShopifyConfigured();
  const fallback = { gallery: GALLERY, spotlights: SPOTLIGHT_BUILDS };
  return useQuery({
    queryKey: ["shopify", "community-images", configured],
    queryFn: configured ? fetchCommunityImages : async () => fallback,
    initialData: fallback,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHeroSlides() {
  const configured = isShopifyConfigured();
  return useQuery({
    queryKey: ["shopify", "hero-slides", configured],
    queryFn: configured ? fetchHeroSlides : async () => HERO_SLIDES_FALLBACK,
    staleTime: 5 * 60 * 1000,
  });
}
