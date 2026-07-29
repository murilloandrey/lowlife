import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { About } from "@/components/sections/About";
import { Events } from "@/components/sections/Events";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Hero, StatsBar } from "@/components/sections/Hero";
import { MonthlyMag } from "@/components/sections/MonthlyMag";
import { Navbar } from "@/components/sections/Navbar";
import { NewsletterPopup } from "@/components/sections/NewsletterPopup";
import { OwnerSpotlight } from "@/components/sections/OwnerSpotlight";
import { Raffles } from "@/components/sections/Raffles";
import { Shop } from "@/components/sections/Shop";
import { SocialCTA } from "@/components/sections/SocialCTA";
import { VideoCarousel } from "@/components/sections/VideoCarousel";
import { useStorefrontCart } from "@/lib/shopify/cart";

export const Route = createFileRoute("/")({
  component: LowlifeHome,
});

function LowlifeHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { addProduct, cartCount, checkout } = useStorefrontCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        scrolled={scrolled}
        cartCount={cartCount}
        onCartClick={checkout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero />
        <StatsBar />
        <Shop onAdd={addProduct} />
        <Events />
        <Raffles />
        <MonthlyMag />
        <VideoCarousel />
        <Gallery />
        <OwnerSpotlight />
        <About />
        <SocialCTA />
      </main>
      <Footer />
      <NewsletterPopup />
      <Toaster position="bottom-center" />
    </div>
  );
}
