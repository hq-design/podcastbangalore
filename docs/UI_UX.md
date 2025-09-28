# Ultimate Podcast Studio Rental — UI/UX Spec

## 1) Visual Language
- Theme: Ultra‑modern dark with neon accents; cinematic depth, glass effects.
- Palette
  - Background: `#0a0a0a`
  - Primary (Indigo): `#6366f1`
  - Accent (Electric Blue): `#00d4ff`
  - Accent (Neon Green): `#39ff14`
  - Text Primary: `#ffffff`
  - Text Muted: `#a3a3a3`
- Typography
  - Headers: Inter or Poppins (700/800)
  - Body: Inter (400/500)
  - Technical details: JetBrains Mono/monospace
- Effects
  - Subtle animated gradient or studio bokeh video in hero.
  - Glassmorphism cards (backdrop blur, low‑alpha borders).
  - Neon edge glow on primary CTA and interactive elements (soft, tasteful).

## 2) Layout & Grid
- Container: 12‑column fluid grid, max‑width 1280–1440px desktop.
- Spacing scale: 4/8/12/16/24/32/48/64 px.
- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

## 3) Components & States
- Navbar
  - Minimal top bar, logo left, Book Now right; blends with hero.
  - Scroll: compress height, add translucent backdrop + border.
- Hero
  - H1 typewriter cycling: Pro • Effortless • Cinematic.
  - Subcopy: 2‑line promise; supportive microcopy.
  - Primary CTA: “Book Your Studio Session” (magnetic hover, pulse on idle).
  - Secondary links: “Virtual Tour”, “Equipment”, “Pricing”.
  - Background: animated gradient/video; audio visualizer bars behind content (reduced motion → static).
- Services Cards (4)
  - Icon + title + 1‑2 lines; tilt on hover; glow border.
  - Tap opens small popover with more detail on mobile.
- Studio Showcase
  - Masonry/justified gallery; lightbox with swipe, zoom, and captions.
  - Equipment Grid: images with overlay specs; click to expand with 3D tilt.
  - Testimonials Carousel: 2–3 cards per view; autoplay with pause on hover; keyboard accessible.
  - Audio Before/After: AB switch toggles filter; waveform visual responds to play.
- Availability & Quote
  - Availability Badge: green/amber/red dot with tooltip “Live now”.
  - Mini calendar: select date → show slots; CTA: “Book this slot”.
  - Quote Calculator: duration slider (1–10h), add‑ons toggles; shows total, link to booking modal with payload.
- Booking Modal
  - Full‑height drawer or centered modal; loads Cal.com embed; theme‑consistent.
  - Progress indicator: Step dots; fallback to contact form if embed fails.
- Floating CTA
  - Sticky FAB bottom‑right; morphs based on scroll: “Book Now” → “Get Quote” contextually.
  - Magnetic hover; prominent on mobile.
- Footer
  - Contact info, hours, address, socials, legal links; small map link.

States
- Hover/focus/active defined for all interactives.
- Loading: skeletons for gallery and calendar slots.
- Errors: inline messages; try‑again and fallback actions.

## 4) Motion & Interaction Specs
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (Power4.Out feel).
- Durations: micro 120–180ms; standard 240–360ms; hero entrance 600–800ms stagger.
- Parallax: bg 8–12% slower than content; clamp on mobile.
- 3D Tilt: max rotateX 6°, rotateY 8°, perspective 800–1000px; spring back on leave.
- Magnetic Hover: translation up to 8–12px toward cursor; decay on leave.
- Scroll Hue Shift: interpolate brand hue 240→265 across 0–60% viewport scroll; disabled in reduced motion.
- Audio Visualizer: 24–32 bars, height mapped to fake FFT; 30–45fps throttled; paused if off‑screen.

## 5) Accessibility
- Respect `prefers-reduced-motion`: disable visualizer/tilt/parallax; provide simple fades.
- Keyboard: Tab order logical; focus rings clearly visible; skip to content link.
- Lightbox: focus trap; ESC to close; swipe on touch; captions and alt text.
- Color contrast: ≥ 4.5:1 for body, ≥ 3:1 for large text.

## 6) Content & Microcopy (Draft)
- Hero H1: “Record Your Podcast Like a Pro.”
- Hero Sub: “World‑class studio. Elite gear. On‑site support. Book in 60 seconds.”
- CTA: “Book Your Studio Session”
- Services Titles: “Studio Rentals”, “Equipment Included”, “Technical Support”, “Flexible Booking”.
- Equipment Spec Snippets: “Shure SM7B • RØDE Procaster • Cloudlifter CL‑1 • SSL2+ • Sony A7SIII” (adjust to real gear).
- Testimonials: Short, credible quotes with names + shows.
- Audio Sample Labels: “Raw room” vs “Our studio mix”.
- Quote Labels: “Duration”, “Engineer”, “Multi‑Cam”, “After Hours”.
- Empty State (Availability): “Select a date to see slots.”
- Error (Booking Widget): “We’re loading the booking portal… If it takes too long, contact us and we’ll reserve a slot.”

## 7) Responsive Behavior
- Mobile
  - Hero stacks; CTA fills width; simplified visualizer.
  - Gallery becomes swipeable; equipment grid 2‑up; carousel 1‑card view.
  - FAB larger target (56–64px); spacing increased.
- Tablet
  - 2‑column services; 2‑card carousel; calendar shows week view.
- Desktop
  - Rich parallax; larger hero; 3‑card carousel; calendar month view.

## 8) Asset Guidelines
- Hero video: 8–12s loop, 1080p H.265/WebM VP9; fallback poster; ≤ 3MB with `muted playsinline autoplay`.
- Images: Provide 3 sizes (sm/md/lg); AVIF + WebP; captions when relevant.
- Audio: 2 x 10–20s clips MP3/Opus; clear labels.

## 9) Section Wireframe (Textual)
- Above the Fold
  - [Logo]                           [Book Now]
  - [H1: Record Like a Pro]
  - [Subcopy]
  - [Primary CTA] [Secondary Links]
  - [Visualizer / Animated Background]

- Services
  - [Card][Card][Card][Card]

- Showcase
  - [Gallery Row]
  - [Equipment Grid 3x3]
  - [Testimonials Carousel]
  - [Audio A/B]

- Availability & Quote
  - [Availability Badge + Calendar]
  - [Quote Calculator]
  - [Book This Slot → Modal]

- Footer
  - [Contact | Hours | Map | Socials | Legal]

## 10) Measurement Plan (UX)
- Scroll depth, section view timings, CTA visibility ratio, FAB interactions.
- Interaction latency (tap → modal open), quote time to first total, gallery open rate, audio playthrough.
- A/B candidates: headline variants, hero video vs gradient, CTA wording, FAB presence on mobile.

## 11) Edge Cases & Fallbacks
- Booking embed fails → show contact form with prefilled date/time; display support phone.
- Availability source offline → show non‑live schedule disclaimer; encourage contact.
- Reduced motion → disable tilt/parallax/visualizer; keep crisp fade/scale.
- Low bandwidth → serve hero poster image; defer video.

