import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ChevronDown, Instagram } from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import { useClampedOverflow } from "@/hooks/use-clamped-overflow";
import { useShopifyArticles } from "@/lib/shopify/hooks";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/mag/$handle")({
  head: ({ params }) => ({
    links: [
      {
        rel: "canonical",
        href: canonicalUrl(`/mag/${encodeURIComponent(params.handle)}`),
      },
    ],
    meta: [
      { title: "Monthly Mag — Lowlife Est. 15" },
      {
        name: "description",
        content: "Stories from the cars, builders, and culture behind Lowlife.",
      },
      {
        property: "og:url",
        content: canonicalUrl(`/mag/${encodeURIComponent(params.handle)}`),
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

/**
 * The Excerpt field is meant to hold a short pull-quote, but a full long-form
 * story pasted into it would otherwise dominate the page before the Content
 * section starts. Short excerpts never overflow, so they render exactly as
 * before with no toggle.
 */
function ArticleExcerpt({ excerpt }: { excerpt: string }) {
  const [expanded, setExpanded] = useState(false);
  const { measurementRef, isOverflowing } =
    useClampedOverflow<HTMLParagraphElement>(excerpt);
  const excerptId = "mag-article-excerpt";

  useEffect(() => {
    if (!isOverflowing) setExpanded(false);
  }, [isOverflowing]);

  return (
    <div className="mt-8 border-l border-primary pl-5">
      <div className="relative">
        <p
          id={excerptId}
          className={`text-lg font-bold leading-relaxed text-chrome sm:text-xl ${
            isOverflowing && !expanded ? "line-clamp-4" : ""
          }`}
        >
          {excerpt}
        </p>
        <p
          ref={measurementRef}
          aria-hidden="true"
          className="invisible absolute inset-x-0 top-0 line-clamp-4 text-lg font-bold leading-relaxed sm:text-xl"
        >
          {excerpt}
        </p>
      </div>
      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-controls={excerptId}
          className="mt-4 inline-flex min-h-11 items-center gap-2 border border-border px-4 text-xs font-bold uppercase tracking-[0.18em] text-chrome transition-colors hover:border-primary hover:text-primary"
        >
          {expanded ? "Read less" : "Read more"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
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

          {/* Hero photos arrive in any orientation. A blurred object-cover copy
              fills the banner while the real photo sits on top with
              object-contain, so portrait uploads are letterboxed rather than
              cropped down to a sliver. */}
          <div className="relative mx-auto aspect-[4/3] max-w-7xl overflow-hidden border-y border-border bg-black sm:aspect-[16/8] lg:aspect-[2/1]">
            <img
              src={article.image.url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[0.45]"
            />
            <img
              src={article.image.url}
              alt={article.image.altText ?? article.title}
              className="absolute inset-0 h-full w-full object-contain"
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
            {article.instagramHandle && (
              <a
                href={`https://instagram.com/${article.instagramHandle.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold tracking-[0.12em] text-chrome transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4 text-primary" />
                {article.instagramHandle}
              </a>
            )}
            {article.excerpt && <ArticleExcerpt excerpt={article.excerpt} />}
            <div
              className="mt-10 space-y-6 text-base leading-relaxed text-chrome-dim sm:text-lg [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-black [&_h2]:uppercase [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-black [&_h3]:uppercase [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:border-0 [&_img]:w-full [&_p]:leading-relaxed [&_video]:aspect-video [&_video]:h-auto [&_video]:w-full [&_video]:bg-black [&_video]:object-contain"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
