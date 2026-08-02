import gallery11 from "@/assets/gallery-11.jpg";
import lowlifeLogo from "@/assets/lowlife-logo.png";
import { SectionHeader } from "./SectionHeader";

// TODO(client-content): Confirm how many owners/founders should be featured,
// then replace these placeholder names, photos, roles, and bios with approved
// client content before production.
const FOUNDERS = [
  {
    id: "founder-placeholder-1",
    name: "Founder name pending",
    role: "Owner / Founder",
    photo: {
      url: lowlifeLogo,
      altText: "Lowlife logo placeholder for founder portrait",
    },
    bio: "Founder bio and personal connection to the Lowlife community will be added after client approval.",
  },
  {
    id: "founder-placeholder-2",
    name: "Founder name pending",
    role: "Owner / Founder",
    photo: {
      url: lowlifeLogo,
      altText: "Lowlife logo placeholder for founder portrait",
    },
    bio: "Founder bio and personal connection to the Lowlife community will be added after client approval.",
  },
];

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
            <h3 className="mt-3 font-serif text-3xl font-black sm:text-4xl">
              Meet the people building Lowlife.
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {FOUNDERS.map((founder) => (
              <article
                key={founder.id}
                className="grid grid-cols-[6rem_1fr] gap-5 border border-border bg-surface p-4 sm:grid-cols-[8rem_1fr] sm:p-5"
              >
                <div className="grid aspect-square place-items-center overflow-hidden bg-black p-4">
                  <img
                    src={founder.photo.url}
                    alt={founder.photo.altText}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="self-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {founder.role}
                  </div>
                  <h4 className="mt-1 font-display text-xl tracking-wide text-chrome">
                    {founder.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {founder.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
