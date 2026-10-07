# ADR 1: Next.js App Router over a Vite SPA

- **Status:** Accepted
- **Date:** 2026-10-07

## Context

RepoLens is a public product whose main surface is one page per GitHub repository. Those pages only have value if search engines index them and if they load fast on mobile: the quality bars require LCP < 2.5 s and Lighthouse ≥ 95 in every category.

My default stack for app-like products is Vite + React + TanStack Router (as in Plenno). It renders on the client, so a repo page would ship an empty HTML shell, fetch from the GitHub API in the browser, and then render. That has three problems here:

- Crawlers and link unfurlers see the shell, not the content. Metadata, OG images and JSON-LD differ per repo, so they need to exist in the HTML.
- LCP waits for JS download, parse, and an API round trip.
- Calling GitHub from the browser either exposes a token or uses the unauthenticated limit of 60 requests an hour, shared per visitor IP.

## Decision

Use the Next.js App Router (16.x) with Cache Components and Partial Prefetching enabled.

- Repo pages are prerendered, with popular repos listed in `generateStaticParams` and the rest rendered on first visit and then cached (ISR). Slow panels stream in behind `<Suspense>`.
- GitHub is called only from Server Components and route handlers, so the token stays on the server and responses are cached with `"use cache"` + `cacheLife` + `cacheTag`.
- Interactive parts (watchlist, chat) are client islands. Everything else is a Server Component and ships no JS.

## Consequences

- SEO features are built in: `generateMetadata`, `sitemap.ts`, `robots.ts` and OG image routes.
- The caching model is a new thing to learn and to get wrong. Every data function has to say how long it lives and which tags invalidate it, and that's checked in review.
- Async Server Components can't be unit-tested in Vitest. Pure logic and sync components get unit tests, and async pages are covered by Playwright.
- Hosting is tied most closely to Vercel. Self-hosting is possible but would need a cache handler.

## Alternatives considered

- **Vite SPA + TanStack Router:** the best developer experience for logged-in apps, and still what I'd choose for a dashboard-only product. Rejected here because of the SEO, LCP and token problems above.
- **Vite SPA + a prerender step:** fixes crawlers for a fixed list of pages but not for the unbounded set of repos, and it adds a second rendering pipeline.
- **Astro:** excellent for content pages, but the watchlist and streaming chat would be islands in a second framework's model, and the role being targeted asks for Next.js.
