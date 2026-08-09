/**
 * Instagram/TikTok embed helpers shared by the video carousel and the owner
 * spotlight so both accept the plain post links the client pastes into Shopify.
 */

/** True when the URL is a host we are willing to render inside an iframe. */
export function isEmbeddable(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.endsWith("instagram.com") ||
      parsed.hostname.endsWith("tiktok.com")
    );
  } catch {
    return false;
  }
}

/**
 * Normalizes a pasted post link into the URL that actually works as an iframe
 * `src`. Instagram needs an `/embed` suffix (`/p/ABC123/` → `/p/ABC123/embed`);
 * TikTok post URLs are already their own embeddable form, so they pass through
 * unchanged. Returns null for anything not embeddable.
 */
export function embeddableUrl(url: string | null | undefined): string | null {
  if (!isEmbeddable(url)) return null;

  const parsed = new URL(url!);
  if (!parsed.hostname.endsWith("instagram.com")) return parsed.toString();

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments[segments.length - 1] === "embed") return parsed.toString();

  // Drop tracking params (`?igsh=…`) — the embed endpoint does not need them.
  return `https://${parsed.hostname}/${[...segments, "embed"].join("/")}`;
}
