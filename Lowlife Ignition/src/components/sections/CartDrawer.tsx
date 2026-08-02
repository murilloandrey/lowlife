import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney, type DisplayCartLine } from "@/lib/shopify/cart";
import type { ShopifyMoney } from "@/lib/shopify-types";

export function CartDrawer({
  isOpen,
  onClose,
  onShopNow,
  lines,
  subtotal,
  isLive,
  checkoutAvailable,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onShopNow: () => void;
  lines: DisplayCartLine[];
  subtotal: ShopifyMoney | null;
  isLive: boolean;
  checkoutAvailable: boolean;
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<void> | void;
  onRemove: (lineId: string) => Promise<void> | void;
  onCheckout: () => void;
}) {
  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    try {
      await onUpdateQuantity(lineId, quantity);
    } catch (error) {
      console.error("Could not update cart quantity.", error);
      toast.error("Could not update quantity.", {
        description: "Try again in a moment.",
      });
    }
  };

  const handleRemove = async (lineId: string) => {
    try {
      await onRemove(lineId);
    } catch (error) {
      console.error("Could not remove cart item.", error);
      toast.error("Could not remove that item.", {
        description: "Try again in a moment.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <div className="h-1.5 shrink-0 bg-gradient-brand" />
        <SheetHeader className="shrink-0 border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-2xl font-black uppercase tracking-wide text-foreground">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <button onClick={onShopNow} className="btn-ghost">
              Keep Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="flex gap-4 border-b border-border pb-4"
                >
                  <div className="h-20 w-16 shrink-0 overflow-hidden bg-surface-2">
                    {line.image && (
                      <img
                        src={line.image.url}
                        alt={line.image.altText ?? line.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-display text-base tracking-wide">
                        {line.title}
                      </p>
                      <button
                        onClick={() => void handleRemove(line.id)}
                        aria-label={`Remove ${line.title} from cart`}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            void handleUpdateQuantity(
                              line.id,
                              line.quantity - 1,
                            )
                          }
                          aria-label={`Decrease quantity of ${line.title}`}
                          className="grid h-7 w-7 place-items-center rounded-sm border border-chrome/30 text-chrome transition-colors hover:border-primary hover:text-primary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() =>
                            void handleUpdateQuantity(
                              line.id,
                              line.quantity + 1,
                            )
                          }
                          aria-label={`Increase quantity of ${line.title}`}
                          className="grid h-7 w-7 place-items-center rounded-sm border border-chrome/30 text-chrome transition-colors hover:border-primary hover:text-primary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display text-lg text-chrome">
                        {formatMoney(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-display text-xl normal-case tracking-normal text-chrome">
                  {subtotal ? formatMoney(subtotal) : "—"}
                </span>
              </div>
              <button
                onClick={onCheckout}
                disabled={!checkoutAvailable}
                className="btn-brand mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout
              </button>
              {!isLive && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Checkout connects once the Shopify store goes live.
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
