import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { useShopifyEvents } from "@/lib/shopify/hooks";
import type {
  EventTicket,
  ShopifyProduct,
  ShopifyTicketProduct,
} from "@/lib/shopify-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader } from "./SectionHeader";

const TICKETS_ENABLED = false;

function dateParts(iso: string) {
  const date = new Date(iso);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
  };
}

function QrPlaceholder() {
  const cells = Array.from({ length: 17 * 17 }, (_, index) => {
    const x = index % 17;
    const y = Math.floor(index / 17);
    const finder = (ox: number, oy: number) =>
      x >= ox &&
      x < ox + 5 &&
      y >= oy &&
      y < oy + 5 &&
      (x === ox ||
        x === ox + 4 ||
        y === oy ||
        y === oy + 4 ||
        (x >= ox + 2 && x <= ox + 2 && y >= oy + 2 && y <= oy + 2));
    return (
      finder(0, 0) ||
      finder(12, 0) ||
      finder(0, 12) ||
      ((x * 7 + y * 11 + x * y) % 5 < 2 &&
        !((x < 6 && y < 6) || (x > 10 && y < 6) || (x < 6 && y > 10)))
    );
  });
  return (
    <svg
      viewBox="0 0 17 17"
      role="img"
      aria-label="Placeholder ticket QR code"
      className="h-52 w-52 bg-white p-3"
    >
      {cells.map((filled, index) =>
        filled ? (
          <rect
            key={index}
            x={index % 17}
            y={Math.floor(index / 17)}
            width="1"
            height="1"
            fill="#050505"
          />
        ) : null,
      )}
    </svg>
  );
}

export function Events({
  onAdd,
  isLive,
}: {
  onAdd: (product: ShopifyProduct) => Promise<string | null>;
  isLive: boolean;
}) {
  const { data: events = [] } = useShopifyEvents();
  const [ticket, setTicket] = useState<EventTicket | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const selectTicket = async (event: ShopifyTicketProduct) => {
    if (isLive) {
      setPurchasingId(event.id);
      try {
        const checkoutUrl = await onAdd(event);
        if (!checkoutUrl) {
          throw new Error("Shopify did not return a checkout URL.");
        }
        window.location.assign(checkoutUrl);
      } catch (error) {
        console.error("Could not start ShopTickets checkout.", error);
        toast.error("Could not start ticket checkout.", {
          description: "Try again in a moment.",
        });
        setPurchasingId(null);
      }
      return;
    }

    setTicket({
      ticketId: `LL-${event.handle.toUpperCase()}-DEMO`,
      eventName: event.title,
      ticketType: event.ticketType,
      qrCodeUrl: `https://example.com/tickets/${event.handle}`,
    });
  };
  return (
    <section
      id="events"
      className="relative border-b border-border bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Upcoming Events"
          title="Meet us in the streets."
          subtitle="See where LOWLIFE is pulling up next. Catch us at these upcoming events, shop the latest drops, and come kick it with us in person."
        />
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {events.map((event) => {
            const date = dateParts(event.startsAt);
            const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
            const purchasing = purchasingId === event.id;
            const isAttendanceOnly = Number(event.price.amount) === 0;
            return (
              <article
                key={event.id}
                className="group relative flex h-full flex-col overflow-hidden chrome-border"
              >
                <div className="relative aspect-square shrink-0 overflow-hidden border-b border-border bg-black">
                  {event.images[0] ? (
                    <img
                      src={event.images[0].url}
                      alt={
                        event.images[0].altText ?? `${event.title} event banner`
                      }
                      loading="lazy"
                      className="h-full w-full object-contain transition-opacity duration-500 group-hover:opacity-95"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_25%,rgba(236,72,153,0.16),transparent_42%),linear-gradient(135deg,rgba(109,40,217,0.12),transparent_65%)]"
                    >
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                        <span className="h-px w-8 bg-primary/60" />
                        Lowlife Est. 15
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-gradient-brand text-white">
                        <span className="font-display text-xs tracking-widest">
                          {date.month}
                        </span>
                        <span className="font-display text-2xl leading-none">
                          {date.day}
                        </span>
                      </div>
                      {TICKETS_ENABLED && !isAttendanceOnly && (
                        <span className="rounded-sm border border-primary/50 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                          ${Number(event.price.amount)}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 font-display text-2xl tracking-wide">
                      {event.title}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />{" "}
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" />{" "}
                        {event.timeLabel}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-chrome-dim">
                      {event.description}
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-chrome transition-colors hover:text-primary"
                      aria-label={`Get directions to ${event.title} at ${event.address}`}
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Get Directions
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {event.address}
                    </p>
                  </div>
                  {TICKETS_ENABLED &&
                    (isAttendanceOnly ? (
                      <span className="btn-ghost mt-6 w-full cursor-default justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                        We'll Be There
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void selectTicket(event)}
                        disabled={!event.availableForSale || purchasing}
                        className="btn-brand mt-6 w-full"
                      >
                        {purchasing ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ticket className="h-4 w-4" />
                        )}
                        {purchasing
                          ? "Opening Checkout"
                          : event.availableForSale
                            ? "Buy Tickets"
                            : "Sold Out"}
                      </button>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <Dialog
        open={Boolean(ticket)}
        onOpenChange={(open) => !open && setTicket(null)}
      >
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden border-primary/40 bg-card p-0 sm:max-w-md">
          <div className="h-1.5 bg-gradient-brand" />
          <div className="p-6 pt-3">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl tracking-wide">
                Your event pass
              </DialogTitle>
              <DialogDescription>
                Demo ticket preview. Checkout will connect when the store is
                provisioned.
              </DialogDescription>
            </DialogHeader>
            {ticket && (
              <div className="mt-6 flex flex-col items-center">
                <QrPlaceholder />
                <div className="mt-5 w-full border-t border-dashed border-border pt-4">
                  <p className="font-display text-xl">{ticket.eventName}</p>
                  <div className="mt-2 flex justify-between gap-4 text-xs text-chrome-dim">
                    <span>{ticket.ticketType}</span>
                    <span className="font-mono">{ticket.ticketId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
