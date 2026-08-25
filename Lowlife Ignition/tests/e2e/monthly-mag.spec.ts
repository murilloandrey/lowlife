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
  const issueCarousel = mag.getByRole("region", {
    name: "Monthly Mag issues",
  });
  const slides = issueCarousel.locator("[data-monthly-mag-issue]");
  await expect(slides).toHaveCount(4);
  await expect(slides.first()).toHaveAttribute("aria-current", "true");
  await expect(
    slides.first().getByRole("link", { name: "@midnight_candy" }),
  ).toHaveAttribute("href", "https://instagram.com/midnight_candy");

  const photoCarousel = slides.first().getByRole("region", {
    name: "Midnight Candy: Marcus Reyes' '64 Impala photos",
  });
  const photos = photoCarousel.locator('[aria-roledescription="slide"]');
  await expect(photos).toHaveCount(3);
  await expect(photos.first()).toHaveAttribute("aria-current", "true");
  await photoCarousel.getByRole("button", { name: "Next slide" }).click();
  await expect(photos.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(slides.first()).toHaveAttribute("aria-current", "true");

  await issueCarousel
    .getByRole("button", { name: "Next slide" })
    .last()
    .click();
  const activeSlide = issueCarousel.locator(
    '[data-monthly-mag-issue][aria-current="true"]',
  );
  await expect(activeSlide).toContainText(
    "Five Builds That Owned the Night Meet",
  );
  await expect(activeSlide).toContainText("Mar 18, 2026");
  await expect(activeSlide.locator('a[href*="instagram.com/"]')).toHaveCount(0);
});

test("Monthly Mag supports swipe navigation on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const mag = page.locator("#mag");
  const issueCarousel = mag.getByRole("region", {
    name: "Monthly Mag issues",
  });
  const photoCarousel = mag.getByRole("region", {
    name: "Midnight Candy: Marcus Reyes' '64 Impala photos",
  });
  await photoCarousel.scrollIntoViewIfNeeded();
  const photoBox = await photoCarousel.boundingBox();
  if (!photoBox) throw new Error("Monthly Mag photo carousel was not visible.");

  const client = await page.context().newCDPSession(page);
  const y = Math.max(80, Math.min(700, photoBox.y + photoBox.height / 2));
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

  await expect(
    photoCarousel.locator('[aria-roledescription="slide"]').nth(1),
  ).toHaveAttribute("aria-current", "true");
  await expect(
    issueCarousel.locator('[data-monthly-mag-issue][aria-current="true"]'),
  ).toContainText("Midnight Candy");
  await expect(
    photoCarousel.getByRole("button", { name: "Next slide" }),
  ).toBeHidden();
  await expect(
    issueCarousel
      .locator("[data-monthly-mag-issue]")
      .nth(1)
      .getByRole("region", { name: /photos$/ }),
  ).toHaveCount(0);
  await expect(
    issueCarousel.locator("[data-monthly-mag-issue]").nth(1),
  ).toContainText("Five Builds That Owned the Night Meet");
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
