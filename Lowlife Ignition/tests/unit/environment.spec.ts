import { expect, test } from "@playwright/test";
import { validateHostingEnvironment } from "../../config/environment";

const validEnv = {
  VERCEL: "1",
  VITE_SHOPIFY_DOMAIN: "shop.example",
  VITE_SHOPIFY_STOREFRONT_TOKEN: "storefront-secret",
  SHOPIFY_ADMIN_ACCESS_TOKEN: "admin-secret",
  VITE_SHOPIFY_ADMIN_URL: "https://admin.shopify.com/store/lowlife",
};

test("allows local builds without deployment configuration", () => {
  expect(() => validateHostingEnvironment({})).not.toThrow();
});

test("lists missing deployment variables without their values", () => {
  expect(() =>
    validateHostingEnvironment({ VERCEL: "1", PRIVATE_VALUE: "do-not-log" }),
  ).toThrow(
    "Missing or invalid deployment environment variables: SHOPIFY_ADMIN_ACCESS_TOKEN, VITE_SHOPIFY_ADMIN_URL, VITE_SHOPIFY_DOMAIN, VITE_SHOPIFY_STOREFRONT_TOKEN",
  );
});

test("rejects the Shopify Admin placeholder", () => {
  expect(() =>
    validateHostingEnvironment({
      ...validEnv,
      VITE_SHOPIFY_ADMIN_URL:
        "https://admin.shopify.com/store/your-store-handle",
    }),
  ).toThrow("VITE_SHOPIFY_ADMIN_URL");
});

test("requires source-map credentials only when Sentry is enabled", () => {
  expect(() =>
    validateHostingEnvironment({
      ...validEnv,
      VITE_SENTRY_DSN: "https://public@example.ingest.sentry.io/123",
      SENTRY_AUTH_TOKEN: "upload-secret",
    }),
  ).toThrow(
    "Missing or invalid deployment environment variables: SENTRY_ORG, SENTRY_PROJECT",
  );
});

test("accepts complete deployment configuration", () => {
  expect(() => validateHostingEnvironment(validEnv)).not.toThrow();
});
