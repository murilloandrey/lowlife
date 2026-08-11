import { Instagram } from "lucide-react";
import lowlifeLogo from "@/assets/lowlife-logo.png";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export function Footer() {
  const columns = [
    {
      title: "Shop",
      links: ["Apparel", "Auto", "Accessories", "All Drops"].map((label) => ({
        label,
        href: "#top",
      })),
    },
    {
      title: "Community",
      links: ["Events", "Gallery", "Raffles", "Contact"].map((label) => ({
        label,
        href: "#top",
      })),
    },
    {
      title: "Follow",
      links: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/lowlife_est15/",
          icon: Instagram,
          external: true,
        },
        {
          label: "TikTok",
          href: "https://www.tiktok.com/@lowlife_est15",
          icon: TikTokIcon,
          external: true,
        },
        { label: "YouTube", href: "#top" },
        { label: "Cart", href: "#top" },
      ],
    },
  ];
  return (
    <footer className="bg-background py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={lowlifeLogo}
                alt="Lowlife Est. 15"
                className="h-10 w-auto shrink-0"
                style={{ filter: "invert(1) brightness(2)" }}
              />
              <div className="leading-none">
                <div className="font-display text-2xl tracking-widest text-chrome">
                  LOWLIFE
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Est. 2015 • Houston, TX
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm text-chrome-dim">
              Houston car show culture. Limited merch drops, events, and
              community — built by the people who live the life.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  {column.title}
                </div>
                <ul className="space-y-2 text-sm text-chrome-dim">
                  {column.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="inline-flex items-center gap-2 hover:text-white"
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© 2026 Lowlife Est. 15. All rights reserved.</div>
          <div className="font-display tracking-widest text-chrome-dim">
            REP THE LIFE.
          </div>
        </div>
      </div>
    </footer>
  );
}
