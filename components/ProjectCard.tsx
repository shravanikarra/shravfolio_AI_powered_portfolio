import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const categoryTag = (category: string) => {
  if (category === 'The Business Value') return 'Analytics';
  if (category === 'The Deep Dive') return 'ML';
  return 'Systems';
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const tag = categoryTag(project.category);
  const title = project.displayName || project.title;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-brand-primary/60 transition-colors shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {tag}
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">{project.year}</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-3">{title}</h3>
          {project.subtitle && <p className="text-xs text-slate-400 mt-1">{project.subtitle}</p>}
          {project.repoName && (
            <p className="text-[11px] text-slate-500 mt-1">Repo: {project.repoName}</p>
          )}
          <p className="text-sm text-slate-300 mt-2 line-clamp-3">{project.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.technologies.slice(0, 4).map(tech => (
          <span key={tech} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-5">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-white hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          GitHub
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg bg-brand-primary text-slate-900 text-sm font-semibold hover:opacity-90 transition"
          >
            Live
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
