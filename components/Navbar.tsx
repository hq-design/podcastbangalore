"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { label: "Studios", href: "#studios" },
  { label: "Experience", href: "#experience" },
  { label: "Services", href: "#services" },
  { label: "Clients", href: "#clients" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-background/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="section-wrapper flex items-center justify-between py-5">
        <Link href="#hero" className="font-sans text-sm uppercase tracking-[0.4em] text-contrast">
          PODCAST BANGALORE
        </Link>
        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-muted lg:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-contrast transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-full border border-contrast px-5 py-2 text-xs uppercase tracking-[0.3em] text-contrast transition-colors hover:bg-contrast hover:text-background lg:inline-flex"
        >
          Book a session
        </a>
        <button
          type="button"
          className="flex h-10 w-12 items-center justify-center rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted lg:hidden"
          onClick={() => {
            const nav = document.getElementById("mobile-nav");
            nav?.classList.toggle("hidden");
          }}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>
      <div id="mobile-nav" className="hidden border-t border-border bg-background lg:hidden">
        <nav className="section-wrapper flex flex-col gap-4 py-6 text-xs uppercase tracking-[0.3em] text-muted">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-contrast transition-colors">
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full border border-contrast px-5 py-2 text-center text-xs uppercase tracking-[0.3em] text-contrast"
          >
            Book a session
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
