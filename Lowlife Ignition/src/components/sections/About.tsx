import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import chrisTorresFounder from "@/assets/chris-torres-founder.png";
import gallery11 from "@/assets/gallery-11.jpg";
import { useClampedOverflow } from "@/hooks/use-clamped-overflow";
import { SectionHeader } from "./SectionHeader";

const FOUNDERS = [
  {
    id: "chris-torres",
    name: "Chris Torres",
    role: "Owner / Founder",
    photo: {
      url: chrisTorresFounder,
      altText: "Chris Torres, founder of Lowlife Est. 15",
    },
    teaser:
      "Chris Torres is the founder of LOWLIFE EST.15, a brand and community built around the belief that cars are more than machines—they're a reflection of the people who build them.",
    fullBio: [
      "What started as a passion for automotive culture has grown into a nationally recognized brand that celebrates creativity, individuality, and the dedication behind every build.",
      "Since launching LOWLIFE in 2015, Chris has worked tirelessly to create more than just apparel or events. He's built a movement that brings enthusiasts together through car shows, collaborations, exclusive merchandise, and features that shine a spotlight on builders from every corner of the scene. His goal has always been simple: give people a place where their passion is recognized and respected.",
      "Behind the scenes, Chris has worn every hat imaginable—designer, promoter, event organizer, marketer, and entrepreneur. Through countless long nights, financial risks, and years of persistence, he has continued to grow LOWLIFE while staying true to the culture that inspired it from day one.",
      "Today, LOWLIFE represents authenticity, quality, and community. Chris remains committed to pushing the brand forward, creating unforgettable experiences, supporting fellow enthusiasts, and proving that with enough determination, a passion can become a legacy.",
    ],
    quote:
      "\"It's never just about the cars—it's about the people, the journey, and the culture we build together.\"",
  },
];

function FounderCard({ founder }: { founder: (typeof FOUNDERS)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const bioId = `${founder.id}-full-bio`;
  const bioText = useMemo(
    () => [founder.teaser, ...founder.fullBio, founder.quote].join("\n\n"),
    [founder],
  );
  const { measurementRef, isOverflowing: bioOverflows } =
    useClampedOverflow<HTMLParagraphElement>(bioText);

  useEffect(() => {
    if (!bioOverflows) setExpanded(false);
  }, [bioOverflows]);

  const showFullBio = expanded || !bioOverflows;

  return (
    <article className="overflow-hidden border border-border bg-surface lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="relative aspect-square self-start overflow-hidden bg-black">
        <img
          src={founder.photo.url}
          alt={founder.photo.altText}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
      </div>
      <div className="self-center p-6 sm:p-10 lg:p-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
          {founder.role}
        </div>
        <h4 className="mt-2 font-display text-4xl tracking-wide text-chrome sm:text-5xl">
          {founder.name}
        </h4>
        <div className="relative mt-5">
          {showFullBio ? (
            <div id={bioId} className="space-y-4">
              <p className="text-sm leading-relaxed text-chrome-dim sm:text-base">
                {founder.teaser}
              </p>
              {founder.fullBio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-chrome-dim sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
              <blockquote className="border-l border-primary pl-5 font-serif text-lg font-bold italic leading-relaxed text-chrome sm:text-xl">
                {founder.quote}
              </blockquote>
            </div>
          ) : (
            <p
              id={bioId}
              className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-chrome-dim sm:text-base"
            >
              {bioText}
            </p>
          )}
          <p
            ref={measurementRef}
            aria-hidden="true"
            className="invisible absolute inset-x-0 top-0 line-clamp-3 whitespace-pre-line text-sm leading-relaxed sm:text-base"
          >
            {bioText}
          </p>
        </div>

        {bioOverflows && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-controls={bioId}
            className="mt-6 inline-flex min-h-11 items-center gap-2 border border-border px-4 text-xs font-bold uppercase tracking-[0.18em] text-chrome transition-colors hover:border-primary hover:text-primary"
          >
            {expanded ? "Read less" : "Read more"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </article>
  );
}

export function About() {
  const values = [
    {
      title: "Community First",
      description: "Built by and for the people in the scene.",
    },
    {
      title: "Limited Drops",
      description: "Small runs, real numbers, no restocks.",
    },
    {
      title: "Car Show Culture",
      description: "Every piece rooted in the meet, the build, the movement.",
    },
  ];
  return (
    <section
      id="about"
      className="relative border-b border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <img
              src={gallery11}
              alt="Lowlife community gathering with modified cars at a raceway"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 -right-2 rounded-sm border border-primary bg-background px-4 py-3 text-center sm:-right-6">
              <div className="text-gradient-brand font-display text-4xl">
                10+
              </div>
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
              Lowlife Est. 15 started as more than a merch brand — it became a
              way to represent car show culture, custom builds, and the
              community behind them. From Houston meets to shows across Texas,
              every drop is built for the people who live the lifestyle, support
              the scene, and rep the movement.
            </p>
            <div className="mt-10 space-y-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="flex items-start gap-4 border-l border-primary bg-surface p-5"
                >
                  <span className="font-display text-2xl text-primary">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="font-display text-lg tracking-wide">
                      {value.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {value.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16">
          <div className="mb-8 max-w-2xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              Behind the movement
            </div>
            <h3 className="mt-3 font-heading text-3xl font-black uppercase sm:text-4xl">
              Meet the founder behind Lowlife.
            </h3>
          </div>
          <div className="mx-auto max-w-5xl">
            {FOUNDERS.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
