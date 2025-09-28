# Ultimate Podcast Studio Rental — Architecture

## 1) Technical Overview
- Framework: Next.js 14 (App Router, React Server Components) + TypeScript.
- Styling: Tailwind CSS + CSS variables for theming; `next/font` for Inter/Poppins.
- Motion: Framer Motion for client islands; GSAP optional (not required).
- Effects: CSS transforms, WebGL optional (off for MVP); custom hooks for magnetic hover, tilt, parallax.
- Media: `next/image` for optimized AVIF/WebP; lazy + priority images; `next/video` or HTML5 video for hero.
- Deployment: Vercel (Edge Network, Image Optimization, Serverless/Edge Functions).
- Analytics: Vercel Analytics + PostHog (or Plausible) for events.
- Booking: Cal.com embed (preferred) with Availability API; fallback to contact form.

## 2) App Structure (App Router)
```
/app
  /api
    /availability
      route.ts           # GET: live availability proxy
    /quote
      route.ts           # POST: pricing calculator
    /contact
      route.ts           # POST: contact form (email/CRM)
  favicon.ico
  globals.css
  layout.tsx            # RSC layout, fonts, theme provider
  page.tsx              # Landing page (RSC shell)

/components
  Hero.tsx              # client island (motion, visualizer)
  Services.tsx          # mostly RSC, hover client bits
  Showcase.tsx          # gallery (client), lightbox
  StudioSpaces.tsx      # signature suite layouts (client)
  Testimonials.tsx      # carousel (client)
  QuoteCalculator.tsx   # client
  BookingModal.tsx      # client, loads Cal.com embed
  AvailabilityBadge.tsx # client, uses /api/availability
  FloatingCTA.tsx       # client
  Navbar.tsx, Footer.tsx

/hooks
  useMagnetic.ts
  useTilt.ts
  useParallax.ts
  useScrollHue.ts
  useAudioViz.ts
  useInViewOnce.ts

/lib
  pricing.ts            # price rules, taxes, add-ons
  analytics.ts          # event helpers
  seo.ts                # meta + JSON-LD builders
  availability.ts       # vendor API client
  validators.ts         # zod schemas for forms

/public
  /images               # fallback assets
  /audio                # before/after samples
```

## 3) Rendering Strategy
- Use RSC for static/mostly‑static sections (copy, images, testimonials list).
- Isolate interactivity into client islands (gallery, calculators, booking modal, FAB, audio viz).
- Lazy‑load non‑critical islands via dynamic import and `inView` triggers.
- Edge cache SSR response; revalidate on content change.

## 4) Data Flow
- Availability: Client → `/api/availability` (Edge Function) → Cal.com API (or ICS) → normalized response → client badge/calendar.
- Quote: Client → `/api/quote` with duration + add‑ons → returns itemized total → export payload to booking widget.
- Contact: Client → `/api/contact` → email (Resend) or CRM (HubSpot) → success toast.
- Analytics: `analytics.track(event, payload)` from islands; server logs minimal.

## 5) Availability Integration
- Preferred: Cal.com Availability API (by resource), cached 30–60s on Edge to keep “live” feel without rate‑limit risk.
- Fallback: ICS feed parse + local cache; mark days as available/limited/booked; confirm via contact form.
- UI: Month grid with color dots + tooltip; on date select, show slots; button to “Book this slot”.

## 6) Pricing & Quote Calculation
- Inputs: duration (hours), engineer add‑on, multi‑cam add‑on, after‑hours, rush fee.
- Pricing rules: tiered hourly rates, daily cap, discounts for 4h+.
- Taxes/fees configurable via env.
- Output: subtotal, taxes, total; export to booking widget notes/metadata.

## 7) Performance Strategy
- Budgets: JS ≤ 180KB gz; CLS ≤ 0.1; LCP ≤ 2.0s p75 mobile.
- Images: AVIF/WebP; `sizes` and responsive `srcset`; dominant‑color placeholders.
- Fonts: `next/font` with subset + `display: swap`.
- Code: tree‑shake; RSC heavy by default; dynamic imports for motion/visualizer; hydrate on interaction.
- Motion: prefer transform/opacity + will‑change; avoid layout thrash; cap FPS to 60.

## 8) Accessibility Strategy
- Respect `prefers-reduced-motion`; disable parallax/visualizer accordingly.
- Keyboard focus order mirrors visual order; skip links; roving tabindex in carousel.
- ARIA for carousel, lightbox, and modal; trap focus in modal.
- Color contrast tokens for dark theme.

## 9) Security & Privacy
- API rate‑limit (IP‑based) on contact and quote.
- Validate inputs with zod; sanitize; reject HTML.
- Secrets via environment variables; no secrets in client bundle.
- Optional CAPTCHA on contact submit.

## 10) SEO & Structured Data
- JSON‑LD: LocalBusiness (address, geo, openingHours, contactPoint) + Product/Offer for rental packages.
- Title/Description tuned for “podcast studio rental [city]”.
- Canonical URL, OG/Twitter images; sitemap + robots.

## 11) Observability
- Vercel Analytics for Web Vitals + custom events.
- PostHog for funnels (book CTA → booking started → quote done → booking completed).
- Log retained minimal PII; error alerts via Vercel/Logflare.

## 12) Env & Config
- `BOOKING_PROVIDER` (`cal`, `ics`, `none`)
- `CAL_API_KEY`, `CAL_USERNAME` or resource identifiers
- `RESEND_API_KEY` (or SMTP)
- `POSTHOG_KEY`, `POSTHOG_HOST`
- `PRICING_JSON` (optional externalized rules)

## 13) Testing Strategy
- Unit: lib/pricing, validators, seo builders (Vitest/Jest).
- Component: gallery lightbox, quote calculator (React Testing Library).
- E2E: Playwright — hero CTA, booking modal opens, availability badge updates, contact form submits.
- Performance: Lighthouse CI budget; WebPageTest script optional.

## 14) Deployment
- Vercel project with Edge Functions for `/api/*`.
- Preview deployments for PRs; password‑protect previews if needed.
- Rollback strategy: previous deployment alias.
