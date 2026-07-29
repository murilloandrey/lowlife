import { useQuery } from "@tanstack/react-query";
import {
  ARTICLES,
  GALLERY,
  PRODUCTS,
  SPOTLIGHT_BUILDS,
} from "@/lib/mock-storefront-data";
import type {
  GalleryMetaobject,
  ShopifyArticle,
  ShopifyImage,
  ShopifyProduct,
  SpotlightBuild,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import { ARTICLES_QUERY, GALLERY_QUERY, PRODUCTS_QUERY } from "./operations";

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
  fields: MetaobjectField[];
};

type GalleryResponse = {
  gallery: { nodes: MetaobjectNode[] };
  spotlights: { nodes: MetaobjectNode[] };
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

function imageFrom(fields: Map<string, MetaobjectField>) {
  return fields.get("image")?.reference?.image ?? null;
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
      return [
        {
          id: node.id,
          image: {
            url: image.url,
            altText: image.altText ?? "Lowlife member build",
          },
          ownerName: fields.get("owner_name")?.value ?? "",
          buildNickname: fields.get("build_nickname")?.value || undefined,
          caption: fields.get("caption")?.value ?? "",
          instagramHandle: fields.get("instagram_handle")?.value || undefined,
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
