import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive, onClick }) => {
  const [imgSrc, setImgSrc] = useState(project.imageUrl);
  const [hasError, setHasError] = useState(false);

  // Reset image if project changes
  useEffect(() => {
    setImgSrc(project.imageUrl);
    setHasError(false);
  }, [project.imageUrl]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a reliable generated avatar/placeholder service
      setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=0f172a&color=38bdf8&size=512&font-size=0.33`);
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 transform group
        ${isActive 
          ? 'border-brand-primary ring-2 ring-brand-primary shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-105 z-10 bg-slate-800' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800 hover:-translate-y-1'
        }
      `}
    >
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
        <img 
          src={imgSrc} 
          alt={project.title} 
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 z-20">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-brand-primary font-mono border border-brand-primary/30">
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-brand-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-500 font-mono">{project.year}</span>
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-secondary hover:text-white transition-colors flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;