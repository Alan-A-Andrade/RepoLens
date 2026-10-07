# RepoLens

Fast, indexable insight pages for any GitHub repository, with a signed-in watchlist and an AI "ask this repo" assistant.

> Work in progress. The full README (live demo, architecture, Lighthouse results) lands in week 6.

## Local setup

Requires Node 24 and pnpm (via Corepack).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # add a GITHUB_TOKEN
docker compose up -d                           # local Postgres
pnpm dev
```

## Architecture decisions

See [`docs/adr/`](docs/adr/).
