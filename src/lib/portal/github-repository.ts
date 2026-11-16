import "server-only";

export type PublicRepositoryCheck = "public" | "not_public" | "invalid" | "unavailable";

type GitHubRepository = { private?: unknown; visibility?: unknown };

function parseGitHubRepositoryUrl(value: string): { owner: string; repository: string } | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password || url.search || url.hash) return null;
    const [owner, rawRepository] = url.pathname.split("/").filter(Boolean);
    const repository = rawRepository?.replace(/\.git$/i, "");
    if (!owner || !repository || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}[A-Za-z0-9])?$/.test(owner) || !/^[A-Za-z0-9._-]{1,100}$/.test(repository)) return null;
    return { owner, repository };
  } catch {
    return null;
  }
}

export async function checkPublicGitHubRepository(value: string): Promise<PublicRepositoryCheck> {
  const parsed = parseGitHubRepositoryUrl(value);
  if (!parsed) return "invalid";

  try {
    const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repository)}`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) return "not_public";
    if (response.status === 403 || response.status === 429 || !response.ok) return "unavailable";
    const repository = await response.json() as GitHubRepository;
    return repository.private === false || repository.visibility === "public" ? "public" : "not_public";
  } catch {
    return "unavailable";
  }
}
