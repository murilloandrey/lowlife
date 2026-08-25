import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lowlife-newsletter-seen-at", String(Date.now()));
  });
});

test("Monthly Mag navigates every local article and credits Instagram", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const mag = page.locator("#mag");
  const slides = mag.locator('[aria-roledescription="slide"]');
  await expect(slides).toHaveCount(4);
  await expect(slides.first()).toHaveAttribute("aria-current", "true");
  await expect(
    slides.first().getByRole("link", { name: "@midnight_candy" }),
  ).toHaveAttribute("href", "https://instagram.com/midnight_candy");

  await mag.getByRole("button", { name: "Next slide" }).click();
  const activeSlide = mag.locator('[aria-current="true"]');
  await expect(activeSlide).toContainText(
    "Five Builds That Owned the Night Meet",
  );
  await expect(activeSlide).toContainText("Mar 18, 2026");
  await expect(activeSlide.locator('a[href*="instagram.com/"]')).toHaveCount(0);
});

test("Monthly Mag supports swipe navigation on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const carousel = page.locator('#mag [aria-roledescription="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  const box = await carousel.boundingBox();
  if (!box) throw new Error("Monthly Mag carousel was not visible.");

  const client = await page.context().newCDPSession(page);
  const y = Math.max(80, Math.min(700, box.y + 160));
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 320, y }],
  });
  for (const x of [280, 230, 180, 130, 80, 40]) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y }],
    });
  }
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });

  await expect(page.locator('#mag [aria-current="true"]')).toContainText(
    "Five Builds That Owned the Night Meet",
  );
});

test("article detail keeps the Instagram attribution", async ({ page }) => {
  await page.goto("/mag/midnight-candy-64-impala", {
    waitUntil: "networkidle",
  });

  const instagram = page.getByRole("link", { name: "@midnight_candy" });
  await expect(instagram).toHaveAttribute(
    "href",
    "https://instagram.com/midnight_candy",
  );
  await expect(instagram).toHaveAttribute("target", "_blank");
  await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
});
