import { expect, test } from "@playwright/test";
import {
  checkNewsletterRateLimit,
  parseNewsletterBody,
} from "../../src/lib/shopify/newsletter-guard.server";

const jsonRequest = (
  body: unknown,
  extraHeaders: Record<string, string> = {},
) =>
  new Request("https://example.test/api/shopify/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  });

test("accepts only a normalized email field", async () => {
  await expect(
    parseNewsletterBody(jsonRequest({ email: " USER@Example.com " })),
  ).resolves.toEqual({ email: "user@example.com" });
});

test("rejects unknown fields", async () => {
  await expect(
    parseNewsletterBody(
      jsonRequest({ email: "user@example.com", role: "admin" }),
    ),
  ).rejects.toMatchObject({ status: 400 });
});

test("rejects malformed or non-JSON input", async () => {
  const malformed = new Request("https://example.test/api/shopify/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  const text = new Request("https://example.test/api/shopify/newsletter", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "user@example.com",
  });

  await expect(parseNewsletterBody(malformed)).rejects.toMatchObject({
    status: 400,
  });
  await expect(parseNewsletterBody(text)).rejects.toMatchObject({
    status: 415,
  });
});

test("rejects declared and actual bodies over 4096 bytes", async () => {
  await expect(
    parseNewsletterBody(
      jsonRequest({ email: "user@example.com" }, { "content-length": "4097" }),
    ),
  ).rejects.toMatchObject({ status: 413 });
  await expect(
    parseNewsletterBody(jsonRequest({ email: `${"a".repeat(4096)}@x.com` })),
  ).rejects.toMatchObject({ status: 413 });
});

test("allows five attempts per IP in ten minutes and rejects the sixth", () => {
  const now = 1_000_000;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    expect(checkNewsletterRateLimit("198.51.100.10", now).allowed).toBe(true);
  }
  expect(checkNewsletterRateLimit("198.51.100.10", now)).toMatchObject({
    allowed: false,
  });
});

test("allows the IP after the ten-minute window", () => {
  const now = 2_000_000;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    checkNewsletterRateLimit("198.51.100.11", now);
  }
  expect(
    checkNewsletterRateLimit("198.51.100.11", now + 10 * 60 * 1000 + 1).allowed,
  ).toBe(true);
});
