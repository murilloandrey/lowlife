import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  ARTICLES,
  EVENTS,
  GALLERY,
  PRODUCTS,
  SPOTLIGHT_BUILDS,
  VIDEO_POSTS,
} from "@/lib/mock-storefront-data";
import type {
  GalleryMetaobject,
  ShopifyArticle,
  ShopifyImage,
  ShopifyProduct,
  ShopifyTicketProduct,
  ShopifyVideoPostMetaobject,
  SpotlightBuild,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  ARTICLES_QUERY,
  EVENT_TICKETS_QUERY,
  GALLERY_QUERY,
  PRODUCTS_QUERY,
  SHOPTICKETS_COLLECTION_HANDLE,
  SHOPTICKETS_EVENT_METAFIELDS,
  VIDEO_POSTS_QUERY,
} from "./operations";
import { selectableProductOptions } from "./variants";

type ProductsResponse = {
  products: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
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
  articles: {
    nodes: Array<{
      handle: string;
      title: string;
      excerpt: string | null;
      contentHtml: string;
      publishedAt: string;
      authorV2: { name: string } | null;
      image: ShopifyImage | null;
    }>;
  };
};

type EventMetafield = {
  namespace: string;
  key: string;
  value: string;
  type: string;
};

type EventTicketsResponse = {
  collection: {
    handle: string;
    products: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        description: string;
        availableForSale: boolean;
        productType: string;
        tags: string[];
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        images: { nodes: ShopifyImage[] };
        selectedOrFirstAvailableVariant: {
          id: string;
          availableForSale: boolean;
        } | null;
        metafields: Array<EventMetafield | null>;
      }>;
    };
  } | null;
};

type MetaobjectField = {
  key: string;
  value: string | null;
  reference: {
    image?: ShopifyImage | null;
  } | null;
};

type MetaobjectNode = {
  id: string;
  fields: MetaobjectField[];
};

type GalleryResponse = {
  gallery: { nodes: MetaobjectNode[] };
  spotlights: { nodes: MetaobjectNode[] };
};

type VideoPostsResponse = {
  videoPosts: { nodes: MetaobjectNode[] };
};

function fallbackOnError<T>(label: string, fallback: T) {
  return (error: unknown) => {
    console.warn(
      `Shopify ${label} request failed; using local fallback.`,
      error,
    );
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
    const articles = data.articles.nodes
      .filter((article) => article.image)
      .map((article) => ({
        handle: article.handle,
        title: article.title,
        excerpt: article.excerpt ?? "",
        contentHtml: article.contentHtml,
        image: article.image!,
        publishedAt: article.publishedAt,
        author: { name: article.authorV2?.name ?? "Lowlife Editorial" },
      }));
    return articles.length > 0 ? articles : ARTICLES;
  } catch (error) {
    return fallbackOnError("articles", ARTICLES)(error);
  }
}

async function fetchEventTickets(): Promise<ShopifyTicketProduct[]> {
  try {
    const data = await shopifyFetch<EventTicketsResponse>(EVENT_TICKETS_QUERY, {
      handle: SHOPTICKETS_COLLECTION_HANDLE,
      first: 24,
      metafieldIdentifiers: SHOPTICKETS_EVENT_METAFIELDS,
    });
    const products = data.collection?.products.nodes ?? [];

    // TODO(shoptickets): Confirm ShopTickets' real metafield namespace/keys for
    // event date, time, location, address, and ticket type on a configured store.
    // Until then, product/variant commerce data is live while display metadata
    // falls back by card position so the existing event UI remains complete.
    const tickets = products.flatMap((product, index) => {
      const variant = product.selectedOrFirstAvailableVariant;
      if (!variant) return [];
      const fallback = EVENTS[index % EVENTS.length];
      const metafields = new Map(
        product.metafields.flatMap((metafield) =>
          metafield ? [[metafield.key, metafield.value] as const] : [],
        ),
      );
      const images =
        product.images.nodes.length > 0
          ? product.images.nodes
          : fallback.images;

      return [
        {
          id: product.id,
          variantId: variant.id,
          title: product.title,
          handle: product.handle,
          productType: product.productType || "Event Ticket",
          tags: product.tags,
          price: product.priceRange.minVariantPrice,
          images,
          options: [],
          variants: [
            {
              id: variant.id,
              availableForSale: variant.availableForSale,
              price: product.priceRange.minVariantPrice,
              selectedOptions: [],
            },
          ],
          description: product.description || fallback.description,
          availableForSale:
            product.availableForSale && variant.availableForSale,
          collectionHandle:
            data.collection?.handle ?? SHOPTICKETS_COLLECTION_HANDLE,
          startsAt: metafields.get("event_date") || fallback.startsAt,
          timeLabel: metafields.get("event_time") || fallback.timeLabel,
          location: metafields.get("event_location") || fallback.location,
          address: metafields.get("event_address") || fallback.address,
          ticketType: metafields.get("ticket_type") || fallback.ticketType,
        },
      ];
    });

    return tickets.length > 0 ? tickets : EVENTS;
  } catch (error) {
    return fallbackOnError("ShopTickets event collection", EVENTS)(error);
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

async function fetchCommunityImages(): Promise<{
  gallery: GalleryMetaobject[];
  spotlights: SpotlightBuild[];
}> {
  const fallback = { gallery: GALLERY, spotlights: SPOTLIGHT_BUILDS };
  try {
    const data = await shopifyFetch<GalleryResponse>(GALLERY_QUERY, {
      first: 50,
    });
    const gallery = data.gallery.nodes.flatMap((node) => {
      const fields = fieldMap(node);
      const image = imageFrom(fields);
      if (!image) return [];
      return [
        {
          id: node.id,
          image,
          caption: fields.get("caption")?.value ?? "",
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
      return [
        {
          id: node.id,
          images: [
            {
              url: image.url,
              altText: image.altText ?? "Lowlife member build",
            },
          ],
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

async function fetchVideoPosts(): Promise<ShopifyVideoPostMetaobject[]> {
  try {
    const data = await shopifyFetch<VideoPostsResponse>(VIDEO_POSTS_QUERY, {
      first: 24,
    });
    const videoPosts: ShopifyVideoPostMetaobject[] =
      data.videoPosts.nodes.flatMap((node) => {
        const fields = fieldMap(node);
        const thumbnail = imageFrom(fields, "thumbnail");
        const platform = fields.get("platform")?.value?.toLowerCase();
        if (!thumbnail || (platform !== "instagram" && platform !== "tiktok")) {
          return [];
        }
        return [
          {
            id: node.id,
            platform,
            embedUrl: fields.get("embed_url")?.value || null,
            thumbnail,
            caption: fields.get("caption")?.value ?? "",
          },
        ];
      });
    return videoPosts.length > 0 ? videoPosts : VIDEO_POSTS;
  } catch (error) {
    return fallbackOnError("video posts", VIDEO_POSTS)(error);
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
      SHOPTICKETS_COLLECTION_HANDLE,
      configured,
    ],
    queryFn: configured ? fetchEventTickets : async () => EVENTS,
    initialData: EVENTS,
    initialDataUpdatedAt: 0,
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

export function useShopifyVideoPosts() {
  const configured = isShopifyConfigured();
  return useQuery({
    queryKey: ["shopify", "video-posts", configured],
    queryFn: configured ? fetchVideoPosts : async () => VIDEO_POSTS,
    initialData: VIDEO_POSTS,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}
