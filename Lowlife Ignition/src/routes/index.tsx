import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Instagram,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Flame,
  ArrowRight,
  Plus,
} from "lucide-react";

import heroMeet from "@/assets/hero-meet.jpg";
import productTee from "@/assets/product-tee.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import productBanner from "@/assets/product-banner.jpg";
import productPlate from "@/assets/product-plate.jpg";
import productAnime from "@/assets/product-anime.jpg";
import productStickers from "@/assets/product-stickers.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import lowlifeLogo from "@/assets/lowlife-logo.png";

export const Route = createFileRoute("/")({
  component: LowlifeHome,
});

/* ---------- Data ---------- */

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tag?: "Limited Drop" | "Best Seller" | "New";
};

const PRODUCTS: Product[] = [
  {
    id: "tee",
    name: "Lowlife Tee",
    category: "Apparel",
    price: 30,
    image: productTee,
    tag: "Best Seller",
  },
  {
    id: "jersey",
    name: "Lowlife Fam Jersey",
    category: "Apparel",
    price: 45,
    image: productJersey,
    tag: "Limited Drop",
  },
  {
    id: "banner",
    name: "Windshield Banner",
    category: "Auto",
    price: 25,
    image: productBanner,
    tag: "New",
  },
  {
    id: "plate",
    name: "Chain Plate",
    category: "Accessory",
    price: 20,
    image: productPlate,
  },
  {
    id: "anime",
    name: "Anime Tee",
    category: "Apparel",
    price: 30,
    image: productAnime,
    tag: "Limited Drop",
  },
  {
    id: "stickers",
    name: "Sticker Pack",
    category: "Accessory",
    price: 15,
    image: productStickers,
    tag: "Best Seller",
  },
];

const EVENTS = [
  {
    id: "e1",
    name: "Lowlife Night Meet",
    date: { m: "APR", d: "12" },
    location: "Houston, TX",
    time: "9:00 PM — 1:00 AM",
    price: 15,
    desc: "The signature Lowlife takeover. Custom builds, vendor booths, and the loudest speakers in H-Town.",
  },
  {
    id: "e2",
    name: "Texas Car Culture Showcase",
    date: { m: "MAY", d: "03" },
    location: "Dallas, TX",
    time: "5:00 PM — 11:00 PM",
    price: 25,
    desc: "Statewide showcase — lowriders, JDM, euro, and everything between under one roof.",
  },
  {
    id: "e3",
    name: "Low & Clean Sunday",
    date: { m: "MAY", d: "18" },
    location: "San Antonio, TX",
    time: "2:00 PM — 8:00 PM",
    price: 10,
    desc: "Chill Sunday cruise-in. Slammed, stanced, and static builds welcome.",
  },
];

const RAFFLES = [
  {
    id: "r1",
    title: "Merch Bundle Raffle",
    prize: "$250 Lowlife Bundle",
    ends: "Ends Apr 30",
    tag: "Active",
  },
  {
    id: "r2",
    title: "Event Ticket Giveaway",
    prize: "2× Night Meet Passes",
    ends: "Ends Apr 10",
    tag: "Ending Soon",
  },
  {
    id: "r3",
    title: "Limited Banner Drop",
    prize: "Numbered 1/50 Banner",
    ends: "Ends May 05",
    tag: "Active",
  },
];

const GALLERY = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];

/* ---------- Page ---------- */

function LowlifeHome() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        scrolled={scrolled}
        cartCount={cartCount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <Hero />
      <StatsBar />
      <Products onAdd={addToCart} />
      <Events />
      <Raffles />
      <Gallery />
      <About />
      <SocialCTA />
      <Footer />
    </div>
  );
}

/* ---------- Sections ---------- */

function Navbar({
  scrolled,
  cartCount,
  menuOpen,
  setMenuOpen,
}: {
  scrolled: boolean;
  cartCount: number;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const links = [
    { href: "#shop", label: "Shop" },
    { href: "#events", label: "Events" },
    { href: "#gallery", label: "Gallery" },
    { href: "#about", label: "About" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img
            src={lowlifeLogo}
            alt="Lowlife Est. 15"
            className="h-9 w-auto shrink-0 invert brightness-0 contrast-100"
            style={{ filter: "invert(1) brightness(2)" }}
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Est. 15 • HTX
            </span>
          </span>
        </a>

        <nav className="hidden justify-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-chrome-dim transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            className="relative grid h-10 w-10 place-items-center rounded-sm border border-border bg-surface transition-colors hover:border-primary"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground red-glow">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-surface md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
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
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3 text-sm font-bold uppercase tracking-[0.2em] text-chrome-dim hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden pt-20"
    >
      <img
        src={heroMeet}
        alt="Lowlife Houston car meet at night"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.25),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Houston Born • Car Show Built • Est. 2015
          </div>
          <h1 className="font-serif text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-8xl md:text-9xl">
            Rep the <span className="italic text-primary">Life.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-chrome-dim sm:text-lg">
            Houston car show culture, limited merch drops, and events built for
            the lowlife community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="btn-red">
              <Flame className="h-4 w-4" /> Shop the Drop
            </a>
            <a href="#events" className="btn-ghost">
              Upcoming Events <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 border-y border-border bg-black/80 py-3 backdrop-blur">
        <div className="marquee-track font-display text-lg tracking-widest text-chrome">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-6 pr-6">
              {[
                "EST. 2015",
                "HOUSTON TX",
                "CAR SHOW CULTURE",
                "LOWLIFE",
                "LIMITED DROPS",
                "REP THE MOVEMENT",
              ].map((t) => (
                <span key={t} className="flex items-center gap-6">
                  <span>{t}</span>
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { k: "Est.", v: "2015" },
    { k: "Base", v: "Houston, TX" },
    { k: "Scene", v: "Car Shows" },
    { k: "Drops", v: "Limited" },
    { k: "Built", v: "Community" },
  ];
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-border sm:grid-cols-3 md:grid-cols-5 md:divide-x">
        {stats.map((s, i) => (
          <div
            key={s.v}
            className={`px-6 py-8 text-center ${i < stats.length - 1 ? "border-b border-border md:border-b-0" : ""}`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {s.k}
            </div>
            <div className="mt-2 font-display text-2xl tracking-wider text-chrome sm:text-3xl">
              {s.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14">
      <div className="flex items-center gap-3 text-primary">
        <div className="h-px w-8 bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="max-w-2xl font-serif text-4xl font-black leading-[0.95] sm:text-6xl">
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

function Products({ onAdd }: { onAdd: (id: string) => void }) {
  return (
    <section id="shop" className="border-b border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <SectionHeader
            eyebrow="Shop the Drop"
            title="Fresh from the garage."
            subtitle="Limited pieces built for the scene. When it's gone, it's gone."
          />
          <a
            href="#"
            className="hidden shrink-0 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-chrome-dim hover:text-primary sm:inline-flex sm:items-center sm:gap-2"
          >
            View Full Shop <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => onAdd(p.id)} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <a href="#" className="btn-ghost w-full">
            View Full Shop
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <div className="group relative overflow-hidden chrome-border">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        {product.tag && (
          <span
            className={`absolute left-3 top-3 rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur ${
              product.tag === "Limited Drop"
                ? "border-primary bg-primary/20 text-white"
                : "border-chrome/40 bg-black/60 text-chrome"
            }`}
          >
            {product.tag}
          </span>
        )}
        <button
          onClick={onAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-sm border border-chrome/30 bg-black/70 text-chrome opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:border-primary hover:bg-primary hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border bg-card p-4">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {product.category}
          </div>
          <div className="mt-1 truncate font-display text-lg tracking-wide">
            {product.name}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-xl text-chrome">
            ${product.price}
          </span>
          <button
            onClick={onAdd}
            className="grid h-9 w-9 place-items-center rounded-sm bg-primary text-primary-foreground transition-all hover:bg-red-700 hover:red-glow"
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Events() {
  return (
    <section
      id="events"
      className="relative border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Upcoming Events"
          title="Meet us in the streets."
          subtitle="Tickets, vendor passes, and limited event merch — all online. First come, first served."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EVENTS.map((e) => (
            <article
              key={e.id}
              className="group relative flex flex-col justify-between overflow-hidden chrome-border p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <span className="font-display text-xs tracking-widest">
                      {e.date.m}
                    </span>
                    <span className="font-display text-2xl leading-none">
                      {e.date.d}
                    </span>
                  </div>
                  <span className="rounded-sm border border-chrome/30 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-chrome">
                    ${e.price}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl tracking-wide">
                  {e.name}
                </h3>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {e.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {e.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Doors open
                    early
                  </div>
                </div>
                <p className="mt-4 text-sm text-chrome-dim">{e.desc}</p>
              </div>
              <button className="btn-red mt-6 w-full">
                <Ticket className="h-4 w-4" /> Buy Tickets
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Raffles() {
  return (
    <section className="relative overflow-hidden border-b border-border py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Community Raffles"
          title="Win the drop. Join the movement."
          subtitle="Enter merch raffles, event giveaways, and exclusive community drops directly from the Lowlife site."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RAFFLES.map((r) => (
            <div
              key={r.id}
              className="group relative overflow-hidden chrome-border p-6 transition-all hover:red-glow"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    r.tag === "Ending Soon"
                      ? "border-primary bg-primary/20 text-white"
                      : "border-chrome/30 text-chrome"
                  }`}
                >
                  {r.tag}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {r.ends}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-wide">
                {r.title}
              </h3>
              <div className="mt-2 text-sm text-chrome-dim">Prize</div>
              <div className="font-serif text-2xl italic text-chrome">
                {r.prize}
              </div>
              <button className="btn-ghost mt-6 w-full">Enter Raffle</button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a href="#" className="btn-red">
            View Active Raffles <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section
      id="gallery"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="The Culture" title="From the meets." />
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden ${
                i === 0 || i === 5
                  ? "row-span-2 aspect-square md:aspect-auto"
                  : "aspect-square"
              }`}
            >
              <img
                src={src}
                alt={`Lowlife meet ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 transition-all group-hover:bg-primary/20" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a href="#" className="btn-ghost">
            <Instagram className="h-4 w-4" /> Follow the Culture on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  const values = [
    { t: "Community First", d: "Built by and for the people in the scene." },
    { t: "Limited Drops", d: "Small runs, real numbers, no restocks." },
    {
      t: "Car Show Culture",
      d: "Every piece rooted in the meet, the build, the movement.",
    },
  ];
  return (
    <section
      id="about"
      className="relative border-b border-border py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <img
            src={gallery7}
            alt="Lowlife community"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute -bottom-6 -right-2 rounded-sm border border-primary bg-background px-4 py-3 text-center sm:-right-6">
            <div className="font-display text-4xl text-primary">10+</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-chrome-dim">
              Years Deep
            </div>
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="Our Story"
            title="Built in Houston. Repped everywhere."
          />
          <p className="text-base leading-relaxed text-chrome-dim">
            Lowlife Est. 15 started as more than a merch brand — it became a way
            to represent car show culture, custom builds, and the community
            behind them. From Houston meets to shows across Texas, every drop is
            built for the people who live the lifestyle, support the scene, and
            rep the movement.
          </p>

          <div className="mt-10 space-y-4">
            {values.map((v, i) => (
              <div
                key={v.t}
                className="flex items-start gap-4 border-l border-primary bg-surface p-5"
              >
                <span className="font-display text-2xl text-primary">
                  0{i + 1}
                </span>
                <div>
                  <div className="font-display text-lg tracking-wide">
                    {v.t}
                  </div>
                  <div className="text-sm text-muted-foreground">{v.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialCTA() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-black py-20 sm:py-28">
      <div className="absolute inset-0 opacity-40">
        <img
          src={gallery8}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            <div className="h-px w-8 bg-primary" /> Stay Connected
          </div>
          <h2 className="font-serif text-4xl font-black leading-[0.95] sm:text-6xl">
            Don't just watch the scene.{" "}
            <span className="italic text-primary">Be part of it.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base text-chrome-dim">
            Follow Lowlife Est. 15 for event announcements, new merch drops,
            raffles, and behind-the-scenes car show content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="btn-red">
              <Instagram className="h-4 w-4" /> Follow on Instagram
            </a>
            <a href="#" className="btn-ghost">
              Follow on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Shop", links: ["Apparel", "Auto", "Accessories", "All Drops"] },
    { title: "Community", links: ["Events", "Gallery", "Raffles", "Contact"] },
    { title: "Follow", links: ["Instagram", "TikTok", "YouTube", "Cart"] },
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
                className="h-10 w-auto shrink-0 invert brightness-0 contrast-100"
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
          <div className="grid grid-cols-3 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  {c.title}
                </div>
                <ul className="space-y-2 text-sm text-chrome-dim">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-white">
                        {l}
                      </a>
                    </li>
                  ))}
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
