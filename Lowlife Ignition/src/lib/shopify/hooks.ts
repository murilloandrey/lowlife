import { useQuery } from "@tanstack/react-query";
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
  ShopifyEventMetaobject,
  ShopifyImage,
  ShopifyProduct,
  ShopifyVideoPostMetaobject,
  SpotlightBuild,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  ARTICLES_QUERY,
  EVENTS_QUERY,
  GALLERY_QUERY,
  PRODUCTS_QUERY,
  VIDEO_POSTS_QUERY,
} from "./operations";

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
      selectedOrFirstAvailableVariant: {
        id: string;
      } | null;
    }>;
  };
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

type MetaobjectField = {
  key: string;
  value: string | null;
  reference: {
    image?: ShopifyImage | null;
  } | null;
};

type MetaobjectNode = {
  id: string;
  handle: string;
  fields: MetaobjectField[];
};

type EventsResponse = {
  events: { nodes: MetaobjectNode[] };
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

async function fetchProducts(): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, {
      first: 24,
    });
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
      }))
      .filter((product) => product.images.length > 0);
    return products.length > 0 ? products : PRODUCTS;
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

function fieldMap(node: MetaobjectNode) {
  return new Map(node.fields.map((field) => [field.key, field]));
}

function imageFrom(
  fields: Map<string, MetaobjectField>,
  key: string = "image",
) {
  return fields.get(key)?.reference?.image ?? null;
}

async function fetchEvents(): Promise<ShopifyEventMetaobject[]> {
  try {
    const data = await shopifyFetch<EventsResponse>(EVENTS_QUERY, {
      first: 24,
    });
    const events = data.events.nodes.flatMap((node) => {
      const fields = fieldMap(node);
      const name = fields.get("name")?.value;
      const startsAt = fields.get("starts_at")?.value;
      if (!name || !startsAt) return [];
      return [
        {
          id: node.id,
          handle: node.handle,
          name,
          startsAt,
          location: fields.get("location")?.value ?? "",
          timeLabel: fields.get("time_label")?.value ?? "",
          description: fields.get("description")?.value ?? "",
          ticketPrice: {
            amount: fields.get("ticket_price")?.value ?? "0",
            currencyCode: fields.get("ticket_currency_code")?.value ?? "USD",
          },
          ticketType: fields.get("ticket_type")?.value ?? "General Admission",
          checkoutUrl: fields.get("checkout_url")?.value ?? "",
        },
      ];
    });
    return events.length > 0 ? events : EVENTS;
  } catch (error) {
    return fallbackOnError("events", EVENTS)(error);
  }
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
    queryKey: ["shopify", "events", configured],
    queryFn: configured ? fetchEvents : async () => EVENTS,
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
