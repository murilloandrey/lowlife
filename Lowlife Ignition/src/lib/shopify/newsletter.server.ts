import { reportServerError } from "../observability.server";
import { SHOPIFY_API_VERSION } from "./client";

const CUSTOMER_SET_MUTATION = `#graphql
  mutation NewsletterCustomerSet(
    $identifier: CustomerSetIdentifiers
    $input: CustomerSetInput!
  ) {
    customerSet(identifier: $identifier, input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const MARKETING_CONSENT_MUTATION = `#graphql
  mutation NewsletterConsent(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type RuntimeEnv = Record<string, unknown>;

type AdminResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type UserError = {
  message: string;
};

function envValue(env: unknown, key: string) {
  const runtimeValue =
    env && typeof env === "object" ? (env as RuntimeEnv)[key] : undefined;
  if (typeof runtimeValue === "string") return runtimeValue.trim();
  return process.env[key]?.trim() ?? "";
}

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

async function adminFetch<T>(
  domain: string,
  token: string,
  query: string,
  variables: Record<string, unknown>,
) {
  const response = await fetch(
    `https://${normalizeDomain(domain)}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const payload = (await response.json()) as AdminResponse<T>;
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(
      payload.errors?.map((error) => error.message).join("; ") ||
        `Shopify Admin request failed with status ${response.status}.`,
    );
  }
  return payload.data;
}

function errorMessage(errors: UserError[]) {
  return errors.map((error) => error.message).join("; ");
}

async function createOrFindCustomer(
  domain: string,
  token: string,
  email: string,
) {
  const data = await adminFetch<{
    customerSet: {
      customer: { id: string } | null;
      userErrors: UserError[];
    };
  }>(domain, token, CUSTOMER_SET_MUTATION, {
    identifier: { email },
    input: { email },
  });
  if (!data.customerSet.customer || data.customerSet.userErrors.length > 0) {
    throw new Error(
      errorMessage(data.customerSet.userErrors) ||
        "Shopify could not create or find the customer.",
    );
  }
  return data.customerSet.customer.id;
}

async function subscribeCustomer(
  domain: string,
  token: string,
  customerId: string,
) {
  const data = await adminFetch<{
    customerEmailMarketingConsentUpdate: {
      customer: { id: string } | null;
      userErrors: UserError[];
    };
  }>(domain, token, MARKETING_CONSENT_MUTATION, {
    input: {
      customerId,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: new Date().toISOString(),
      },
    },
  });
  const result = data.customerEmailMarketingConsentUpdate;
  if (!result.customer || result.userErrors.length > 0) {
    throw new Error(
      errorMessage(result.userErrors) ||
        "Shopify could not record email marketing consent.",
    );
  }
}

export async function handleNewsletterRequest(request: Request, env: unknown) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/shopify/newsletter" || request.method !== "POST") {
    return null;
  }

  const domain =
    envValue(env, "SHOPIFY_ADMIN_DOMAIN") ||
    envValue(env, "VITE_SHOPIFY_DOMAIN");
  const token = envValue(env, "SHOPIFY_ADMIN_ACCESS_TOKEN");
  if (!domain || !token) {
    return Response.json(
      {
        subscribed: false,
        configured: false,
        message: "Shopify newsletter backend is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { email?: unknown };
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        {
          subscribed: false,
          configured: true,
          message: "Enter a valid email address.",
        },
        { status: 400 },
      );
    }

    const customerId = await createOrFindCustomer(domain, token, email);
    await subscribeCustomer(domain, token, customerId);
    return Response.json({ subscribed: true, configured: true });
  } catch (error) {
    reportServerError(error, {
      area: "newsletter",
      action: "shopify_signup",
    });
    return Response.json(
      {
        subscribed: false,
        configured: true,
        message:
          error instanceof Error ? error.message : "Newsletter signup failed.",
      },
      { status: 502 },
    );
  }
}
