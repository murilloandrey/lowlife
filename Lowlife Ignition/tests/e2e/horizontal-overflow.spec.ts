import { expect, test } from "@playwright/test";

for (const width of [375, 430, 768, 1280, 1440]) {
  test(`homepage does not overflow horizontally at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem("lowlife-newsletter-seen-at", String(Date.now()));
    });
    await page.goto("/", { waitUntil: "networkidle" });

    // Keep the production feature title in the regression case even when the
    // local Shopify fallback data differs.
    await page
      .locator("#mag article h3")
      .first()
      .evaluate((heading) => {
        heading.textContent = "FK8_baddie";
      });

    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      root: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));

    expect(widths.root).toBe(widths.viewport);
    expect(widths.body).toBe(widths.viewport);
  });
}
