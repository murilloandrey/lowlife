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

export type ProductGroup<T> = {
  /** Display label for the category; empty productTypes fall back to "Other". */
  type: string;
  products: T[];
};

/**
 * Splits an already-sorted list into one group per category. Sorting alone
 * isn't enough for the UI: in a 3-column grid a 5-then-1 split leaves the last
 * item of one category sharing a row with the first of the next, so the
 * grouping reads as scattered. Rendering a labelled grid per group guarantees
 * each category starts a fresh row.
 */
export function partitionProductsByType<
  T extends Pick<ShopifyProduct, "productType">,
>(products: T[]): ProductGroup<T>[] {
  const groups: ProductGroup<T>[] = [];
  for (const product of groupProductsByType(products)) {
    const type = product.productType?.trim() || "Other";
    const current = groups[groups.length - 1];
    if (current && current.type === type) current.products.push(product);
    else groups.push({ type, products: [product] });
  }
  return groups;
}
