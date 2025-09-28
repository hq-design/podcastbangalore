import { socials } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div className="space-y-3">
          <h3 className="font-display text-2xl">Ultimate Podcast Studio</h3>
          <p className="max-w-sm text-sm text-white/60">
            Premium podcast production with cinematic visuals, concierge engineering, and frictionless booking in the heart of Los Angeles.
          </p>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Ultimate Podcast Studio. All rights reserved.</p>
        </div>
        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40">Visit us</h4>
            <p className="text-white/60">123 Studio Lane<br />Los Angeles, CA 90028</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40">Connect</h4>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a className="text-white/70 transition hover:text-primary" href={social.href}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
