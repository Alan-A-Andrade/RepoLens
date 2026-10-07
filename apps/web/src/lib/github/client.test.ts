import { TypedDocumentString } from "@/gql/graphql";

import { GitHubError, githubQuery } from "./client";

const Query = new TypedDocumentString<
  { viewer: { login: string } },
  { id: string }
>("query Test($id: ID!) { viewer { login } }");

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv("GITHUB_TOKEN", "test-token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("githubQuery", () => {
  it("posts the query with the token and returns data", async () => {
    const fetchMock = mockFetch(
      Response.json({ data: { viewer: { login: "octocat" } } }),
    );

    await expect(githubQuery(Query, { id: "1" })).resolves.toEqual({
      viewer: { login: "octocat" },
    });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.github.com/graphql");
    expect(init.headers.Authorization).toBe("Bearer test-token");
    expect(JSON.parse(init.body)).toEqual({
      query: "query Test($id: ID!) { viewer { login } }",
      variables: { id: "1" },
    });
  });

  it("fails clearly when the token is missing", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    await expect(githubQuery(Query, { id: "1" })).rejects.toMatchObject({
      kind: "unauthorized",
    });
  });

  it("maps an exhausted rate limit to a rate-limited error", async () => {
    mockFetch(
      new Response(null, {
        status: 403,
        headers: { "x-ratelimit-remaining": "0" },
      }),
    );
    await expect(githubQuery(Query, { id: "1" })).rejects.toMatchObject({
      kind: "rate-limited",
    });
  });

  it("maps GraphQL NOT_FOUND errors", async () => {
    mockFetch(
      Response.json({
        errors: [{ type: "NOT_FOUND", message: "Could not resolve" }],
      }),
    );
    const error = await githubQuery(Query, { id: "1" }).catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(GitHubError);
    expect(error).toMatchObject({
      kind: "not-found",
      message: "Could not resolve",
    });
  });
});
