import { expect, test } from "@playwright/test";
import {
  type EventCollectionNode,
  mapEventCollection,
} from "../../src/lib/shopify/events";

function eventCollection(
  overrides: Partial<EventCollectionNode> = {},
): EventCollectionNode {
  return {
    id: "collection-1",
    handle: "carmeet-mod-day",
    title: "CARMEET × MOD DAY",
    description: "Cars and community.",
    image: { url: "https://cdn.example/flyer.jpg", altText: "Event flyer" },
    products: {
      nodes: [
        {
          id: "product-1",
          title: "CARMEET — General Admission",
          handle: "carmeet-ticket",
          availableForSale: true,
          productType: "Ticket",
          tags: ["event"],
          priceRange: {
            minVariantPrice: { amount: "20.00", currencyCode: "USD" },
          },
          selectedOrFirstAvailableVariant: {
            id: "variant-1",
            availableForSale: true,
          },
        },
      ],
    },
    ...overrides,
  };
}

test("returns null without a configured schedule, product, or variant", () => {
  expect(
    mapEventCollection(eventCollection({ handle: "unknown-event" })),
  ).toBeNull();
  expect(
    mapEventCollection(eventCollection({ products: { nodes: [] } })),
  ).toBeNull();
  const noVariant = eventCollection();
  noVariant.products.nodes[0].selectedOrFirstAvailableVariant = null;
  expect(mapEventCollection(noVariant)).toBeNull();
});

test("maps the Shopify event purchase inputs", () => {
  expect(mapEventCollection(eventCollection())).toMatchObject({
    id: "product-1",
    variantId: "variant-1",
    handle: "carmeet-ticket",
    price: { amount: "20.00", currencyCode: "USD" },
    images: [{ url: "https://cdn.example/flyer.jpg" }],
    availableForSale: true,
    ticketType: "General Admission",
    collectionHandle: "carmeet-mod-day",
  });
});

test("requires both the product and selected variant to be available", () => {
  expect(
    mapEventCollection(
      eventCollection({
        products: {
          nodes: [
            {
              ...eventCollection().products.nodes[0],
              availableForSale: false,
            },
          ],
        },
      }),
    )?.availableForSale,
  ).toBe(false);

  const soldOutVariant = eventCollection();
  soldOutVariant.products.nodes[0].selectedOrFirstAvailableVariant = {
    id: "variant-1",
    availableForSale: false,
  };
  expect(mapEventCollection(soldOutVariant)?.availableForSale).toBe(false);
});
