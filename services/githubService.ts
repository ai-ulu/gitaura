import { RepoInfo } from "../types";

const GITHUB_API_BASE = "https://api.github.com/repos";

export const parseGithubUrl = (
  url: string,
): { owner: string; name: string } | null => {
  if (!url) return null;
  try {
    const urlObject = new URL(url);
    if (
      urlObject.hostname !== "github.com" &&
      urlObject.hostname !== "www.github.com"
    ) {
      return null;
    }

    // Remove leading/trailing slashes and then split
    const pathSegments = urlObject.pathname.replace(/^\/|\/$/g, "").split("/");

    if (pathSegments.length < 2) {
      return null;
    }

    const owner = pathSegments[0];
    const name = pathSegments[1];

    return { owner, name };
  } catch (e) {
    // Invalid URL format
    return null;
  }
};

export const fetchRepoData = async (
  owner: string,
  name: string,
  token?: string,
): Promise<{ repo: RepoInfo; rateLimit: string | undefined }> => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token && token.trim() !== "") {
    headers["Authorization"] = `token ${token}`;
  }

  // 1. Fetch Repo Metadata
  const repoResponse = await fetch(`${GITHUB_API_BASE}/${owner}/${name}`, {
    headers,
  });

  const rateLimit =
    repoResponse.headers.get("x-ratelimit-remaining") || undefined;

  if (!repoResponse.ok) {
    if (repoResponse.status === 404)
      throw new Error("Repo bulunamadı. Gizli olabilir veya URL yanlış.");
    if (repoResponse.status === 403)
      throw new Error(
        "GitHub API limitine takıldınız. Ayarlardan Token ekleyerek limiti kaldırabilirsiniz.",
      );
    throw new Error("Repo bilgileri çekilemedi.");
  }

  const repoData = await repoResponse.json();

  // 2. Fetch README
  // We use the content endpoint which returns base64
  const readmeResponse = await fetch(
    `${GITHUB_API_BASE}/${owner}/${name}/readme`,
    { headers },
  );

  if (!readmeResponse.ok) {
    throw new Error(
      "README dosyası bulunamadı. Analiz için README gereklidir.",
    );
  }

  const readmeData = await readmeResponse.json();

  // Decode Base64 content
  let decodedContent = "";
  try {
    const binaryString = atob(readmeData.content.replace(/\n/g, ""));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    decodedContent = decoder.decode(bytes);
  } catch (e) {
    throw new Error("README içeriği okunamadı (Encoding hatası).");
  }

  return {
    repo: {
      owner: repoData.owner.login,
      name: repoData.name,
      description: repoData.description || "Açıklama yok",
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language || "Bilinmiyor",
      defaultBranch: repoData.default_branch,
      readmeContent: decodedContent,
    },
    rateLimit,
  };
};
