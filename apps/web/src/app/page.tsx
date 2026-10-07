import { RepoCard } from "@/components/repo-card";
import { getRepoSummary } from "@/lib/github/repo-summary";

const FEATURED = [
  ["vercel", "next.js"],
  ["react", "react"],
  ["tailwindlabs", "tailwindcss"],
] as const;

export default async function Home() {
  const repos = await Promise.all(
    FEATURED.map(([owner, name]) => getRepoSummary(owner, name)),
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">RepoLens</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Fast, indexable insight pages for any GitHub repository.
      </p>

      <section aria-labelledby="featured-heading" className="mt-16">
        <h2 id="featured-heading" className="text-xl font-semibold">
          Featured repositories
        </h2>
        <ul className="mt-6 grid gap-4">
          {repos.map(
            (repo) =>
              repo && (
                <li key={repo.nameWithOwner}>
                  <RepoCard repo={repo} />
                </li>
              ),
          )}
        </ul>
      </section>
    </main>
  );
}
