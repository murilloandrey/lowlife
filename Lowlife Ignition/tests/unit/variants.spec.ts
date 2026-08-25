import { expect, test } from "@playwright/test";
import type { ShopifyProduct } from "../../src/lib/shopify-types";
import {
  defaultVariant,
  resolveVariant,
  selectableProductOptions,
} from "../../src/lib/shopify/variants";

function product(overrides: Partial<ShopifyProduct> = {}): ShopifyProduct {
  return {
    id: "product-1",
    variantId: "variant-medium-black",
    title: "Lowlife Tee",
    handle: "lowlife-tee",
    price: { amount: "30.00", currencyCode: "USD" },
    images: [],
    tags: [],
    productType: "Shirt",
    options: [
      { name: "Size", values: ["S", "M"] },
      { name: "Color", values: ["Black", "White"] },
    ],
    variants: [
      {
        id: "variant-small-white",
        availableForSale: false,
        price: { amount: "30.00", currencyCode: "USD" },
        selectedOptions: [
          { name: "Size", value: "S" },
          { name: "Color", value: "White" },
        ],
      },
      {
        id: "variant-medium-black",
        availableForSale: true,
        price: { amount: "32.00", currencyCode: "USD" },
        selectedOptions: [
          { name: "Size", value: "M" },
          { name: "Color", value: "Black" },
        ],
      },
    ],
    ...overrides,
  };
}

test("removes only Shopify's synthetic default option", () => {
  expect(
    selectableProductOptions([
      { name: "Title", values: ["Default Title"] },
      { name: "Title", values: ["Limited"] },
      { name: "Size", values: ["M"] },
    ]),
  ).toEqual([
    { name: "Title", values: ["Limited"] },
    { name: "Size", values: ["M"] },
  ]);
});

test("uses the configured variant, then an available fallback", () => {
  expect(defaultVariant(product())?.id).toBe("variant-medium-black");
  expect(defaultVariant(product({ variantId: "missing" }))?.id).toBe(
    "variant-medium-black",
  );
});

test("resolves only a complete exact variant selection", () => {
  const item = product();
  expect(resolveVariant(item, { Size: "M", Color: "Black" })?.id).toBe(
    "variant-medium-black",
  );
  expect(resolveVariant(item, { Size: "M" })).toBeNull();
  expect(resolveVariant(item, { Size: "S", Color: "Black" })).toBeNull();
});
