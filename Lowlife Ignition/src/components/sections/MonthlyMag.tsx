import { ArrowRight, CalendarDays } from "lucide-react";
import { useShopifyArticles } from "@/lib/shopify/hooks";
import { ARTICLES } from "@/lib/mock-storefront-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";

function articleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function MonthlyMag() {
  const { data } = useShopifyArticles();
  const articles = data ?? ARTICLES;
  const [featured, ...recent] = articles;
  return (
    <section
      id="mag"
      className="border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Monthly Mag"
          title="Built stories. Real rides."
          subtitle="Garage profiles, meet recaps, and the people pushing car culture forward."
        />
        <Card className="group grid overflow-hidden rounded-none border-border bg-card lg:grid-cols-[1.25fr_1fr]">
          <div className="relative min-h-72 overflow-hidden lg:min-h-[31rem]">
            <img
              src={featured.image.url}
              alt={featured.image.altText ?? featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-card/30" />
          </div>
          <CardContent className="flex flex-col justify-center p-6 sm:p-10">
            <Badge className="mb-5 w-fit rounded-sm border-0 bg-gradient-brand uppercase tracking-[0.18em]">
              Cover story
            </Badge>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />{" "}
              {articleDate(featured.publishedAt)} · {featured.author.name}
            </div>
            <h3 className="mt-4 font-serif text-3xl font-black leading-tight sm:text-5xl">
              {featured.title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-chrome-dim sm:text-base">
              {featured.excerpt}
            </p>
            <a
              href={`#article-${featured.handle}`}
              className="btn-brand mt-7 w-fit"
            >
              Read the Full Story <ArrowRight className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {recent.map((article) => (
            <Card
              key={article.handle}
              className="overflow-hidden rounded-none border-border bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.image.url}
                  alt={article.image.altText ?? article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {articleDate(article.publishedAt)}
                </div>
                <h3 className="mt-2 font-display text-2xl tracking-wide">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-chrome-dim">
                  {article.excerpt}
                </p>
                <a
                  href={`#article-${article.handle}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-chrome hover:text-primary"
                >
                  Read story <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
