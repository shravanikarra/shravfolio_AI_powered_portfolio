import { Project, ProjectCategory } from '../types';
import { getProjectImage } from '../constants';
import { toTitleCase } from '../src/utils/titleCase';

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
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers: {
          // Ensure topics are included
          'Accept': 'application/vnd.github+json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Basic filter to remove obviously non-project repos (optional)
    return repos.filter(r => !r.name.includes('.github'));
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
};

const inferCategory = (repo: GitHubRepo): ProjectCategory => {
  const text = `${repo.name} ${repo.description || ''}`.toLowerCase();

  if (text.match(/app|api|web|flask|react|next|typescript|typescript|frontend|ui/)) {
    return 'The End-to-End';
  }
  if (text.match(/dashboard|report|analysis|analytics|forecast|scoring|tableau|business/)) {
    return 'The Business Value';
  }
  if (text.match(/deep|cnn|gan|lstm|nlp|vision|research|simulation/)) {
    return 'The Deep Dive';
  }

  if (repo.language === 'TypeScript' || repo.language === 'JavaScript') return 'The End-to-End';
  if (repo.language?.includes('Jupyter') || repo.language === 'Python') return 'The Business Value';
  return 'The End-to-End';
};

const deriveTechnologies = (repo: GitHubRepo, analysis: any): string[] => {
  const techs = new Set<string>();
  if (analysis?.technologies) {
    (analysis.technologies as string[]).forEach(t => t && techs.add(t));
  }
  if (repo.language) techs.add(repo.language);
  repo.topics?.forEach(t => t && techs.add(t.replace(/-/g, ' ')));
  return Array.from(techs).slice(0, 4);
};

export const mapRepoToProject = (repo: GitHubRepo, analysis?: any): Project => {
  const repoName = repo.name;
  const displayName = analysis?.title || toTitleCase(repoName);
  const title = displayName;
  const category = analysis?.category || inferCategory(repo);
  const technologies = deriveTechnologies(repo, analysis);
  const description = (analysis?.description || repo.description || 'Personal project.')?.trim();
  const imageUrl = getProjectImage(category, title);

  return {
    id: repo.id.toString(),
    title,
    displayName,
    repoName,
    description,
    category,
    technologies: technologies.length > 0 ? technologies : ['GitHub'],
    imageUrl,
    githubUrl: repo.html_url,
    demoUrl: repo.homepage || undefined,
    year: new Date(repo.updated_at).getFullYear()
  };
};
