import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
  const { addProduct, cartCount, checkout, checkoutAvailable, isLive } =
    useStorefrontCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openShop = () => {
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCartClick = () => {
    if (checkoutAvailable) {
      checkout();
      return;
    }

    if (cartCount === 0) {
      toast.info("Your cart is empty.", {
        description: "Pick something from the latest Lowlife drop.",
        action: { label: "Shop", onClick: openShop },
      });
      return;
    }

    if (!isLive) {
      toast.info("Checkout is not live yet.", {
        description: `${cartCount} ${cartCount === 1 ? "item is" : "items are"} in your preview cart. Shopify checkout activates when the store is connected.`,
        action: { label: "Keep shopping", onClick: openShop },
      });
      return;
    }

    toast.info("Your cart is getting ready.", {
      description: "Try checkout again in a moment.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        scrolled={scrolled}
        cartCount={cartCount}
        onCartClick={handleCartClick}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Shop onAdd={addProduct} />
        <Events />
        {/* Raffles are paused for now. Keep the section component/data available
            so it can be restored when the client is ready to run them. */}
        <MonthlyMag />
        <VideoCarousel />
        <Gallery />
        <OwnerSpotlight />
        <SocialCTA />
      </main>
      <Footer />
      <NewsletterPopup />
      <Toaster position="bottom-center" />
    </div>
  );
}
