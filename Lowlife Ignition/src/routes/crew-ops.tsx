import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, ScanLine, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/crew-ops")({
  head: () => ({
    meta: [
      { title: "Crew Operations — Lowlife Est. 15" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrewOperations,
});

const shopifyAdminUrl =
  import.meta.env.VITE_SHOPIFY_ADMIN_URL?.trim() ||
  "https://admin.shopify.com/store/your-store-handle";
const shopTicketsScannerUrl =
  import.meta.env.VITE_SHOPTICKETS_SCANNER_URL?.trim() ||
  "https://shoptickets.net/";

const tools = [
  {
    title: "Shopify Admin",
    description: "Manage merchandise, orders, inventory, and customers.",
    href: shopifyAdminUrl,
    icon: ShoppingBag,
  },
  {
    title: "ShopTickets Scanner",
    description:
      "Open the staff scanner for ticket validation and door check-in.",
    href: shopTicketsScannerUrl,
    icon: ScanLine,
  },
];

function CrewOperations() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 sm:py-20">
      {/* If this route ever displays operational data instead of outbound links,
          add real staff authentication and authorization before shipping it. */}
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome-dim hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div className="mt-12 border-b border-border pb-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Staff shortcuts
          </div>
          <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-7xl">
            Crew Operations
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-chrome-dim sm:text-base">
            Start here for store management and event check-in. Each tool opens
            its official staff workspace in a new tab.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.title}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group chrome-border bg-card p-6 transition-colors hover:border-primary sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center bg-gradient-brand text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ExternalLink className="h-4 w-4 text-chrome-dim transition-colors group-hover:text-primary" />
                </div>
                <h2 className="mt-8 font-display text-3xl tracking-wide">
                  {tool.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-chrome-dim">
                  {tool.description}
                </p>
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Scanner destination is configurable after ShopTickets provides the
          store-specific secure URL.
        </p>
      </div>
    </main>
  );
}
