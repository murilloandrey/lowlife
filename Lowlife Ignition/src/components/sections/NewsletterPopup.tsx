import { useEffect, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { subscribeToNewsletter } from "@/lib/shopify/newsletter";

const STORAGE_KEY = "lowlife-newsletter-seen-at";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const lastSeen = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - lastSeen < SEVEN_DAYS) return;

    let hasOpened = false;
    const show = () => {
      if (hasOpened) return;
      hasOpened = true;
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setOpen(true);
    };
    const timer = window.setTimeout(show, 10_000);
    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0 && !event.relatedTarget) show();
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setSubmitting(true);
    try {
      if (isShopifyConfigured()) {
        const result = await subscribeToNewsletter(email);
        if (result.configured && !result.subscribed) {
          throw new Error(result.message || "Newsletter signup failed.");
        }
      }
    } catch (error) {
      toast.error("We couldn't add you yet.", {
        description:
          error instanceof Error ? error.message : "Try again in a moment.",
      });
      setSubmitting(false);
      return;
    }

    toast.success("You're on the list.", {
      description: "Use WELCOME10 for 10% off your first order.",
    });
    setSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] overflow-hidden border-primary/50 bg-card p-0 sm:max-w-md">
        <div className="h-1.5 bg-gradient-brand" />
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-left">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <DialogTitle className="font-serif text-4xl font-black leading-none">
              Welcome to the life.
            </DialogTitle>
            <DialogDescription className="pt-3 text-sm leading-relaxed text-chrome-dim">
              Get first word on drops, meets, and member-only releases. Take{" "}
              <strong className="text-white">10% off</strong> your first order
              with code{" "}
              <span className="text-gradient-brand font-bold">WELCOME10</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="h-12 rounded-none border-border bg-background text-base focus-visible:ring-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-brand w-full disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Joining…" : "Unlock 10% Off"}
            </button>
          </form>
          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            No spam. Just drops worth opening.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
