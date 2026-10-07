import { render, screen } from "@testing-library/react";

import { RepoCard } from "./repo-card";

const repo = {
  nameWithOwner: "vercel/next.js",
  description: "The React Framework",
  url: "https://github.com/vercel/next.js",
  stargazerCount: 131_400,
  forkCount: 28_100,
  primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
};

describe("RepoCard", () => {
  it("links to the repository", () => {
    render(<RepoCard repo={repo} />);
    expect(
      screen.getByRole("link", { name: "vercel/next.js" }),
    ).toHaveAttribute("href", "https://github.com/vercel/next.js");
  });

  it("shows compact counts and the primary language", () => {
    render(<RepoCard repo={repo} />);
    expect(screen.getByText("131.4K")).toBeInTheDocument();
    expect(screen.getByText("28.1K")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("omits the description and language when GitHub has none", () => {
    render(
      <RepoCard repo={{ ...repo, description: null, primaryLanguage: null }} />,
    );
    expect(screen.queryByText("The React Framework")).not.toBeInTheDocument();
    expect(screen.queryByText("Language")).not.toBeInTheDocument();
  });
});
