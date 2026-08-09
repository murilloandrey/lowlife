import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useShopifyProducts } from "@/lib/shopify/hooks";
import {
  groupProductsByType,
  partitionProductsByType,
} from "@/lib/shopify/products";
import { PRODUCTS } from "@/lib/mock-storefront-data";
import type { ShopifyProduct } from "@/lib/shopify-types";
import { SectionHeader } from "./SectionHeader";
import { ProductCategoryGrid } from "./ProductCategoryGrid";

const HOMEPAGE_PRODUCT_LIMIT = 6;

export function Shop({
  onAdd,
}: {
  onAdd: (product: ShopifyProduct, variantId?: string) => Promise<unknown>;
}) {
  const { data } = useShopifyProducts();
  const allProducts: ShopifyProduct[] = data ?? PRODUCTS;
  // Cap the teaser first, then split what's left into labelled category groups
  // so the grouping is actually visible instead of only implied by sort order.
  const productGroups = useMemo(
    () =>
      partitionProductsByType(
        groupProductsByType(allProducts).slice(0, HOMEPAGE_PRODUCT_LIMIT),
      ),
    [allProducts],
  );
  const productCount = productGroups.reduce(
    (total, group) => total + group.products.length,
    0,
  );

  const addProduct = async (product: ShopifyProduct, variantId?: string) => {
    try {
      await onAdd(product, variantId);
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
            subtitle="Premium apparel and accessories inspired by the automotive lifestyle."
          />
        </div>
        {productCount > 0 ? (
          <>
            <ProductCategoryGrid groups={productGroups} onAdd={addProduct} />
            <div className="mt-10 flex justify-center sm:mt-14">
              <Link to="/shop" className="btn-brand">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
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
