import { ArrowRight, CalendarDays } from "lucide-react";
import { useShopifyArticles } from "@/lib/shopify/hooks";
import { ARTICLES } from "@/lib/mock-storefront-data";

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

function articleIntro(contentHtml: string, fallback: string) {
  const text = contentHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || fallback;
}

export function MonthlyMag() {
  const { data } = useShopifyArticles();
  const articles = data ?? ARTICLES;
  const [featured, ...recent] = articles;
  const recentArticles = recent.slice(0, 3);

  return (
    <section
      id="mag"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-y border-border py-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-primary">
                Lowlife editorial
              </div>
              <h2 className="mt-1 font-heading text-5xl font-black leading-none sm:text-7xl lg:text-8xl">
                Monthly Mag
              </h2>
            </div>
            <div className="shrink-0 text-right text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
              <div>Issue 01</div>
              <div>{issueMonth(featured.publishedAt)}</div>
            </div>
          </div>
        </div>

        <article id={`article-${featured.handle}`} className="pt-8 sm:pt-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              This month's ride
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {articleDate(featured.publishedAt)} · By {featured.author.name}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-border sm:aspect-[16/9] lg:aspect-[2/1]">
            <img
              src={featured.image.url}
              alt={featured.image.altText ?? featured.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <span className="absolute bottom-4 left-4 border border-white/30 bg-black/65 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur sm:bottom-6 sm:left-6">
              Cover feature
            </span>
          </div>

          <div className="grid gap-7 border-b border-border py-8 sm:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
            <div>
              <h3 className="max-w-5xl font-heading text-4xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
                {featured.title}
              </h3>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-chrome-dim sm:text-lg">
                {featured.excerpt}
              </p>
              <a
                href={`#article-${featured.handle}`}
                className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-primary text-xs font-bold uppercase tracking-[0.2em] text-chrome transition-colors hover:text-primary"
              >
                Read the feature <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <blockquote className="self-end border-l border-primary pl-5 font-serif text-xl font-bold italic leading-relaxed text-chrome sm:text-2xl">
              “{articleIntro(featured.contentHtml, featured.excerpt)}”
            </blockquote>
          </div>
        </article>

        {recentArticles.length > 0 && (
          <div className="pt-10 sm:pt-14">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-heading text-3xl font-black sm:text-4xl">
                Inside this issue
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Recent stories
              </span>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {recentArticles.map((article, index) => (
                <article
                  id={`article-${article.handle}`}
                  key={article.handle}
                  className="group grid gap-5 py-5 sm:grid-cols-[3.5rem_10rem_1fr_auto] sm:items-center sm:py-6"
                >
                  <span className="hidden font-serif text-3xl font-black text-primary sm:block">
                    {String(index + 2).padStart(2, "0")}
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
                    <h4 className="mt-2 font-heading text-2xl font-black leading-tight sm:text-3xl">
                      {article.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-sm text-chrome-dim">
                      {article.excerpt}
                    </p>
                  </div>
                  <a
                    href={`#article-${article.handle}`}
                    aria-label={`Read ${article.title}`}
                    className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
                  >
                    Read <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
