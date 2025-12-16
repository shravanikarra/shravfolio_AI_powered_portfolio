import { aboutSummary, contactInfo, skills } from "../data/about";
import { projects, PortfolioProject } from "../data/projects";
import { systems } from "../data/systems";
import { models } from "../data/models";

export const getShravaniSummary = (): string => {
  return `${aboutSummary} Core strengths include reliable data pipelines, applied ML evaluation, and clear interfaces for decision-making.`;
};

export const getProjectList = (): PortfolioProject[] => projects;

export const getProjectDetail = (projectId: string): { text: string; links: PortfolioProject["links"] } => {
  const project = projects.find(p => p.id === projectId) || projects[0];
  const summary = `${project.displayName}: ${project.description} Tools: ${project.tags.join(', ')}.`;
  return { text: summary, links: project.links };
};

export const getSystemsList = () =>
  systems.map(system => ({
    id: system.id,
    displayName: system.displayName,
    problem: system.problem,
    approach: system.approach,
    links: system.links
  }));

export const getModelsOverview = (): string => {
  return "Models & Methods covers regression/classification, tree ensembles and boosting, clustering and anomaly detection, time series forecasting, deep learning for vision, and NLP/LLM prompting. Pick a category to see where it applies.";
};

export const getModelCategoryDetail = (category: string): string => {
  const normalized = category.toLowerCase();
  const matches: string[] = [];

  Object.values(models).forEach(items => {
    items.forEach(item => {
      if (item.tags.some(tag => tag.toLowerCase().includes(normalized)) || item.title.toLowerCase().includes(normalized)) {
        const evidenceLabels = (item.evidence || []).map(e => e.label).join(', ');
        matches.push(`${item.title}: ${item.description}${evidenceLabels ? ` (evidence: ${evidenceLabels})` : ''}`);
      }
    });
  });

  if (matches.length === 0) {
    return `${category}: Documented under /models with evidence links to notebooks and repos.`;
  }

  return `${category}: ${matches.join(' | ')}`;
};

export const getContactInfo = (): string => {
  return `Contact Shravani at ${contactInfo.email}. LinkedIn: ${contactInfo.linkedin}. GitHub: ${contactInfo.github}.`;
};
