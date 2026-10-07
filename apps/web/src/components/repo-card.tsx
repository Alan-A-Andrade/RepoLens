import type { RepoSummaryQuery } from "@/gql/graphql";
import { formatCompactNumber } from "@/lib/format/compact-number";

type Repo = NonNullable<RepoSummaryQuery["repository"]>;

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <article className="rounded-lg border border-black/10 p-5 dark:border-white/15">
      <h3 className="font-mono text-base font-semibold">
        <a href={repo.url} className="hover:underline">
          {repo.nameWithOwner}
        </a>
      </h3>
      {repo.description && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {repo.description}
        </p>
      )}
      <dl className="mt-4 flex gap-4 text-sm">
        {repo.primaryLanguage && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Language</dt>
            <span
              aria-hidden
              className="size-3 rounded-full"
              style={{
                backgroundColor: repo.primaryLanguage.color ?? "currentColor",
              }}
            />
            <dd>{repo.primaryLanguage.name}</dd>
          </div>
        )}
        <div className="flex gap-1">
          <dt>Stars</dt>
          <dd className="font-medium">
            {formatCompactNumber(repo.stargazerCount)}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt>Forks</dt>
          <dd className="font-medium">{formatCompactNumber(repo.forkCount)}</dd>
        </div>
      </dl>
    </article>
  );
}
