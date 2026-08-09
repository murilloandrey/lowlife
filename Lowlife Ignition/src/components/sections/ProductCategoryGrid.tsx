import type { ProductGroup } from "@/lib/shopify/products";
import type { ShopifyProduct } from "@/lib/shopify-types";
import { ProductCard } from "./ProductCard";

/**
 * Renders one labelled grid per category so a new category always starts a
 * fresh row. Sorting alone leaves categories sharing a row whenever a group's
 * size isn't a multiple of the column count, which reads as ungrouped.
 */
export function ProductCategoryGrid({
  groups,
  onAdd,
}: {
  groups: ProductGroup<ShopifyProduct>[];
  onAdd: (product: ShopifyProduct, variantId?: string) => Promise<unknown>;
}) {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {groups.map((group) => (
        <section key={group.type} aria-label={group.type}>
          <div className="mb-4 flex items-center gap-3 text-primary sm:mb-5">
            <div className="h-px w-8 bg-gradient-brand" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">
              {group.type}
            </h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
