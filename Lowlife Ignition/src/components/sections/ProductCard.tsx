import { Plus } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify-types";

export function ProductCard({
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
