# Ultimate Podcast Studio Rental — PRD v1.0

Owner: Product + Design
Date: 2025-09-28
Status: Draft (for build)

## 1) Vision & Positioning
- Vision: Be the most irresistible, premium one‑page destination to discover, evaluate, and book a pro‑grade podcast studio in seconds.
- Brand pillars: Premium quality • Effortless booking • Expert support • Cinematic experience.
- One‑liner: Record your podcast like a pro — world‑class studio, gear, and support, bookable in under 60 seconds.

## 2) Target Users & JTBDs
- Creator Pro (weekly podcaster): I need a reliable, great‑sounding studio that’s easy to book.
- Emerging Podcaster (first timers): I need guidance + gear without technical headaches.
- Brands/Agencies: I need a premium space to impress clients and execute with zero risk.
- Producers/Audio Engineers: I need dependable acoustics, top gear, and flexible access.

Jobs‑to‑be‑done:
- When I plan an episode, I want to see live availability and all included gear so I can confidently book.
- When I’m comparing options, I want transparent pricing and audio samples so I can justify budget.
- When I’m ready to commit, I want a frictionless booking flow so I don’t abandon.

## 3) Goals & Success Metrics
- Primary goal: Drive booking intent and bookings from a single page.
- Secondary goals: Build brand trust, capture qualified leads.

North‑star metrics
- Booking conversion rate (visit → booking start) ≥ 6%
- Lead submission conversion rate (visit → contact submit) ≥ 10%
- Time to interactive ≤ 2.5s (4G mid‑tier phone)
- LCP ≤ 2.0s (p75), CLS ≤ 0.1, INP ≤ 200ms
- Bounce rate ≤ 35%, Avg. time on page ≥ 90s
- SEO: Top‑3 for “podcast studio rental [city]” within 60 days

## 4) Scope (One‑Page MVP+)
In‑scope
- Hero: cinematic visuals, strong value prop, primary CTA.
- Services overview: rentals, equipment included, technical support, flexible booking.
- Studio showcase: high‑quality images, equipment gallery, testimonials, before/after audio.
- Booking/contact section: embedded booking calendar or request form, contact info, location, hours, socials.
- Unique features: live availability indicator, interactive equipment grid, testimonials carousel, audio samples, 360° tour (embed), instant quote calculator, booking calendar widget.
- Motion/FX: parallax, hover/magnetic effects, Framer Motion transitions, audio visualizer background, 3D tilt, typewriter header, scroll‑triggered reveals, dynamic color shifts, sticky floating CTA.
- SEO/a11y/performance: best‑in‑class.

Out‑of‑scope (for now)
- Multi‑location studio switching UI.
- Full e‑commerce checkout + payments (only integrate 3rd‑party booking/pay where feasible).
- Account system, saved profiles, subscriptions.

## 5) Content & Messaging
- Tone: Premium yet approachable; confident, expert, and creative.
- Primary headline: “Record Your Podcast Like a Pro.”
- Subheadline: “Book a world‑class studio with elite gear and on‑site support.”
- Primary CTA: “Book Your Studio Session”
- Secondary CTAs: “Take Virtual Tour” • “See Equipment List” • “Get Pricing” • “Contact Us”
- Social proof: “500+ podcasts recorded” • “50+ creators” • Logos or ratings.
- Copy must highlight: included gear, acoustics, tech support, ease of booking, and sample audio.

## 6) Functional Requirements
Hero
- Cinematic hero with animated gradient/video background.
- Typewriter or morphing headline; subtle audio visualizer.
- Primary CTA visible and sticky on scroll via Floating Action Button (FAB).

Services Overview
- Four compact cards (Studio Rental, Equipment Included, Technical Support, Flexible Booking).
- Hover states with icon motion and 3D tilt.

Studio Showcase
- Responsive gallery with parallax and lightbox; equipment grid with hover specs.
- Testimonials carousel (auto + manual control) with subtle motion.
- Before/After audio player (A/B toggle) demonstrating studio sound.

Booking/Contact
- Live availability indicator (date picker color states: available/limited/booked).
- Embedded booking widget (Cal.com or equivalent) OR contact form fallback.
- Instant quote calculator (duration x add‑ons) with dynamic total, export to booking widget.
- Contact info (phone, email), map/location, hours, and social links.

Unique Interactions
- Magnetic hover for CTAs/cards.
- 3D tilt on cards/images with perspective.
- Scroll‑triggered color hue shift for backgrounds.
- Interactive studio tour (360° embed) with hotspots.

Accessibility
- WCAG 2.2 AA, reduced motion support, keyboard navigable, visible focus states.
- Proper labels/ARIA for forms, contrast ratio ≥ 4.5:1 for body text.

SEO
- Next SEO metadata; Open Graph/Twitter cards.
- JSON‑LD: LocalBusiness + Product (offers, priceRange, openingHours, address, geo).
- Fast LCP hero image via next/image, prioritized.
- Semantic structure: h1 → h2 sections; descriptive alt text.

Performance
- LCP ≤ 2.0s @ p75; JS budget ≤ 180KB gz.
- Lazy‑load heavy islands (gallery, 360 tour, booking modal), prefetch on hover.
- Optimize images (AVIF/WebP), serve via next/image.
- Use RSC to minimize client JS; isolate client components.

Analytics & Events
- Page view w/ UTM capture.
- CTA clicks (hero, FAB), section views (in‑view), booking started, booking completed, quote calculated, audio sample played, gallery opens.
- Error/reject events for booking failures.

Security/Privacy
- Minimal PII; reCAPTCHA or hCaptcha for contact.
- Rate limiting on API routes.
- Cookie consent for analytics if required by region.

## 7) Non‑Functional Requirements
- Uptime ≥ 99.9% (Vercel).
- Edge‑cacheable content; revalidate on content updates.
- Mobile‑first; touch‑friendly interactions.

## 8) Dependencies
- Brand assets (logo, color tokens), studio photography, audio samples, testimonials, map/location data, pricing tiers, booking integration (Cal.com/Calendly) or ICS.

## 9) Risks & Mitigations
- Heavy animation → perf risk: gate behind `prefers-reduced-motion`; progressively enhance; lazy‑load.
- Live availability source unstable: provide graceful fallback (form contact + “we’ll confirm availability”).
- Asset quality variance: set strict asset guidelines (resolution, aspect ratios, formats).

## 10) Acceptance Criteria (High‑Level)
- All sections present with responsive layout across breakpoints.
- CTAs sticky FAB visible ≥ 95% of scroll time on mobile and desktop.
- Booking flow loads in ≤ 1s after click (cached/embedded).
- Live availability indicator updates visually within 400ms of date selection.
- Quote calculator produces total and exports to booking widget payload.
- Audio A/B sample toggles instantly; keyboard accessible.
- Core Web Vitals pass at p75 on mobile (field data once live) and lab.
- a11y: No critical issues in axe scan; keyboard flow completes booking/contact.

## 11) Launch Checklist
- Domain + SSL configured; OG images/social cards verified.
- Analytics events tested; funnels visible.
- 404/500 pages styled (Next.js defaults ok, optional polish).
- Sitemap.xml + robots.txt present; JSON‑LD validates.
- Environment variables set; booking integration keys configured.

