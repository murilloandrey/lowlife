import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { useShopifyArticles } from "@/lib/shopify/hooks";

export const Route = createFileRoute("/mag/$handle")({
  head: () => ({
    meta: [
      { title: "Monthly Mag — Lowlife Est. 15" },
      {
        name: "description",
        content: "Stories from the cars, builders, and culture behind Lowlife.",
      },
    ],
  }),
  component: MagArticle,
});

function articleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function MagArticle() {
  const { handle } = Route.useParams();
  const { data: articles, isFetching } = useShopifyArticles();
  const article = articles?.find((candidate) => candidate.handle === handle);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  if (!article && isFetching) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-chrome-dim">
          Loading story…
        </p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-center text-foreground">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Monthly Mag
          </div>
          <h1 className="mt-3 font-heading text-4xl font-black uppercase sm:text-6xl">
            Story not found.
          </h1>
          <Link
            to="/"
            hash="mag"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Monthly Mag
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <article>
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12">
            <Link
              to="/"
              hash="mag"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-chrome-dim hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Monthly Mag
            </Link>
          </div>

          <div className="relative mx-auto aspect-[4/3] max-w-7xl overflow-hidden border-y border-border sm:aspect-[16/8] lg:aspect-[2/1]">
            <img
              src={article.image.url}
              alt={article.image.altText ?? article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/10" />
          </div>

          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Monthly Mag
            </div>
            <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
              {article.title}
            </h1>
            <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {articleDate(article.publishedAt)} · By {article.author.name}
            </div>
            <p className="mt-8 border-l border-primary pl-5 text-lg font-bold leading-relaxed text-chrome sm:text-xl">
              {article.excerpt}
            </p>
            <div
              className="mt-10 space-y-6 text-base leading-relaxed text-chrome-dim sm:text-lg [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-black [&_h2]:uppercase [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-black [&_h3]:uppercase [&_img]:w-full [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
