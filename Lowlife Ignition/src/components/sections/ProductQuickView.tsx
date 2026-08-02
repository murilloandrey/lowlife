import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  defaultSelections,
  resolveVariant,
  selectableProductOptions,
} from "@/lib/shopify/variants";

export function ProductQuickView({
  product,
  open,
  onOpenChange,
  onAdd,
}: {
  product: ShopifyProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: ShopifyProduct, variantId?: string) => Promise<unknown>;
}) {
  const options = useMemo(
    () => selectableProductOptions(product.options),
    [product],
  );
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    defaultSelections(product),
  );
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (open) {
      setSelections(defaultSelections(product));
      setIsAdding(false);
    }
  }, [open, product]);

  const selectedVariant = useMemo(
    () => resolveVariant(product, selections),
    [product, selections],
  );

  const price = selectedVariant?.price ?? product.price;
  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(price.amount));

  const outOfStock =
    Boolean(selectedVariant) && !selectedVariant?.availableForSale;
  const canAdd = Boolean(selectedVariant?.availableForSale) && !isAdding;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await onAdd(product, selectedVariant.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Could not add product to cart.", error);
      toast.error("Could not add that item.", {
        description: "Try again in a moment.",
      });
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-2xl gap-0 overflow-y-auto border-border bg-card p-0 [&>button]:z-20 [&>button]:grid [&>button]:h-9 [&>button]:w-9 [&>button]:place-items-center [&>button]:rounded-sm [&>button]:border [&>button]:border-chrome/30 [&>button]:bg-black/70 [&>button]:text-white [&>button]:opacity-100">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>Quick view for {product.title}</DialogDescription>
        </DialogHeader>

        <Carousel className="bg-black" opts={{ align: "start" }}>
          <CarouselContent className="ml-0">
            {product.images.map((image, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="aspect-square bg-surface-2">
                  <img
                    src={image.url}
                    alt={image.altText ?? product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 border-border bg-card hover:border-primary" />
              <CarouselNext className="right-2 border-border bg-card hover:border-primary" />
            </>
          )}
        </Carousel>

        <div className="space-y-5 px-6 pb-6 pt-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {product.productType}
            </div>
            <div className="mt-1 flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl tracking-wide">
                {product.title}
              </h2>
              <span className="shrink-0 font-display text-xl text-chrome">
                {displayPrice}
              </span>
            </div>
          </div>

          {options.map((option) => (
            <div key={option.name}>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {option.name}
                {selections[option.name] ? `: ${selections[option.name]}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selections[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelections((current) => ({
                          ...current,
                          [option.name]: value,
                        }))
                      }
                      className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        active
                          ? "border-primary bg-gradient-brand text-white"
                          : "border-chrome/30 bg-transparent text-chrome-dim hover:border-chrome/60"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {outOfStock && (
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Out of stock in this selection
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={!canAdd}
            className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {outOfStock ? "Out of Stock" : isAdding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
