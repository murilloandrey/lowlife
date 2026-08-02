import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { About } from "@/components/sections/About";
import { CartDrawer } from "@/components/sections/CartDrawer";
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
  const {
    addProduct,
    updateQuantity,
    removeLine,
    lines,
    subtotal,
    cartCount,
    checkout,
    checkoutAvailable,
    isLive,
    isCartOpen,
    openCart,
    closeCart,
  } = useStorefrontCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goShopping = () => {
    closeCart();
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        scrolled={scrolled}
        cartCount={cartCount}
        onCartClick={openCart}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Shop onAdd={addProduct} />
        <Events onAdd={addProduct} isLive={isLive} />
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
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onShopNow={goShopping}
        lines={lines}
        subtotal={subtotal}
        isLive={isLive}
        checkoutAvailable={checkoutAvailable}
        onUpdateQuantity={updateQuantity}
        onRemove={removeLine}
        onCheckout={checkout}
      />
      <Toaster position="bottom-center" />
    </div>
  );
}
