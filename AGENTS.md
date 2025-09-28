# Repository Guidelines

## Project Structure & Module Organization
The app follows the Next.js App Router layout. Public pages and API handlers live in `app/`, with route groups under `app/(...)` and server code in `app/api/*/route.ts`. Shared UI primitives live in `components/`, reusable business logic in `lib/`, and React hooks in `hooks/`. Tailwind layer definitions are kept in `styles/`, while static assets (favicons, images, fonts) belong in `public/`. Reference materials and marketing copy sit in `docs/`. Use the `@/` alias for absolute imports from the project root.

## Build, Test, and Development Commands
Install deps once with `npm install`. Run `npm run dev` for hot-reload development, `npm run build` to generate the production bundle, and `npm run start` to serve the compiled app. Use `npm run lint` to invoke Next.js’ ESLint config, and `npm run test` (optionally `-- --watch`) to execute the Vitest suite in jsdom.

## Coding Style & Naming Conventions
Write components and utilities in TypeScript with strict mode assumptions. Prefer async/await, const-first declarations, and 2-space indentation. React components use PascalCase (`PodcastHero.tsx`), hooks use `use`-prefixed camelCase, and files co-located with routes or features (e.g., `app/(marketing)/about/page.tsx`). Apply Tailwind utility classes for styling; if abstraction is needed, create small wrapper components rather than extensive CSS overrides. Run `npm run lint` before opening a PR to enforce formatting and import rules.

## Testing Guidelines
Vitest with Testing Library powers unit and integration tests. Place tests next to the code under test using the `*.test.ts` or `*.test.tsx` suffix. Mock network calls with MSW or lightweight stubs under `tests/` when necessary. Aim to cover critical flows such as booking availability and form submissions; add regression tests for reported bugs. Use `npm run test -- --coverage` when assessing suite completeness.

## Commit & Pull Request Guidelines
Write commits in the imperative mood (`feat: add booking availability endpoint`) and keep them scoped to a single concern. Reference issue IDs in the subject or body when applicable. Pull requests should include: a concise summary, screenshots or screen recordings for UI changes, backend testing notes (lint, tests, manual checks), and call out any follow-up work. Request review once all checklist items pass.

## Security & Configuration Tips
Store secrets in `.env.local` and never commit `.env` files. Keep environment examples in `docs/` or `.env.example` when documenting required keys. Rotate PostHog and analytics tokens if exposed, and confirm Edge runtime handlers avoid logging sensitive values.
