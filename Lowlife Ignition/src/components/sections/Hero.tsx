import { useEffect, useState } from "react";
import { ArrowRight, Flame } from "lucide-react";
import lowlifeLogo from "@/assets/lowlife-logo.png";
import { useHeroSlides } from "@/lib/shopify/hooks";

const HERO_SLIDE_INTERVAL_MS = 6_000;

export function Hero() {
  const { data: heroSlides } = useHeroSlides();
  const [activeSlide, setActiveSlide] = useState(0);
  const visibleSlide = activeSlide % heroSlides.length;

  useEffect(() => {
    if (heroSlides.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const configureTimer = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (reducedMotion.matches) return;

      timer = window.setInterval(() => {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
      }, HERO_SLIDE_INTERVAL_MS);
    };

    configureTimer();
    reducedMotion.addEventListener("change", configureTimer);
    return () => {
      window.clearInterval(timer);
      reducedMotion.removeEventListener("change", configureTimer);
    };
  }, [heroSlides.length]);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden pt-20"
    >
      {heroSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image.url}
          alt={index === visibleSlide ? (slide.image.altText ?? "") : ""}
          aria-hidden={index !== visibleSlide}
          width={slide.image.width}
          height={slide.image.height}
          className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 motion-reduce:transition-none ${
            index === visibleSlide ? "opacity-70" : ""
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.2),rgba(109,40,217,0.12)_42%,transparent_72%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{" "}
            Houston Born • Car Show Built • Est. 2015
          </div>
          <img
            src={lowlifeLogo}
            alt="Lowlife Est. 15"
            width={1376}
            height={768}
            className="h-auto w-64 max-w-full sm:w-96 md:w-[30rem] lg:w-[34rem]"
            style={{ filter: "invert(1) brightness(2)" }}
          />
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
      {heroSlides.length > 1 && (
        <div className="absolute bottom-20 right-4 z-20 flex items-center gap-2 sm:bottom-24 sm:right-6">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show hero image ${index + 1}`}
              aria-current={index === visibleSlide ? "true" : undefined}
              className={`h-2 rounded-full border border-chrome/50 transition-[width,background-color] motion-reduce:transition-none ${
                index === visibleSlide
                  ? "w-7 bg-primary"
                  : "w-2 bg-black/50 hover:bg-chrome/70"
              }`}
            />
          ))}
        </div>
      )}
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
