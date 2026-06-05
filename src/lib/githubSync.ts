import { apiClient } from "@/lib/apiClient";

const GITHUB_USERNAME = "tejastro123";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  fork: boolean;
}

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const res = await fetch(GITHUB_API);
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.fork);
};

export const syncReposToSupabase = async () => {
  const repos = await fetchGitHubRepos();

  const projects = repos.map((repo, i) => ({
    title: repo.name,
    description: repo.description || `Repository: ${repo.name}`,
    tags: [repo.language, ...repo.topics].filter(Boolean) as string[],
    category: categorizeRepo(repo),
    demo: repo.homepage || "#",
    github: repo.html_url,
    image: "",
    featured: false,
    sort_order: i,
  }));

  // Upsert: match on github URL to avoid duplicates
  for (const project of projects) {
    const { data: existing } = await apiClient
      .from("projects")
      .select("id, featured, image, sort_order")
      .eq("github", project.github)
      .single();

    if (existing) {
      // Update but preserve featured/image/sort_order set by admin
      await apiClient
        .from("projects")
        .update({
          title: project.title,
          description: project.description,
          tags: project.tags,
          category: project.category,
          demo: project.demo,
        })
        .eq("id", existing.id);
    } else {
      await apiClient.from("projects").insert(project);
    }
  }

  return projects.length;
};

function categorizeRepo(repo: GitHubRepo): string {
  const lang = (repo.language || "").toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();

  if (name.includes("quantum") || desc.includes("quantum") || name.includes("qiskit") || name.includes("qucpl"))
    return "Quantum Computing";
  if (name.includes("ml") || name.includes("machine") || desc.includes("machine learning") || name.includes("agentic") || name.includes("ai"))
    return "AI / ML";
  if (name.includes("data-science") || desc.includes("data science"))
    return "Data Science";
  if (name.includes("dsa") || desc.includes("algorithm") || desc.includes("data structure"))
    return "Algorithms";
  if (lang === "javascript" || lang === "typescript" || name.includes("react") || name.includes("web") || name.includes("vite"))
    return "Web Dev";
  if (name.includes("django") || name.includes("express") || name.includes("node"))
    return "Backend";
  if (lang === "python")
    return "Programming";
  if (lang === "java")
    return "Programming";
  return "Other";
}
