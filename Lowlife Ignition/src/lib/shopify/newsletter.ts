export type NewsletterResult = {
  subscribed: boolean;
  configured: boolean;
  message?: string;
};

export async function subscribeToNewsletter(email: string) {
  const response = await fetch("/api/shopify/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const result = (await response.json()) as NewsletterResult;
  if (!response.ok && result.configured) {
    throw new Error(result.message || "Newsletter signup failed.");
  }
  return result;
}
