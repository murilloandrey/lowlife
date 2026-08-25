const REQUIRED_VERCEL_ENV = [
  "VITE_SHOPIFY_DOMAIN",
  "VITE_SHOPIFY_STOREFRONT_TOKEN",
  "SHOPIFY_ADMIN_ACCESS_TOKEN",
  "VITE_SHOPIFY_ADMIN_URL",
] as const;

export function validateHostingEnvironment(
  env: Record<string, string | undefined>,
) {
  if (!env.VERCEL) return;

  const invalid: string[] = REQUIRED_VERCEL_ENV.filter(
    (key) => !env[key]?.trim(),
  );
  if (env.VITE_SHOPIFY_ADMIN_URL?.includes("your-store-handle")) {
    invalid.push("VITE_SHOPIFY_ADMIN_URL");
  }
  if (env.VITE_SENTRY_DSN?.trim()) {
    for (const key of [
      "SENTRY_AUTH_TOKEN",
      "SENTRY_ORG",
      "SENTRY_PROJECT",
    ] as const) {
      if (!env[key]?.trim()) invalid.push(key);
    }
  }
  if (invalid.length > 0) {
    throw new Error(
      `Missing or invalid deployment environment variables: ${[...new Set(invalid)].sort().join(", ")}`,
    );
  }
}
