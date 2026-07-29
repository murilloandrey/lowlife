const SHOPIFY_API_VERSION = "2026-07";

function readStorefrontConfig() {
  return {
    domain: import.meta.env.VITE_SHOPIFY_DOMAIN?.trim() ?? "",
    token: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN?.trim() ?? "",
  };
}

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

export function isShopifyConfigured() {
  const { domain, token } = readStorefrontConfig();
  return domain.length > 0 && token.length > 0;
}

type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { domain, token } = readStorefrontConfig();
  if (!domain || !token) {
    throw new Error("Shopify Storefront API is not configured.");
  }

  const response = await fetch(
    `https://${normalizeDomain(domain)}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  const payload = (await response.json()) as GraphQLResponse<T>;
  if (!response.ok || payload.errors?.length || !payload.data) {
    const message =
      payload.errors?.map((error) => error.message).join("; ") ||
      `Shopify request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload.data;
}

export { SHOPIFY_API_VERSION };
