import gallery11 from "@/assets/gallery-11.jpg";
import { SectionHeader } from "./SectionHeader";

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
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <img
            src={gallery11}
            alt="Lowlife community gathering with modified cars at a raceway"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute -bottom-6 -right-2 rounded-sm border border-primary bg-background px-4 py-3 text-center sm:-right-6">
            <div className="text-gradient-brand font-display text-4xl">10+</div>
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
    </section>
  );
}
