import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Instagram } from "lucide-react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useClampedOverflow } from "@/hooks/use-clamped-overflow";
import { useShopifyArticles } from "@/lib/shopify/hooks";
import { ARTICLES } from "@/lib/mock-storefront-data";
import type { ShopifyArticle } from "@/lib/shopify-types";

function articleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function issueMonth(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();
}

function meaningfulArticleText(value?: string | null) {
  const text = (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return /[\p{L}\p{N}]/u.test(text) ? text : "";
}

function articleIntro(contentHtml?: string | null, fallback?: string | null) {
  return meaningfulArticleText(contentHtml) || meaningfulArticleText(fallback);
}

/**
 * `articleIntro` falls back to the article's whole contentHtml with the tags
 * stripped, so a real long-form post turns this pull-quote into thousands of
 * characters next to the headline. It stays clamped with no toggle of its own:
 * this is a teaser, and "Read the feature" is the section's single call to
 * action. A fade at the bottom edge signals the cut when it overflows.
 */
function FeaturedIntro({ intro }: { intro: string }) {
  const quoted = `“${intro}”`;
  const { measurementRef, isOverflowing } =
    useClampedOverflow<HTMLQuoteElement>(quoted);

  return (
    <div className="min-w-0 self-end border-l border-primary pl-5">
      <div className="relative min-w-0">
        <blockquote
          ref={measurementRef}
          className="line-clamp-5 font-serif text-xl font-bold italic leading-relaxed text-chrome sm:text-2xl"
        >
          {quoted}
        </blockquote>
        {isOverflowing && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent"
          />
        )}
      </div>
    </div>
  );
}

function instagramUrl(handle: string) {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

function FeaturePhoto({
  article,
  index,
}: {
  article: ShopifyArticle;
  index: number;
}) {
  const photo = article.images[index];

  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-border bg-black sm:aspect-[16/9] lg:aspect-[2/1]">
      <img
        src={photo.url}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.45]"
      />
      <img
        src={photo.url}
        alt={photo.altText ?? `${article.title} photo ${index + 1}`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
      <span className="absolute bottom-4 left-4 border border-white/30 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur sm:bottom-6 sm:left-6">
        {index === 0 ? "Cover feature" : "Feature photo"}
      </span>
    </div>
  );
}

function FeaturePhotos({ article }: { article: ShopifyArticle }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const syncActiveIndex = () =>
      setActiveIndex(carouselApi.selectedScrollSnap());
    syncActiveIndex();
    carouselApi.on("select", syncActiveIndex);
    carouselApi.on("reInit", syncActiveIndex);

    return () => {
      carouselApi.off("select", syncActiveIndex);
      carouselApi.off("reInit", syncActiveIndex);
    };
  }, [carouselApi]);

  if (article.images.length === 1) {
    return <FeaturePhoto article={article} index={0} />;
  }

  return (
    <Carousel
      aria-label={`${article.title} photos`}
      data-feature-photo-carousel
      opts={{ align: "start", loop: true }}
      setApi={setCarouselApi}
    >
      <CarouselContent className="ml-0">
        {article.images.map((photo, index) => (
          <CarouselItem
            key={`${photo.url}-${index}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className="pl-0"
          >
            <FeaturePhoto article={article} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 z-10 hidden h-11 w-11 rounded-none border-white/30 bg-black/65 text-white backdrop-blur hover:border-primary hover:bg-black/80 sm:inline-flex" />
      <CarouselNext className="right-3 z-10 hidden h-11 w-11 rounded-none border-white/30 bg-black/65 text-white backdrop-blur hover:border-primary hover:bg-black/80 sm:inline-flex" />
      <span className="absolute bottom-4 right-4 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur sm:bottom-6 sm:right-6">
        {activeIndex + 1} / {article.images.length}
      </span>
    </Carousel>
  );
}

function FeaturedArticle({ article }: { article: ShopifyArticle }) {
  const featuredIntro = articleIntro(article.contentHtml, article.excerpt);

  return (
    <article className="pt-8 sm:pt-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
          Feature of the month
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {articleDate(article.publishedAt)} · By {article.author.name}
          </span>
          {article.instagramHandle && (
            <a
              href={instagramUrl(article.instagramHandle)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-chrome transition-colors hover:text-primary"
            >
              <Instagram className="h-3.5 w-3.5 text-primary" />
              {article.instagramHandle}
            </a>
          )}
        </div>
      </div>

      {/* The native article image remains the cover/first slide. Optional
          custom.feature_photos entries follow it; a single image keeps the
          legacy static presentation with no carousel controls. */}
      <FeaturePhotos article={article} />

      <div className="grid min-w-0 gap-7 border-b border-border py-8 sm:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div className="min-w-0">
          <h3 className="max-w-5xl font-heading text-3xl font-black uppercase leading-[0.95] sm:text-6xl">
            {article.title}
          </h3>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-chrome-dim sm:text-lg">
            {article.excerpt}
          </p>
          <Link
            to="/mag/$handle"
            params={{ handle: article.handle }}
            className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-primary text-xs font-bold uppercase tracking-[0.2em] text-chrome transition-colors hover:text-primary"
          >
            Read the feature <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {featuredIntro && <FeaturedIntro intro={featuredIntro} />}
      </div>
    </article>
  );
}

export function MonthlyMag() {
  const { data } = useShopifyArticles();
  const articles = data?.length ? data : ARTICLES;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = activeIndex < articles.length ? activeIndex : 0;
  const activeArticle = articles[selectedIndex];
  const recentArticles = articles
    .map((article, index) => ({ article, issue: index + 1 }))
    .filter((_, index) => index !== selectedIndex)
    .slice(0, 3);

  useEffect(() => {
    if (!carouselApi) return;

    const syncActiveIndex = () =>
      setActiveIndex(carouselApi.selectedScrollSnap());
    syncActiveIndex();
    carouselApi.on("select", syncActiveIndex);
    carouselApi.on("reInit", syncActiveIndex);

    return () => {
      carouselApi.off("select", syncActiveIndex);
      carouselApi.off("reInit", syncActiveIndex);
    };
  }, [carouselApi]);

  return (
    <section
      id="mag"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-y border-border py-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-primary">
                Lowlife editorial
              </div>
              <h2 className="mt-1 font-heading text-4xl font-black uppercase leading-none sm:text-7xl lg:text-8xl">
                Feature of the month
              </h2>
            </div>
            <div className="shrink-0 text-left text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground sm:text-right">
              <div>Issue {String(selectedIndex + 1).padStart(2, "0")}</div>
              <div>{issueMonth(activeArticle.publishedAt)}</div>
            </div>
          </div>
        </div>

        <Carousel
          aria-label="Monthly Mag issues"
          opts={{
            align: "start",
            loop: articles.length > 1,
            watchDrag: (_, event) =>
              !(
                event.target instanceof Element &&
                event.target.closest("[data-feature-photo-carousel]")
              ),
          }}
          setApi={setCarouselApi}
          className={articles.length > 1 ? "sm:px-12" : undefined}
        >
          <CarouselContent>
            {articles.map((article, index) => (
              <CarouselItem
                key={article.handle}
                data-monthly-mag-issue
                aria-current={index === selectedIndex ? "true" : undefined}
              >
                <FeaturedArticle article={article} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {articles.length > 1 && (
            <>
              <CarouselPrevious className="left-0 hidden border-border bg-background/90 hover:border-primary hover:bg-background sm:inline-flex" />
              <CarouselNext className="right-0 hidden border-border bg-background/90 hover:border-primary hover:bg-background sm:inline-flex" />
            </>
          )}
        </Carousel>

        {recentArticles.length > 0 && (
          <div className="pt-10 sm:pt-14">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-heading text-3xl font-black uppercase sm:text-4xl">
                Inside this issue
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Recent stories
              </span>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {recentArticles.map(({ article, issue }) => (
                <article
                  key={article.handle}
                  className="group grid gap-5 py-5 sm:grid-cols-[3.5rem_10rem_1fr_auto] sm:items-center sm:py-6"
                >
                  <span className="hidden font-serif text-3xl font-black text-primary sm:block">
                    {String(issue).padStart(2, "0")}
                  </span>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image.url}
                      alt={article.image.altText ?? article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {articleDate(article.publishedAt)} · {article.author.name}
                    </div>
                    <h4 className="mt-2 font-heading text-2xl font-black uppercase leading-tight sm:text-3xl">
                      {article.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-sm text-chrome-dim">
                      {article.excerpt}
                    </p>
                  </div>
                  <Link
                    to="/mag/$handle"
                    params={{ handle: article.handle }}
                    aria-label={`Read ${article.title}`}
                    className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
                  >
                    Read <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
