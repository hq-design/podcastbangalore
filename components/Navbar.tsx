"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useBooking } from "@/components/BookingContext";

const links = [
  { label: "Stories", href: "#stories" },
  { label: "The Space", href: "#space" },
  { label: "Creators", href: "#creators" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open } = useBooking();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = isScrolled || isMenuOpen;
  const backgroundClass = isSolid ? "bg-background/85 backdrop-blur" : "bg-transparent";
  const borderClass = isSolid ? "border-border/70" : "border-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${backgroundClass} ${borderClass}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-text-primary">
        <a href="#hero" className="font-display text-xl uppercase tracking-[0.4em]">
          Podcast Bangalore
        </a>

        <nav className="hidden items-center gap-10 text-xs uppercase tracking-[0.4em] text-text-muted md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => open(undefined, "nav")}
            className="hidden rounded-full border border-primary bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-background transition hover:bg-primary/80 md:inline-flex"
          >
            Book Studio
          </button>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border/60 bg-background/95 px-6 py-6 text-xs uppercase tracking-[0.4em] md:hidden"
          >
            <div className="flex flex-col gap-4 text-text-muted">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  open(undefined, "nav-mobile");
                }}
                className="rounded-full border border-primary bg-primary px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-background"
              >
                Book Studio
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
