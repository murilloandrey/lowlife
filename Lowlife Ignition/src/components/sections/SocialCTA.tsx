import { Instagram } from "lucide-react";
import gallery8 from "@/assets/gallery-8.jpg";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

export function SocialCTA() {
  return (
    <section
      id="social"
      className="relative overflow-hidden border-b border-border bg-black py-20 sm:py-28"
    >
      <div className="absolute inset-0 opacity-40">
        <img
          src={gallery8}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            <div className="h-px w-8 bg-gradient-brand" /> Stay Connected
          </div>
          <h2 className="font-heading text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
            Don't just watch the scene.{" "}
            <span className="text-gradient-brand italic">Be part of it.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base text-chrome-dim">
            Follow Lowlife Est. 15 for event announcements, new merch drops,
            raffles, and behind-the-scenes car show content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/lowlife_est15/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand"
            >
              <Instagram className="h-4 w-4" /> Follow on Instagram
            </a>
            {/* TODO(client-content): Confirm the real TikTok handle/URL. */}
            <a href="#social" className="btn-ghost">
              <TikTokIcon className="h-4 w-4" /> Follow on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
