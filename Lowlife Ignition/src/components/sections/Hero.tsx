import { ArrowRight, Flame } from "lucide-react";
import heroMeet from "@/assets/hero-meet.jpg";

export function Hero() {
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
      <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.2),rgba(109,40,217,0.12)_42%,transparent_72%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{" "}
            Houston Born • Car Show Built • Est. 2015
          </div>
          <h1 className="font-serif text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-8xl md:text-9xl">
            Rep the <span className="text-gradient-brand italic">Life.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-chrome-dim sm:text-lg">
            Houston car show culture, limited merch drops, and events built for
            the lowlife community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="btn-brand">
              <Flame className="h-4 w-4" /> Shop the Drop
            </a>
            <a href="#events" className="btn-ghost">
              Upcoming Events <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-y border-border bg-black/80 py-3 backdrop-blur">
        <div className="marquee-track font-display text-lg tracking-widest text-chrome">
          {Array.from({ length: 2 }).map((_, index) => (
            <span key={index} className="flex items-center gap-6 pr-6">
              {[
                "EST. 2015",
                "HOUSTON TX",
                "CAR SHOW CULTURE",
                "LOWLIFE",
                "LIMITED DROPS",
                "REP THE MOVEMENT",
              ].map((text) => (
                <span key={text} className="flex items-center gap-6">
                  <span>{text}</span>
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

export function StatsBar() {
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
        {stats.map((stat, index) => (
          <div
            key={stat.v}
            className={`px-4 py-7 text-center sm:px-6 sm:py-8 ${index < stats.length - 1 ? "border-b border-border md:border-b-0" : ""}`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {stat.k}
            </div>
            <div className="mt-2 font-display text-2xl tracking-wider text-chrome sm:text-3xl">
              {stat.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
