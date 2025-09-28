import { socials } from "@/lib/data";

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
        </div>
        <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.3em]">
          <span>Koramangala · Bengaluru</span>
          <a href="mailto:concierge@podcastbangalore.com" className="text-text-primary hover:text-primary">
            concierge@podcastbangalore.com
          </a>
          <a href="tel:+919900112233" className="text-text-primary hover:text-primary">
            +91 9900 112233
          </a>
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
        © {year} Podcast Bangalore
      </div>
    </footer>
  );
}

export default Footer;
