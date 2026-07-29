import { useState } from "react";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { EVENTS } from "@/lib/mock-storefront-data";
import type { EventMetaobject, EventTicket } from "@/lib/shopify-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeader } from "./SectionHeader";

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

export function Events() {
  const [ticket, setTicket] = useState<EventTicket | null>(null);
  const selectTicket = (event: EventMetaobject) => {
    // TODO(shopify): replace with real ShopTickets/Ticket Spot checkout flow.
    setTicket({
      ticketId: `LL-${event.handle.toUpperCase()}-DEMO`,
      eventName: event.name,
      ticketType: event.ticketType,
      qrCodeUrl: event.checkoutUrl,
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
          subtitle="Tickets, vendor passes, and limited event merch — all online. First come, first served."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EVENTS.map((event) => {
            const date = dateParts(event.startsAt);
            return (
              <article
                key={event.id}
                className="group relative flex flex-col justify-between overflow-hidden chrome-border p-6"
              >
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
                    <span className="rounded-sm border border-primary/50 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      ${Number(event.ticketPrice.amount)}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl tracking-wide">
                    {event.name}
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
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Doors
                      open early
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-chrome-dim">
                    {event.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectTicket(event)}
                  className="btn-brand mt-6 w-full"
                >
                  <Ticket className="h-4 w-4" /> Buy Tickets
                </button>
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
