import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/lib/shopify/hooks";
import { PRODUCTS } from "@/lib/mock-storefront-data";
import type { ShopifyProduct } from "@/lib/shopify-types";
import { SectionHeader } from "./SectionHeader";

export function Shop({
  onAdd,
}: {
  onAdd: (product: ShopifyProduct) => Promise<unknown>;
}) {
  const { data } = useShopifyProducts();
  const products = data ?? PRODUCTS;

  const addProduct = async (product: ShopifyProduct) => {
    try {
      await onAdd(product);
      toast.success(`${product.title} added to cart.`);
    } catch (error) {
      console.error("Could not add product to Shopify cart.", error);
      toast.error("Could not add that item.", {
        description: "Try again in a moment.",
      });
    }
  };

  return (
    <section id="shop" className="border-b border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div>
          <SectionHeader
            eyebrow="Shop the Drop"
            title="Fresh from the garage."
            subtitle="Limited pieces built for the scene. When it's gone, it's gone."
          />
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => void addProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="chrome-border bg-card px-6 py-14 text-center sm:px-10 sm:py-20">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Next drop loading
            </div>
            <h3 className="mt-3 font-heading text-3xl font-black uppercase sm:text-4xl">
              Drops coming soon.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-chrome-dim sm:text-base">
              The garage is between releases. Check back soon for the next
              limited Lowlife drop.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: ShopifyProduct;
  onAdd: () => void;
}) {
  const tag = product.tags[0];
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(product.price.amount));
  return (
    <article className="group relative overflow-hidden chrome-border">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <img
          src={product.images[0].url}
          alt={product.images[0].altText ?? product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        {tag && (
          <span
            className={`absolute left-3 top-3 rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur ${tag === "Limited Drop" ? "border-primary bg-gradient-brand text-white" : "border-chrome/40 bg-black/60 text-chrome"}`}
          >
            {tag}
          </span>
        )}
        <button
          onClick={onAdd}
          aria-label={`Add ${product.title} to cart`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-sm border border-chrome/30 bg-black/70 text-chrome opacity-100 backdrop-blur transition-all hover:border-primary hover:bg-primary hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border bg-card p-4">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {product.productType}
          </div>
          <div className="mt-1 truncate font-display text-lg tracking-wide">
            {product.title}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-xl text-chrome">{price}</span>
          <button
            onClick={onAdd}
            className="grid h-9 w-9 place-items-center rounded-sm bg-gradient-brand text-white transition-all hover:brand-glow hover:saturate-125"
            aria-label={`Add ${product.title} to cart`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
