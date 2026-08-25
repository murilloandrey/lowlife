import { expect, test } from "@playwright/test";
import { handleNewsletterRequest } from "../../src/lib/shopify/newsletter.server";

const env = {
  VITE_SHOPIFY_DOMAIN: "shop.example",
  SHOPIFY_ADMIN_ACCESS_TOKEN: "test-token",
};

function request(body: BodyInit, ip: string, contentType = "application/json") {
  return new Request("https://example.test/api/shopify/newsletter", {
    method: "POST",
    headers: {
      "content-type": contentType,
      "x-forwarded-for": `${ip}, 203.0.113.1`,
    },
    body,
  });
}

test("returns boundary status codes and a Retry-After header", async () => {
  const malformed = await handleNewsletterRequest(
    request("{", "198.51.100.20"),
    env,
  );
  expect(malformed?.status).toBe(400);

  const unknown = await handleNewsletterRequest(
    request(
      JSON.stringify({ email: "user@example.com", role: "admin" }),
      "198.51.100.21",
    ),
    env,
  );
  expect(unknown?.status).toBe(400);

  const text = await handleNewsletterRequest(
    request("user@example.com", "198.51.100.22", "text/plain"),
    env,
  );
  expect(text?.status).toBe(415);

  const large = await handleNewsletterRequest(
    request("x".repeat(4097), "198.51.100.23"),
    env,
  );
  expect(large?.status).toBe(413);

  let limited: Response | null = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    limited = await handleNewsletterRequest(request("{", "198.51.100.24"), env);
  }
  expect(limited?.status).toBe(429);
  expect(Number(limited?.headers.get("retry-after"))).toBeGreaterThan(0);
});

test("does not expose Shopify Admin errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json(
      { errors: [{ message: "private upstream customer detail" }] },
      { status: 500 },
    );

  try {
    const response = await handleNewsletterRequest(
      request(JSON.stringify({ email: "user@example.com" }), "198.51.100.25"),
      env,
    );
    expect(response?.status).toBe(502);
    const payload = await response?.json();
    expect(payload.message).toBe(
      "We couldn't add you right now. Try again in a moment.",
    );
    expect(JSON.stringify(payload)).not.toContain("private upstream");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
