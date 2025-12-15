import { Project } from '../types';
import { getProjectImage } from '../constants';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
}

export const fetchGitHubRepos = async (username: string): Promise<any[]> => {
  try {
    // Fetch top 30 most recently updated repos
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30&type=owner`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Basic filter to remove obviously non-project repos (optional)
    return repos.filter(r => !r.name.includes('.github') && !r.name.includes('portfolio'));
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
};

export const mapRepoToProject = (repo: any, analysis: any): Project => {
  const title = analysis.title || repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
  const category = analysis.category || 'The End-to-End';
  
  // Use reliable static image helper
  const imageUrl = getProjectImage(category, title);

  return {
    id: repo.id.toString(),
    title: title,
    description: analysis.description || repo.description || "No description provided.",
    category: category, 
    technologies: analysis.technologies || [repo.language].filter(Boolean),
    imageUrl: imageUrl,
    githubUrl: repo.html_url,
    demoUrl: repo.homepage,
    year: new Date(repo.updated_at).getFullYear()
  };
};