import { cacheLife, cacheTag } from "next/cache";

import { graphql } from "@/gql";

import { githubQuery } from "./client";

const RepoSummaryQuery = graphql(`
  query RepoSummary($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      description
      url
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
    }
  }
`);

export async function getRepoSummary(owner: string, name: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`repo:${owner}/${name}`);

  const { repository } = await githubQuery(RepoSummaryQuery, { owner, name });
  return repository;
}
