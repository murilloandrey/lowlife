import { ArrowRight } from "lucide-react";
import { RAFFLES } from "@/lib/mock-storefront-data";
import { SectionHeader } from "./SectionHeader";

export function Raffles() {
  return (
    <section className="relative overflow-hidden border-b border-border py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.12),rgba(109,40,217,0.08)_38%,transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Community Raffles"
          title="Win the drop. Join the movement."
          subtitle="Enter merch raffles, event giveaways, and exclusive community drops directly from the Lowlife site."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RAFFLES.map((raffle) => (
            <article
              key={raffle.id}
              className="group relative overflow-hidden chrome-border p-6 transition-all hover:brand-glow"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${raffle.tag === "Ending Soon" ? "border-primary bg-primary/20 text-white" : "border-chrome/30 text-chrome"}`}
                >
                  {raffle.tag}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {raffle.ends}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-wide">
                {raffle.title}
              </h3>
              <div className="mt-2 text-sm text-chrome-dim">Prize</div>
              <div className="font-serif text-2xl italic text-chrome">
                {raffle.prize}
              </div>
              <button type="button" className="btn-ghost mt-6 w-full">
                Enter Raffle
              </button>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a href="#events" className="btn-brand">
            View Active Raffles <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
