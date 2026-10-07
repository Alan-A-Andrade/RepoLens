import "server-only";

import type { TypedDocumentString } from "@/gql/graphql";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly kind: "rate-limited" | "unauthorized" | "not-found" | "unknown",
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { type?: string; message: string }[];
}

/**
 * Run a typed GitHub GraphQL document. Server-only: the token must never reach
 * the client bundle. Callers own caching via `"use cache"` + `cacheLife`.
 */
export async function githubQuery<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new GitHubError(
      "GITHUB_TOKEN is not set. Copy apps/web/.env.example to .env.local and add a token.",
      "unauthorized",
    );
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: document.toString(), variables }),
  });

  if (response.status === 401) {
    throw new GitHubError("GitHub rejected the token.", "unauthorized");
  }
  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0")
  ) {
    throw new GitHubError("GitHub rate limit reached.", "rate-limited");
  }
  if (!response.ok) {
    throw new GitHubError(
      `GitHub responded with ${response.status}.`,
      "unknown",
    );
  }

  const body = (await response.json()) as GraphQLResponse<TResult>;
  const [firstError] = body.errors ?? [];
  if (firstError) {
    const kind =
      firstError.type === "NOT_FOUND"
        ? "not-found"
        : firstError.type === "RATE_LIMITED"
          ? "rate-limited"
          : "unknown";
    throw new GitHubError(firstError.message, kind);
  }
  if (!body.data) {
    throw new GitHubError("GitHub returned no data.", "unknown");
  }
  return body.data;
}
