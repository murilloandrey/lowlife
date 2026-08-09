import type { ShopifyProduct } from "@/lib/shopify-types";

/**
 * Groups products so every category (`productType`) appears as one contiguous
 * run instead of interleaved the way the Storefront API happens to return them.
 * Categories are ordered alphabetically to match the `/shop` filter pills, and
 * the sort is stable (guaranteed by `Array.prototype.sort`) so products keep
 * their existing relative order — newest first — inside each group.
 */
export function groupProductsByType<
  T extends Pick<ShopifyProduct, "productType">,
>(products: T[]): T[] {
  return [...products].sort((a, b) =>
    (a.productType ?? "").localeCompare(b.productType ?? ""),
  );
}
