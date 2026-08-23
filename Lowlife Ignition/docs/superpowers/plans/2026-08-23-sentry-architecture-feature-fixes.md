# Sentry, Right-Sized Architecture, and Feature Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the live horizontal overflow, add right-sized client/server error reporting and input/config hardening, and make Monthly Mag articles browsable with Instagram attribution.

**Architecture:** Keep the current TanStack Start + Shopify layout. Add no repository classes and perform no broad folder migration: the app already has a coherent Shopify boundary under `src/lib/shopify`, 17 page sections, and shared UI primitives. Add only a browser observability adapter, a worker/server observability adapter, one small newsletter boundary helper, and one pure ShopTickets mapper so failures and money-adjacent logic are testable without introducing a new application layer.

**Tech Stack:** React 19, TanStack Start/Router/Query, Vite 8, Nitro 3 (`cloudflare-module` output), Tailwind CSS 4, Shopify Storefront/Admin GraphQL APIs, Vercel, Sentry JavaScript SDKs, Playwright test runner, TypeScript.

**Spec:** `/home/codespace/.codex/attachments/72149ec0-c882-4d5a-a3b2-9b39bab2b993/pasted-text.txt`

## Global Constraints

- Implement and ship one approved phase at a time on its own feature branch; QA its Vercel Preview before merging to `main`.
- Use a real merge commit (`--no-ff`) when GitHub PR access is unavailable; do not rewrite published history because the repository is Lovable-connected.
- Run `npm run typecheck`, `npm run build`, `npm run lint`, and the phase-specific tests before every merge.
- Do not write production secrets or Vercel environment values from code. The owner supplies Sentry and hosting values manually.
- Never log `SHOPIFY_ADMIN_ACCESS_TOKEN`, `SENTRY_AUTH_TOKEN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, request authorization headers, full GraphQL variables, cart IDs, customer IDs, or newsletter email addresses.
- Preserve current local mock-data behavior when not running on Vercel; production and Preview deployments must fail clearly when required Shopify configuration is absent.
- Preserve the existing Shopify-hosted checkout and Shop Pay flows. Do not add custom pricing, discount, or payment calculations.
- No tenant isolation, database migration, queue, Redis, worker process, webhook framework, repository classes, or server-state framework migration.
- No broad `overflow-x: hidden` on `html` or `body`; fix the measured components that create excess width.

---

## Read-Only Audit Findings

### Runtime and deployment

- The application is no longer a pure client SPA. It is a TanStack Start SSR application with a custom Fetch-style server entry in `src/server.ts` and a real public `POST /api/shopify/newsletter` endpoint.
- `@lovable.dev/vite-tanstack-config` supplies TanStack Start, React, Tailwind, path aliases, and Nitro. The current build artifact reports Nitro preset `cloudflare-module` with `nodejs_compat`, while production is served by Vercel (`server: Vercel`).
- `package-lock.json` is authoritative; npm is the package manager.
- GitHub Actions runs lint, typecheck, and build on pushes and pull requests to `develop` and `main` using Node 24.
- Vercel Git integration already creates successful deployments for feature-branch commits as well as `main`. Recent work uses feature branches followed by no-fast-forward merges to `main`. The `develop` branch exists but is not part of the recent release path.

### Source organization

- `src` has 119 tracked files: 17 section components, 46 generated/shared UI primitives, eight Shopify-specific modules, four application routes, and a small set of shared helpers.
- The current `src/components/sections`, `src/components/ui`, and `src/lib/shopify` separation is adequate at this size. Moving existing files into `core/features/shared/common` would create churn without removing a current pain point.
- `src/lib/shopify/hooks.ts` is the largest mixed data-mapping module. Only the ShopTickets collection mapper merits extraction because it is money-adjacent and needs isolated tests; a repository abstraction is not warranted.
- Future payment and invoicing integrations can land later as `src/lib/payments/` and `src/lib/invoicing/`, with matching route/section UI only when those integrations exist. Do not create those folders now.

### Existing error handling and observability

- No Sentry, LogRocket, Datadog, Rollbar, or similar SDK is installed.
- A root TanStack route error component already provides consistent retry/home UI in `src/routes/__root.tsx`.
- SSR has two existing fallback paths: request middleware in `src/start.ts` and catastrophic h3-response normalization in `src/server.ts`/`src/lib/error-capture.ts`.
- Browser boundary errors are currently sent only to Lovable's optional `window.__lovableEvents` hook. That hook must remain active after Sentry is added.
- Shopify content-query errors are converted to local fallback data and only logged with `console.warn`. Cart, ShopTickets, and product actions generally show a toast but only use `console.error` for diagnostics.
- Checkout is Shopify-hosted. The client stores Shopify's cart ID, displays Shopify-returned totals, and navigates to Shopify's returned `checkoutUrl`; Shop Pay is a Shopify web component. There is no custom production discount calculation. `WELCOME10` is displayed after newsletter signup but is not applied or calculated by this app.
- `TICKETS_ENABLED` is currently `false`. ShopTickets collections and variants are fetched, but purchase controls are hidden. Event schedule/location values remain a documented hardcoded map because ShopTickets does not expose those fields through this store's Storefront API.

### Environment and trust boundaries

- `.env.example` declares `VITE_SHOPIFY_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SHOPIFY_ADMIN_URL`, `VITE_SHOPTICKETS_SCANNER_URL`, `SHOPIFY_ADMIN_DOMAIN`, and `SHOPIFY_ADMIN_ACCESS_TOKEN`. No credential is hardcoded in tracked source.
- This workspace has no local `.env` file and no relevant process variables, so exact Vercel dashboard scopes cannot be inspected here.
- Production proves that the Storefront domain/token and newsletter Admin token are present: live Shopify content loads, and an invalid newsletter body returns validation status `400` rather than configuration status `503`. `SHOPIFY_ADMIN_DOMAIN` may be absent because it deliberately falls back to `VITE_SHOPIFY_DOMAIN`.
- The public `/crew-ops` page currently renders the placeholder Shopify Admin URL and generic `https://shoptickets.net/`, so the two staff-destination variables are not configured with store-specific values in production.
- The newsletter endpoint validates only an email-shaped string, ignores unknown fields, has no request-size/content-type guard, has no rate limiting, and currently returns upstream Shopify error text to the visitor.
- There are no other public API routes, inbound webhooks, databases, migrations, authentication flows, queues, or background jobs. `/crew-ops` only links to external staff tools and exposes no operational data.

### Tests

- No `*.test.*`, `*.spec.*`, `tests/`, or configured test runner exists. CI currently runs only lint, typecheck, and build.

### Monthly Mag versus Owner Spotlight

- Monthly Mag reads Shopify **blog articles**, not metaobjects. `ARTICLES_QUERY` currently fetches the newest 12 root articles. Live Shopify has one article, `FK8_baddie`, in blog handle `news`, with no tags and no `custom.instagram_handle` value.
- Shopify's Storefront API supports Article metafields. An Article metafield definition with `access.storefront = PUBLIC_READ` can be queried directly as `metafield(namespace: "custom", key: "instagram_handle")`.
- Owner Spotlight reads `spotlight_build` metaobjects through `GALLERY_QUERY`; live Shopify currently has one entry. Its UI uses the shared Embla-based components in `src/components/ui/carousel.tsx` and renders `instagram_handle` as an external Instagram link.
- Multiple Monthly Mag slides require only more published articles in Shopify's existing **News** blog; no new metaobject type is needed. The Instagram field does require a new Article metafield definition.

### Measured overflow causes

- At production widths 375, 430, 768, 1280, and 1440, `document.documentElement.scrollWidth` is respectively 516, 516, 789, 1445, and 1525 pixels.
- The hero marquee is 1,956px wide but is already clipped by `#top`; hiding it does not change document width.
- Hiding `#mag` reduces the 375/430px document width from 516px to 483px. The Monthly Mag mobile heading row places the fixed issue block at x=426.84–516.23px. The feature title `FK8_baddie` also creates a 407px width at 375px.
- Hiding `#about` makes the 768, 1280, and 1440px documents exactly viewport width. The Syne heading `Built in Houston. Repped everywhere.` has a 459px mobile min-content width and a 765px width at larger type sizes; it expands the grid. The offset anniversary badge then adds a smaller overhang.
- A live DOM mutation using `min-width: 0`, responsive About heading sizes (26px mobile, 48px tablet, 36px in the desktop split grid), and a stacked 36px Monthly Mag mobile heading fixes widths 430–1440 exactly. At 375px the remaining 407px width is the feature article title, so its mobile size must also be reduced from 36px to 30px and its grid child constrained.

### Sentry SDK decision and one open compatibility gate

- The current official framework package is `@sentry/tanstackstart-react` 10.x and is still beta. Its Node-oriented server exports are documented as incompatible with Cloudflare/workerd builds, which this repository currently produces.
- Use stable runtime-specific SDKs instead: `@sentry/react` in the browser, `@sentry/cloudflare` around the Fetch-style server handler, and `@sentry/vite-plugin` for release/source-map upload. `@sentry/react` already provides TanStack Router browser tracing integration.
- One uncertainty must be proven in Phase 2 Preview before merge: Vercel is executing a Nitro `cloudflare-module` artifact. The existing Fetch handler works in production, but the Sentry Cloudflare wrapper must be smoke-tested on Vercel Preview. If that wrapper fails in Preview, ship browser Sentry first and keep server captures behind the existing SSR error wrapper until Vercel/Lovable's exact runtime adapter is documented; do not substitute `@sentry/node` into a workerd bundle.

---

## Proposed Phase Order

1. **Phase 1 — Horizontal overflow regression and fix.** This is live, user-visible, isolated, and does not depend on external account setup.
2. **Phase 2 — Sentry and centralized error reporting.** Add visibility before later content and hardening changes. This phase requires the owner to provide Sentry project values before final verification.
3. **Phase 3 — Monthly Mag carousel and Instagram handle.** The carousel and attribution share the same Article data/query/UI path and should ship together.
4. **Phase 4 — Environment validation, newsletter boundary hardening, and money-adjacent tests.** Lower-visibility hardening lands after observability, without a folder migration.

Each phase stops after its production verification and report. Do not start the next phase without explicit approval.

---

## Phase 1: Horizontal Overflow Regression and Fix

### Task 1: Establish the browser regression harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/horizontal-overflow.spec.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the existing `npm run dev` server on port 8080.
- Produces: `npm run test:e2e` and a Chromium assertion that the root/body widths equal the viewport at 375, 430, 768, 1280, and 1440 pixels.

- [ ] **Step 1: Install one test runner used by all later phases**

Run:

```bash
npm install --save-dev @playwright/test
```

Add scripts:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:e2e": "playwright test tests/e2e"
  }
}
```

- [ ] **Step 2: Add the local web-server configuration**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Write the failing width test**

Create `tests/e2e/horizontal-overflow.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

for (const width of [375, 430, 768, 1280, 1440]) {
  test(`homepage does not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      localStorage.setItem("lowlife-newsletter-seen-at", String(Date.now())),
    );
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("#mag article h3").first().evaluate((heading) => {
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
```

- [ ] **Step 4: Run the regression and record the expected failure**

Run:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected before the fix: all five cases fail with the measured widths listed in the audit.

- [ ] **Step 5: Add browser installation and tests to CI**

After `npm ci`, add:

```yaml
- name: Install Playwright Chromium
  run: npx playwright install --with-deps chromium

- name: Test
  run: npm test
```

- [ ] **Step 6: Commit the regression harness**

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e/horizontal-overflow.spec.ts ../.github/workflows/ci.yml
git commit -m "test: cover responsive page overflow"
```

### Task 2: Fix About and Monthly Mag at their actual constraints

**Files:**
- Modify: `src/components/sections/SectionHeader.tsx:1-28`
- Modify: `src/components/sections/About.tsx:138-187`
- Modify: `src/components/sections/MonthlyMag.tsx:81-148`
- Test: `tests/e2e/horizontal-overflow.spec.ts`

**Interfaces:**
- Consumes: existing `SectionHeader` callers and the Phase 1 Playwright test.
- Produces: optional `compact` sizing on `SectionHeader`, constrained About grid children, and responsive Monthly Mag header/feature typography.

- [ ] **Step 1: Add an explicit compact heading mode for split layouts**

Change `SectionHeader` to accept `compact?: boolean` and compute its heading classes:

```tsx
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const titleSize = compact
    ? "text-[1.625rem] sm:text-5xl lg:text-4xl"
    : "text-4xl sm:text-6xl";

  return (
    <div className="mb-10 min-w-0 flex flex-col gap-3 sm:mb-14">
      <div className="flex items-center gap-3 text-primary">
        <div className="h-px w-8 bg-gradient-brand" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
          {eyebrow}
        </span>
      </div>
      <h2
        className={`max-w-2xl font-heading font-black uppercase leading-[0.95] ${titleSize}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

Use `compact` only for About. Do not reduce headings site-wide.

- [ ] **Step 2: Constrain both About grid tracks and the offset badge**

Update the grid and its two direct children, and pass `compact`:

```diff
- <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
-   <div className="relative">
+ <div className="grid min-w-0 gap-14 lg:grid-cols-2 lg:gap-20">
+   <div className="relative min-w-0">
      <img
        src={gallery11}
        alt="Lowlife community gathering with modified cars at a raceway"
        loading="lazy"
        className="aspect-[4/5] w-full object-cover"
      />
      <div className="absolute -bottom-6 -right-2 rounded-sm border border-primary bg-background px-4 py-3 text-center sm:-right-6">
        <div className="text-gradient-brand font-display text-4xl">10+</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-chrome-dim">
          Years Deep
        </div>
      </div>
    </div>
-   <div>
+   <div className="min-w-0">
      <SectionHeader
+       compact
        eyebrow="Our Story"
        title="Built in Houston. Repped everywhere."
      />
```

Keep the badge offsets; once the track is constrained, its right edge remains within 375px and above.

- [ ] **Step 3: Stack the Monthly Mag masthead on mobile**

Use:

```tsx
<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
  <div className="min-w-0">
    {/* eyebrow */}
    <h2 className="mt-1 font-heading text-4xl font-black uppercase leading-none sm:text-7xl lg:text-8xl">
      Feature of the month
    </h2>
  </div>
  <div className="shrink-0 text-left text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground sm:text-right">
    {/* issue and month */}
  </div>
</div>
```

- [ ] **Step 4: Constrain the featured article and reduce only its smallest title size**

Use `min-w-0` on the article-detail grid and both grid children, and change the feature title from `text-4xl sm:text-6xl lg:text-7xl` to:

```tsx
<h3 className="max-w-5xl font-heading text-3xl font-black uppercase leading-[0.95] sm:text-6xl">
  {featured.title}
</h3>
```

This makes the measured `FK8_baddie` title fit the 343px content width at 375px while preserving the larger treatment from 640px upward.

- [ ] **Step 5: Run the responsive regression and visual review**

Run:

```bash
npm run test:e2e
npm run typecheck
npm run build
npm run lint
```

Expected: root/body/client widths match at all five viewports; About text and anniversary badge remain fully visible; Monthly Mag title, issue metadata, image, excerpt, and CTA remain readable.

- [ ] **Step 6: Commit the layout fix**

```bash
git add src/components/sections/SectionHeader.tsx src/components/sections/About.tsx src/components/sections/MonthlyMag.tsx
git commit -m "fix: remove homepage horizontal overflow"
```

### Task 3: Ship and stop for Phase 1 QA

- [ ] Push the Phase 1 branch and wait for GitHub CI and its Vercel Preview to succeed.
- [ ] Run the same width assertion against the Preview URL, then capture 375px and 1280px screenshots of About and Monthly Mag.
- [ ] After approval, merge with a real merge commit, wait for Vercel Production `Ready`, repeat the width assertion on `https://www.lowlifeest15.net/`, report, and stop.

---

## Phase 2: Sentry and Centralized Error Reporting

### Owner inputs required before Phase 2 production verification

Create a Sentry **React** project and provide:

- `VITE_SENTRY_DSN` — paste the project DSN here; this is the single runtime DSN used by browser and server bundles and is not treated as a secret.
- `SENTRY_AUTH_TOKEN` — Sentry release/source-map upload token; secret and build-only.
- `SENTRY_ORG` — organization slug.
- `SENTRY_PROJECT` — project slug.

Set all four in Vercel Preview and Production scopes. Do not paste values into chat logs, source files, or CI output.

### Task 1: Install runtime-specific Sentry packages and declare configuration

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces: browser SDK, worker SDK, release/source-map upload, and one DSN placeholder.

- [ ] **Step 1: Install matching Sentry 10.x packages**

```bash
npm install @sentry/react @sentry/cloudflare
npm install --save-dev @sentry/vite-plugin
```

Keep all Sentry packages on the same resolved 10.x minor in `package-lock.json`.

- [ ] **Step 2: Add placeholders without values**

Append to `.env.example`:

```dotenv
# Sentry runtime DSN. Safe to expose to the browser; paste the project DSN here.
VITE_SENTRY_DSN=

# Build-only source map upload settings. SENTRY_AUTH_TOKEN is secret.
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

- [ ] **Step 3: Configure hidden source maps through the existing Lovable wrapper**

Extend, rather than replace, `defineConfig`:

```ts
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const sentryUploadConfigured =
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT;

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  vite: {
    build: { sourcemap: "hidden" },
    plugins: sentryUploadConfigured
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            release: { name: process.env.VERCEL_GIT_COMMIT_SHA },
            sourcemaps: { filesToDeleteAfterUpload: [".output/**/*.map"] },
          }),
        ]
      : [],
  },
});
```

Verify the Lovable wrapper preserves plugin ordering and that `.output/public` and `.output/server` maps upload. If the plugin only sees intermediate Vite outputs, adjust its `sourcemaps.assets` to the emitted `.output/**/*.map`; do not add a second TanStack/Nitro plugin.

### Task 2: Initialize browser Sentry before router render and preserve Lovable capture

**Files:**
- Create: `src/lib/observability.client.ts`
- Modify: `src/router.tsx:1-16`
- Modify: `src/routes/__root.tsx:10-49`
- Modify: `src/lib/lovable-error-reporting.ts`

**Interfaces:**
- Produces: `reportClientError(error, context)` and `addClientBreadcrumb(message, context)`.
- Context values are low-cardinality strings/booleans only; no tokens, emails, cart IDs, customer IDs, or GraphQL variables.

- [ ] **Step 1: Create the browser adapter**

```ts
import * as Sentry from "@sentry/react";
import { reportLovableError } from "./lovable-error-reporting";

export function initClientObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn || Sentry.isInitialized()) return;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
  });
}

export function reportClientError(
  error: unknown,
  context: Record<string, string | number | boolean | null> = {},
) {
  reportLovableError(error, context);
  Sentry.captureException(error, { contexts: { lowlife: context } });
}

export function addClientBreadcrumb(
  message: string,
  data: Record<string, string | number | boolean | null> = {},
) {
  Sentry.addBreadcrumb({ category: "storefront", message, data });
}
```

Do not enable Replay, Feedback, default PII, or Sentry Logs in this phase.

- [ ] **Step 2: Initialize before creating the router and add router tracing**

In `src/router.tsx`, call `initClientObservability()` before `createRouter()` when `window` exists, then add:

```ts
if (!router.isServer) {
  Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));
}
```

- [ ] **Step 3: Route the existing root boundary through the shared adapter**

Replace direct `console.error` plus the one-off Lovable call with:

```ts
useEffect(() => {
  reportClientError(error, {
    area: "router",
    action: "root_error_boundary",
    route: window.location.pathname,
  });
}, [error]);
```

Keep the existing retry/home fallback UI unchanged.

### Task 3: Wrap the Fetch server and capture SSR/newsletter failures

**Files:**
- Create: `src/lib/observability.server.ts`
- Modify: `src/server.ts:1-76`
- Modify: `src/start.ts:1-22`
- Modify: `src/lib/shopify/newsletter.server.ts:141-191`

**Interfaces:**
- Produces: `reportServerError(error, context)` and a Sentry-wrapped default Fetch handler.

- [ ] **Step 1: Create a server capture helper**

```ts
import * as Sentry from "@sentry/cloudflare";

export function reportServerError(
  error: unknown,
  context: Record<string, string | number | boolean | null> = {},
) {
  Sentry.withScope((scope) => {
    scope.setContext("lowlife", context);
    Sentry.captureException(error);
  });
}
```

- [ ] **Step 2: Wrap the current exported handler, do not replace its normalization**

Change only `export default {` at current line 59 to `const server = {`, keep the `fetch` implementation intact except for replacing its two error logs with `reportServerError`, and append this export after the closing `};`:

```ts
export default Sentry.withSentry(
  (env: Record<string, unknown>) => ({
    dsn: String(env.VITE_SENTRY_DSN ?? import.meta.env.VITE_SENTRY_DSN ?? ""),
    environment: String(env.VERCEL_ENV ?? import.meta.env.MODE),
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  }),
  server,
);
```

Use the actual `@sentry/cloudflare` 10.x `withSentry` signature reported by TypeScript if it differs; preserve the same configuration and Fetch handler semantics.

- [ ] **Step 3: Capture existing middleware and newsletter catches with non-sensitive context**

Use contexts such as:

```ts
reportServerError(error, { area: "ssr", action: "request_middleware" });
reportServerError(error, { area: "newsletter", action: "shopify_signup" });
```

Do not attach request bodies, email addresses, Admin API variables, headers, or tokens.

### Task 4: Capture Shopify fallback and money-adjacent browser failures

**Files:**
- Modify: `src/lib/shopify/hooks.ts:208-215`
- Modify: `src/lib/shopify/cart.ts:227-320`
- Modify: `src/components/sections/Shop.tsx:34-45`
- Modify: `src/routes/shop.tsx:78-90`
- Modify: `src/components/sections/ProductQuickView.tsx:96-111`
- Modify: `src/components/sections/CartDrawer.tsx:47-68`
- Modify: `src/components/sections/Events.tsx:87-106`
- Modify: `src/components/sections/NewsletterPopup.tsx:47-67`

**Interfaces:**
- Consumes: `reportClientError` and `addClientBreadcrumb`.
- Produces: consistent area/action context for content fallback, cart mutations, ShopTickets handoff, checkout handoff, and newsletter failure.

- [ ] **Step 1: Upgrade `fallbackOnError` without changing fallback behavior**

```ts
function fallbackOnError<T>(label: string, fallback: T) {
  return (error: unknown) => {
    reportClientError(error, {
      area: "shopify_content",
      action: label,
      fallbackUsed: true,
    });
    return fallback;
  };
}
```

- [ ] **Step 2: Replace action-level console calls with shared capture and keep current toasts**

At each catch, use a stable pair such as `{ area: "cart", action: "add_line" }`, `{ area: "cart", action: "update_quantity" }`, `{ area: "events", action: "checkout_handoff" }`, or `{ area: "newsletter", action: "subscribe" }`. Do not include product names, variant IDs, cart IDs, or email addresses.

- [ ] **Step 3: Add checkout breadcrumbs and synchronous handoff capture**

Before `window.location.assign`, validate the Shopify URL and record:

```ts
const checkoutUrl = new URL(shopifyCart.checkoutUrl);
if (checkoutUrl.protocol !== "https:") {
  throw new Error("Shopify checkout URL must use HTTPS.");
}
addClientBreadcrumb("Shopify checkout handoff", {
  area: "checkout",
  lineCount: shopifyCart.totalQuantity,
});
window.location.assign(checkoutUrl.href);
```

Wrap synchronous URL/assignment errors and report `{ area: "checkout", action: "redirect" }`. State in the phase report that a browser/network failure after navigation begins is outside the app's observable lifecycle.

### Task 5: Verify Sentry in Preview, remove the verification trigger, then ship

- [ ] Run unit/E2E tests, lint, typecheck, and build with Sentry variables absent; the SDK must no-op and the build must succeed.
- [ ] After the owner sets Preview Sentry variables, push the phase branch and verify the Vercel Preview reaches `Ready`.
- [ ] Add a temporary browser query-flag throw in the root route (`if (new URLSearchParams(window.location.search).has("sentry-test")) throw new Error("Sentry browser Preview verification")`), push it, open `?sentry-test=1`, and confirm one browser event resolves to the original TypeScript line with environment/release tags.
- [ ] Add a temporary server query-flag throw before newsletter routing (`if (new URL(request.url).searchParams.has("sentry-server-test")) throw new Error("Sentry server Preview verification")`), push it, open `?sentry-server-test=1`, and confirm the server event contains only the planned SSR context.
- [ ] Add a follow-up commit removing both verification flags before merge; never merge a callable test trigger. Then submit an ordinary invalid newsletter request and confirm its expected `400` response does not create an error event.
- [ ] Confirm the Vercel Preview still serves SSR and returns `400` for an invalid newsletter email. If the Cloudflare wrapper breaks the Preview, remove only the server wrapper/captures, ship browser Sentry, document server Sentry as blocked by runtime compatibility, and do not install `@sentry/node`.
- [ ] Merge, verify Production `Ready`, confirm a real browser error test through Sentry's dashboard without leaving a test route, report, and stop.

---

## Phase 3: Monthly Mag Carousel and Instagram Attribution

### Owner Shopify Admin action required

In Shopify Admin:

1. Open **Settings → Custom data → Blog posts → Add definition**.
2. Name: `Instagram handle`; namespace/key: `custom.instagram_handle`; type: **Single line text**.
3. Enable Storefront/public read access for the definition.
4. Set the current `FK8_baddie` News article value to `@Fk8_baddie`.
5. Add future monthly features as additional published articles in the existing **News** blog, each with title, excerpt, content, featured image, author, and Instagram handle. Published articles automatically become carousel slides, newest first.

### Task 1: Query and type the Article Instagram metafield

**Files:**
- Modify: `src/lib/shopify/operations.ts:74-98`
- Modify: `src/lib/shopify/hooks.ts:73-85,252-268`
- Modify: `src/lib/shopify-types.ts:25-37`
- Modify: `src/lib/mock-storefront-data.ts:385-435`

**Interfaces:**
- Produces: `ShopifyArticle.instagramHandle?: string` populated from `custom.instagram_handle`.

- [ ] **Step 1: Scope the article query to the confirmed News blog and request the metafield**

Use:

```graphql
query StorefrontArticles($first: Int!) {
  blog(handle: "news") {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        handle
        title
        excerpt
        contentHtml
        publishedAt
        authorV2 { name }
        image { url altText width height }
        instagramHandle: metafield(
          namespace: "custom"
          key: "instagram_handle"
        ) { value }
      }
    }
  }
}
```

Change `ArticlesResponse` from `articles` to `blog: { articles: ... } | null`; map `node.instagramHandle?.value.trim() || undefined`; retain local `ARTICLES` fallback when the blog is absent, empty, or fails.

- [ ] **Step 2: Extend the public type**

```ts
export type ShopifyArticle = {
  // existing fields
  instagramHandle?: string;
};
```

- [ ] **Step 3: Run typecheck to prove all existing article consumers tolerate the optional field**

Add `instagramHandle: "@midnight_candy"` to the first local fallback article. This remains mock-only content for unconfigured development and gives the carousel/link test a deterministic optional-field fixture.

```bash
npm run typecheck
```

### Task 2: Reuse the Owner Spotlight carousel primitives for Monthly Mag

**Files:**
- Modify: `src/components/sections/MonthlyMag.tsx:1-206`
- Test: `tests/e2e/monthly-mag.spec.ts`

**Interfaces:**
- Consumes: `Carousel`, `CarouselApi`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, and `CarouselNext` from `src/components/ui/carousel.tsx`.
- Produces: swipe/arrow navigation across all published News articles and active issue metadata.

- [ ] **Step 1: Write the failing carousel behavior test**

Use the existing four local fallback articles (Shopify is intentionally unconfigured in the test server), then assert four slides, enabled next navigation, and changed title/month after click. The first mock article carries `@midnight_candy`; the other mock entries prove the field remains optional.

Core assertions:

```ts
await expect(page.locator('#mag [aria-roledescription="slide"]')).toHaveCount(4);
await expect(
  page.locator('#mag a[href="https://instagram.com/midnight_candy"]'),
).toBeVisible();
await page.getByRole("button", { name: "Next slide" }).click();
await expect(page.locator('#mag [aria-current="true"]')).toContainText(
  "FIVE BUILDS THAT OWNED THE NIGHT MEET",
);
await expect(
  page
    .locator('#mag [aria-roledescription="slide"]')
    .nth(1)
    .locator('a[href*="instagram.com/"]'),
).toHaveCount(0);
```

- [ ] **Step 2: Extract the existing feature article markup into a local component**

Define `FeaturedArticle` inside `MonthlyMag.tsx`, move the current feature JSX from lines 98–149 into it, and make these exact substitutions within the moved block:

```diff
+ function FeaturedArticle({ article }: { article: ShopifyArticle }) {
+   const featuredIntro = articleIntro(article.contentHtml, article.excerpt);
+   return (
-     <article id={`article-${featured.handle}`} className="pt-8 sm:pt-12">
+     <article id={`article-${article.handle}`} className="min-w-0 pt-8 sm:pt-12">
-       featured.image
+       article.image
-       featured.title
+       article.title
-       featured.excerpt
+       article.excerpt
-       params={{ handle: featured.handle }}
+       params={{ handle: article.handle }}
        {featuredIntro && <FeaturedIntro intro={featuredIntro} />}
      </article>
+   );
+ }
```

The `featured.image/title/excerpt/handle` lines above denote direct identifier substitutions in the moved JSX; do not change the current image letterboxing, metadata, quote, or CTA markup.

This is a rendering split only; do not create a second data hook or repository.

- [ ] **Step 3: Track the selected slide using the shared API**

```ts
const [carouselApi, setCarouselApi] = useState<CarouselApi>();
const [activeIndex, setActiveIndex] = useState(0);

useEffect(() => {
  if (!carouselApi) return;
  const sync = () => setActiveIndex(carouselApi.selectedScrollSnap());
  sync();
  carouselApi.on("select", sync);
  carouselApi.on("reInit", sync);
  return () => {
    carouselApi.off("select", sync);
    carouselApi.off("reInit", sync);
  };
}, [carouselApi]);
```

Set the issue label/month from `articles[activeIndex] ?? articles[0]`.

- [ ] **Step 4: Wrap every article in the existing carousel pattern**

```tsx
<Carousel opts={{ align: "start", loop: true }} setApi={setCarouselApi} className="sm:px-12">
  <CarouselContent>
    {articles.map((article, index) => (
      <CarouselItem
        key={article.handle}
        aria-current={index === activeIndex ? "true" : undefined}
      >
        <FeaturedArticle article={article} />
      </CarouselItem>
    ))}
  </CarouselContent>
  {articles.length > 1 && (
    <>
      <CarouselPrevious className="left-0 border-border bg-card hover:border-primary" />
      <CarouselNext className="right-0 border-border bg-card hover:border-primary" />
    </>
  )}
</Carousel>
```

Retain the existing “Inside this issue” list as quick links to the next three articles, excluding the active slide. This avoids showing the selected feature twice while preserving the current section.

### Task 3: Match Owner Spotlight's Instagram treatment on homepage and article detail

**Files:**
- Modify: `src/components/sections/MonthlyMag.tsx`
- Modify: `src/routes/mag.$handle.tsx:130-190`
- Test: `tests/e2e/monthly-mag.spec.ts`

- [ ] **Step 1: Render the optional external link in `FeaturedArticle`**

```tsx
{article.instagramHandle && (
  <a
    href={`https://instagram.com/${article.instagramHandle.replace("@", "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
  >
    <Instagram className="h-4 w-4" />
    {article.instagramHandle}
  </a>
)}
```

Render nothing when blank; do not show an empty credit bar.

- [ ] **Step 2: Render the same link beneath author/date on `/mag/$handle`**

Use the same URL normalization, icon, external attributes, and typography so the attribution survives navigation to the full story.

- [ ] **Step 3: Verify carousel, swipe, links, and one-entry fallback**

Run the four-entry local test. At 375px, swipe to the second slide; at 1280px, use arrows. Confirm each title, image, date/month, CTA route, and Instagram link follows the active article. Use the real one-article Vercel Preview before the owner publishes a second News article to assert that no arrow buttons render and the current feature remains unchanged.

- [ ] **Step 4: Commit the Shopify mapping and UI as one feature**

```bash
git add src/lib/shopify/operations.ts src/lib/shopify/hooks.ts src/lib/shopify-types.ts src/lib/mock-storefront-data.ts src/components/sections/MonthlyMag.tsx 'src/routes/mag.$handle.tsx' tests/e2e/monthly-mag.spec.ts
git commit -m "feat: add Monthly Mag carousel and Instagram credits"
```

### Task 4: Ship and stop for Phase 3 QA

- [ ] Push, verify CI and Vercel Preview, and QA first with the four-article local fixture because production has only one published News article today.
- [ ] After the owner creates the Article metafield and publishes/fills a second News article, confirm both real entries in Preview.
- [ ] Merge, wait for Production `Ready`, verify carousel and Instagram link on homepage and article detail, report, and stop.

---

## Phase 4: Environment Validation, Newsletter Hardening, and Money-Adjacent Tests

### Task 1: Fail Vercel builds clearly when required configuration is absent

**Files:**
- Create: `config/environment.ts`
- Modify: `vite.config.ts`
- Modify: `.env.example`
- Test: `tests/unit/environment.spec.ts`

**Interfaces:**
- Produces: `validateHostingEnvironment(env)` with missing/invalid variable names only; it never returns or logs values.

- [ ] **Step 1: Write a pure validator beside the Vite config**

Create `config/environment.ts`:

```ts
const REQUIRED_VERCEL_ENV = [
  "VITE_SHOPIFY_DOMAIN",
  "VITE_SHOPIFY_STOREFRONT_TOKEN",
  "SHOPIFY_ADMIN_ACCESS_TOKEN",
  "VITE_SHOPIFY_ADMIN_URL",
] as const;

export function validateHostingEnvironment(env: NodeJS.ProcessEnv) {
  if (!env.VERCEL) return;
  const missing: string[] = REQUIRED_VERCEL_ENV.filter(
    (key) => !env[key]?.trim(),
  );
  if (env.VITE_SHOPIFY_ADMIN_URL?.includes("your-store-handle")) {
    missing.push("VITE_SHOPIFY_ADMIN_URL");
  }
  if (env.VITE_SENTRY_DSN?.trim()) {
    for (const key of ["SENTRY_AUTH_TOKEN", "SENTRY_ORG", "SENTRY_PROJECT"] as const) {
      if (!env[key]?.trim()) missing.push(key);
    }
  }
  if (missing.length) {
    throw new Error(
      `Missing or invalid deployment environment variables: ${[...new Set(missing)].sort().join(", ")}`,
    );
  }
}
```

Call it at the top of `vite.config.ts` before `defineConfig(...)`. Local builds without `VERCEL` keep mock behavior; Vercel Preview/Production fail during build with names only.

- [ ] **Step 2: Test absent, valid, placeholder, and partial-Sentry cases**

Use table tests and assert the thrown message includes only variable names, never sample values.

- [ ] **Step 3: Owner sets the actual staff URL before this phase merges**

Set `VITE_SHOPIFY_ADMIN_URL` to the store's real Admin URL in Vercel Preview and Production. Set `VITE_SHOPTICKETS_SCANNER_URL` to the secure scanner URL when ShopTickets provides it; keep that variable optional until then.

### Task 2: Strictly validate and rate-limit newsletter input at the boundary

**Files:**
- Create: `src/lib/shopify/newsletter-guard.server.ts`
- Modify: `src/lib/shopify/newsletter.server.ts:141-191`
- Test: `tests/unit/newsletter-guard.spec.ts`

**Interfaces:**
- Produces: `NewsletterRequestError` with status `400 | 413 | 415`, `parseNewsletterBody(request): Promise<{ email: string }>`, and `checkNewsletterRateLimit(ip, now): { allowed: boolean; retryAfterSeconds: number }`.

- [ ] **Step 1: Write failing boundary tests**

Cover with complete request/assertion shapes:

```ts
import { expect, test } from "@playwright/test";
import {
  checkNewsletterRateLimit,
  parseNewsletterBody,
} from "../../src/lib/shopify/newsletter-guard.server";

const jsonRequest = (body: unknown, extraHeaders: Record<string, string> = {}) =>
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

test("rejects non-json content", async () => {
  const request = new Request("https://example.test/api/shopify/newsletter", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "user@example.com",
  });
  await expect(parseNewsletterBody(request)).rejects.toMatchObject({
    status: 415,
  });
});

test("rejects bodies over 4096 bytes", async () => {
  await expect(
    parseNewsletterBody(
      jsonRequest(
        { email: "user@example.com" },
        { "content-length": "4097" },
      ),
    ),
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
    checkNewsletterRateLimit("198.51.100.11", now + 10 * 60 * 1000 + 1)
      .allowed,
  ).toBe(true);
});
```

- [ ] **Step 2: Implement strict Zod parsing with the existing dependency**

```ts
const newsletterSchema = z
  .object({ email: z.string().trim().toLowerCase().email().max(254) })
  .strict();

export class NewsletterRequestError extends Error {
  constructor(
    readonly status: 400 | 413 | 415,
    message: string,
  ) {
    super(message);
  }
}
```

Require `application/json`; reject a declared `Content-Length > 4096` before reading; read `request.text()`, independently reject an actual UTF-8 body longer than 4096 bytes, then `JSON.parse` and validate it. Convert malformed JSON and schema failures into a safe `400` response.

- [ ] **Step 3: Add a bounded best-effort in-memory limiter**

Use five attempts per IP per ten minutes, derive the IP from the first `x-forwarded-for` value, prune expired buckets on access, cap the map at 10,000 entries by deleting the oldest entry, and return `429` with `Retry-After`.

This is deliberately instance-local: it limits ordinary abuse at this storefront's scale but is not globally coordinated across serverless instances. Replace it with a Vercel/edge rate-limit service only if metrics show bypass/abuse; do not add Redis now.

- [ ] **Step 4: Stop leaking upstream errors to visitors**

Capture the original exception through `reportServerError`, but return only:

```json
{
  "subscribed": false,
  "configured": true,
  "message": "We couldn't add you right now. Try again in a moment."
}
```

Keep status `502`; never return Shopify Admin error strings.

### Task 3: Isolate and test the custom ShopTickets mapping; test variant selection

**Files:**
- Create: `src/lib/shopify/events.ts`
- Modify: `src/lib/shopify/hooks.ts:87-149,272-325`
- Test: `tests/unit/shopify-events.spec.ts`
- Test: `tests/unit/variants.spec.ts`

**Interfaces:**
- Produces: `mapEventCollection(collection): ShopifyTicketProduct | null` and existing variant helpers under test.

- [ ] **Step 1: Move only the current event node type, schedule map, and pure mapper**

`events.ts` owns the existing three-handle schedule and mapping from a Shopify collection/product/variant to `ShopifyTicketProduct`. `fetchEventTickets` remains in `hooks.ts`, calls the mapper, filters nulls, and sorts by `startsAt`. Do not create a repository class.

- [ ] **Step 2: Test event purchase inputs**

Assert that the mapper:

- returns null when the collection has no configured schedule, product, or selected variant;
- carries the selected variant ID, Shopify price, availability, collection banner, and ticket type into the result;
- marks the event unavailable if either product or selected variant is unavailable.

- [ ] **Step 3: Test existing variant resolution**

Assert that `selectableProductOptions` removes only Shopify's synthetic `Title / Default Title`, `defaultVariant` prefers the configured/default available variant, and `resolveVariant` returns the exact selected variant or null for incomplete selections.

- [ ] **Step 4: Declare the remaining checkout test boundary honestly**

Automated tests cover app-owned selection/mapping. Shopify calculates production subtotal, taxes, discounts, and checkout; Shop Pay and hosted checkout receive manual Preview QA with a low-value test product. There is no custom discount application to unit test, and `TICKETS_ENABLED=false` prevents a live ticket purchase until the client enables it.

### Task 4: Final architecture/deployment verification and stop

- [ ] Run the full Playwright suite, typecheck, build, and lint.
- [ ] Confirm a missing required Vercel variable fails Preview build with names only; restore it through Vercel before continuing.
- [ ] Send valid, malformed, oversized, unknown-field, and sixth-attempt newsletter requests in Preview; verify `2xx/400/413/415/429` behavior and Sentry context without PII.
- [ ] Manually add/remove/update a Shopify cart line, verify Shopify subtotal, open Shopify checkout, and verify Shop Pay renders. Do not complete a paid order unless the owner explicitly authorizes it.
- [ ] Merge, wait for Production `Ready`, repeat safe newsletter/cart smoke tests, report manual QA debt and the instance-local limiter ceiling, and stop.

---

## Deliberately Skipped

- **Folder migration:** current section/UI/Shopify folders are clear enough; only a pure event mapper and two observability adapters are added where their runtime boundaries require them.
- **Repository/data-access classes:** the existing `shopifyFetch` plus query/mapping hooks are sufficient for the current number of queries.
- **Thin-handler refactor across multiple layers:** only one custom endpoint exists. Its network helpers can remain with the newsletter module; strict parsing/rate limiting moves to one testable helper.
- **Tenant token isolation:** there is one storefront and no tenant identifier.
- **Database, migrations, queue, Redis, async workers, and coordinated global limiter:** no workload requires them. The only server mutation is a short Shopify Admin request.
- **Inbound webhooks:** none exist. Add signature validation, replay protection, and Sentry context when a real Shopify/payment webhook is introduced.
- **React Query/SWR overhaul:** TanStack Query is already installed and used for Shopify server state. No additional state framework is needed.
- **Session Replay, Sentry Feedback, default PII, and verbose Sentry Logs:** error events, breadcrumbs, low-cardinality context, and 10% tracing are enough for this storefront's first observability pass.
- **Custom request correlation IDs:** there is no multi-service request chain today. Sentry trace IDs plus area/action context are sufficient; external payment/invoicing integrations can add provider request IDs when they exist.
- **Custom checkout totals or discount tests:** Shopify owns production totals, tax, discount application, Shop Pay, and checkout. The app tests only its own variant/event mapping and handoff.
- **Persistent staging branch now:** Vercel Preview Deployments already cover each phase. Use existing `develop` as a stable staging branch only if Chris needs a durable shared QA URL across several concurrent branches; otherwise it adds another merge/deploy hop without benefit.

## Phase Acceptance Summary

- **Phase 1:** zero horizontal overflow at 375, 430, 768, 1280, and 1440; no clipped copy or broken section layout.
- **Phase 2:** browser and compatible server errors arrive in Sentry with readable source lines and no sensitive context; existing fallback UI/toasts remain.
- **Phase 3:** two or more published News articles navigate via arrows/swipe; issue metadata and Instagram attribution follow the active article; one article remains graceful.
- **Phase 4:** Vercel config fails fast by variable name, newsletter input is strict and rate-limited, upstream errors are private, and app-owned cart/event selection logic has automated coverage.
