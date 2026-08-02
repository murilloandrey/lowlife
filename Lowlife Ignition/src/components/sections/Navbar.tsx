import { useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import lowlifeLogo from "@/assets/lowlife-logo.png";

const links = [
  { href: "#about", label: "About" },
  { href: "#shop", label: "Shop" },
  { href: "#events", label: "Events" },
  { href: "#mag", label: "Monthly Mag" },
  { href: "#gallery", label: "Gallery" },
  { href: "#owner-spotlight", label: "Spotlight" },
];

export function Navbar({
  scrolled,
  cartCount,
  onCartClick,
  menuOpen,
  setMenuOpen,
}: {
  scrolled: boolean;
  cartCount: number;
  onCartClick: () => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) {
  const location = useLocation({
    select: ({ pathname, hash }) => ({ pathname, hash }),
  });

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.replace(/^#/, "");
    const keepTargetInView = () =>
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    const timers = [250, 1_000, 2_000].map((delay) =>
      window.setTimeout(keepTargetInView, delay),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [location.hash, location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/95 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={lowlifeLogo}
            alt="Lowlife Est. 15"
            className="h-9 w-auto shrink-0"
            style={{ filter: "invert(1) brightness(2)" }}
          />
          <span className="hidden font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:block">
            Est. 15 • HTX
          </span>
        </Link>
        <nav className="hidden justify-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to="/"
              hash={link.href.slice(1)}
              hashScrollIntoView={{ behavior: "smooth" }}
              className="text-xs font-bold uppercase tracking-[0.18em] text-chrome-dim transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <button
            onClick={onCartClick}
            className="relative grid h-10 w-10 place-items-center rounded-sm border border-border bg-surface transition-colors hover:border-primary"
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="brand-glow absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-surface md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to="/"
                hash={link.href.slice(1)}
                hashScrollIntoView={{ behavior: "smooth" }}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3 text-sm font-bold uppercase tracking-[0.2em] text-chrome-dim hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
