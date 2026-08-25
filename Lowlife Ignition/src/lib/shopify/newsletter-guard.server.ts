import { z } from "zod";

const MAX_BODY_BYTES = 4096;
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

const newsletterSchema = z
  .object({ email: z.string().trim().toLowerCase().email().max(254) })
  .strict();

type RateLimitEntry = { count: number; resetAt: number };
// ponytail: instance-local by design; replace with an edge rate-limit service
// only if traffic shows meaningful cross-instance bypass.
const rateLimits = new Map<string, RateLimitEntry>();

export class NewsletterRequestError extends Error {
  constructor(
    readonly status: 400 | 413 | 415,
    message: string,
  ) {
    super(message);
  }
}

export async function parseNewsletterBody(request: Request) {
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  ) {
    throw new NewsletterRequestError(415, "Request must use application/json.");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new NewsletterRequestError(413, "Request body is too large.");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new NewsletterRequestError(413, "Request body is too large.");
  }

  try {
    return newsletterSchema.parse(JSON.parse(text));
  } catch {
    throw new NewsletterRequestError(400, "Enter a valid email address.");
  }
}

export function checkNewsletterRateLimit(ip: string, now = Date.now()) {
  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(key);
  }

  const current = rateLimits.get(ip);
  if (current) {
    if (current.count >= RATE_LIMIT_ATTEMPTS) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((current.resetAt - now) / 1000),
        ),
      };
    }
    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
    const oldest = rateLimits.keys().next().value;
    if (oldest) rateLimits.delete(oldest);
  }
  rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  return { allowed: true, retryAfterSeconds: 0 };
}
