import { socials } from "@/lib/data";

import HighContrastToggle from "@/components/HighContrastToggle";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background text-text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4 text-text-primary">
          <h3 className="font-display text-2xl">Podcast Bangalore</h3>
          <p className="max-w-sm text-sm text-text-muted">
            A private recording studio in central Bengaluru for creators shaping the narrative of India.
          </p>
          <p className="text-sm uppercase tracking-[0.32em] text-text-muted">
            500+ podcasts recorded • 4.9★ Google Reviews
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em]">
          <span>Koramangala · Bengaluru</span>
          <a
            href="mailto:concierge@podcastbangalore.com"
            className="text-text-primary hover:text-primary"
            onClick={copyContact}
          >
            concierge@podcastbangalore.com
          </a>
          <button
            type="button"
            onClick={copyContact}
            className="text-left text-text-primary hover:text-primary"
          >
            +91 9900 112233
          </button>
        </div>
        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="text-text-muted transition-colors hover:text-primary"
            >
              <span className="text-sm uppercase tracking-[0.3em]">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-border/80 py-6 text-center text-xs uppercase tracking-[0.3em] text-text-muted">
        <div className="mb-2 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-text-muted">
          <span className="rounded-full border border-border px-3 py-1">Visa</span>
          <span className="rounded-full border border-border px-3 py-1">Mastercard</span>
          <span className="rounded-full border border-border px-3 py-1">UPI</span>
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-text-muted">
          Secure booking • Free cancellation up to 24 hours
        </div>
        <div className="mb-2 flex justify-center">
          <HighContrastToggle />
        </div>
        © {year} Podcast Bangalore
      </div>
    </footer>
  );
}

export default Footer;

function copyContact(event: React.MouseEvent<HTMLElement>) {
  event.preventDefault();
  const value = event.currentTarget.textContent?.trim();
  if (!value || typeof navigator === "undefined" || !navigator.clipboard) return;
  void navigator.clipboard.writeText(value).catch(() => {
    /* ignore */
  });
  if (value.includes("@")) {
    window.location.href = `mailto:${value}`;
  } else if (/^[+\d\s-]+$/.test(value)) {
    window.location.href = `tel:${value.replace(/\s+/g, "")}`;
  }
}
