import { socials } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-contrast text-background">
      <div className="section-wrapper flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <h3 className="font-sans text-sm uppercase tracking-[0.4em]">Podcast Bangalore</h3>
          <p className="max-w-sm text-sm text-background/80">
            A modern podcast studio in Bengaluru designed for premium storytelling, launch moments, and long-form series work.
          </p>
        </div>
        <div className="space-y-3 text-sm uppercase tracking-[0.3em] text-background/70">
          <p>18 Residency Road • Bengaluru</p>
          <a href="tel:+919900112233" className="text-background">
            +91 9900 112233
          </a>
          <a href="mailto:concierge@podcastbangalore.com" className="text-background">
            concierge@podcastbangalore.com
          </a>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-background/70">
          {socials.map((social) => (
            <a key={social.label} href={social.href} className="hover:text-background">
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[11px] uppercase tracking-[0.3em] text-background/60">
        © {year} Podcast Bangalore · Crafted in Bengaluru
      </div>
    </footer>
  );
}

export default Footer;
