import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { CartDrawer } from "@/components/sections/CartDrawer";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Toaster } from "@/components/ui/sonner";
import { useStorefrontCart } from "@/lib/shopify/cart";
import { useShopifyProductCatalog } from "@/lib/shopify/hooks";
import type { ShopifyProduct } from "@/lib/shopify-types";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Lowlife Est. 15" },
      {
        name: "description",
        content:
          "Browse the full Lowlife Est. 15 catalog — apparel, accessories, banners, and decals.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeType, setActiveType] = useState("All");

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useShopifyProductCatalog();

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

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const types = useMemo(() => {
    const distinct = new Set(products.map((product) => product.productType));
    return ["All", ...Array.from(distinct).sort()];
  }, [products]);

  const filteredProducts =
    activeType === "All"
      ? products
      : products.filter((product) => product.productType === activeType);

  const addToCart = async (product: ShopifyProduct, variantId?: string) => {
    try {
      await addProduct(product, variantId);
    } catch (error) {
      console.error("Could not add product to Shopify cart.", error);
      toast.error("Could not add that item.", {
        description: "Try again in a moment.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        scrolled
        cartCount={cartCount}
        onCartClick={openCart}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main className="pt-24 sm:pt-28">
        <section className="border-b border-border py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeader
              eyebrow="Full Catalog"
              title="Shop everything."
              subtitle="Every drop, every piece — apparel, accessories, and garage essentials."
            />

            <div className="mb-8 flex flex-wrap gap-2 sm:mb-10">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    activeType === type
                      ? "border-primary bg-gradient-brand text-white"
                      : "border-chrome/30 bg-transparent text-chrome-dim hover:border-chrome/60"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid place-items-center py-20 text-xs font-bold uppercase tracking-[0.24em] text-chrome-dim">
                Loading catalog…
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="chrome-border bg-card px-6 py-14 text-center sm:px-10 sm:py-20">
                <h3 className="font-heading text-2xl font-black uppercase sm:text-3xl">
                  Nothing in this category yet.
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-chrome-dim sm:text-base">
                  Try a different filter or check back for the next drop.
                </p>
              </div>
            )}

            {hasNextPage && (
              <div className="mt-10 flex justify-center sm:mt-14">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="btn-ghost"
                >
                  {isFetchingNextPage && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  Load More
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onShopNow={closeCart}
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
