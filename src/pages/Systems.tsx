import React from 'react';
import { Helmet } from 'react-helmet-async';
import { systems } from '../data/systems';

const statusClass = (status?: string) => {
  if (!status) return 'bg-slate-800 text-slate-300 border border-slate-700';
  const normalized = status.toLowerCase();
  if (normalized.includes('live')) return 'bg-emerald-900/40 text-emerald-200 border border-emerald-700';
  if (normalized.includes('progress')) return 'bg-slate-800 text-slate-200 border border-slate-700';
  return 'bg-slate-800 text-slate-300 border border-slate-700';
};

const SystemsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
      <Helmet>
        <title>Systems | Shravani Karra</title>
        <meta
          name="description"
          content="End-to-end applications where data, logic, and interfaces come together to support real-world decision-making."
        />
      </Helmet>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Systems</p>
        <h1 className="text-4xl font-bold text-white">Systems</h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          End-to-end applications where data, logic, and interfaces come together to support real-world decision-making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map(system => (
          <div
            key={system.id || system.repoName || system.displayName}
            className="rounded-xl border border-slate-800 bg-slate-800/40 p-6 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">
                    {system.displayName || system.repoName}
                  </h2>
                  {system.status && (
                    <span className={`text-xs px-2 py-1 rounded-full ${statusClass(system.status)}`}>
                      {system.status}
                    </span>
                  )}
                </div>
                {system.subtitle && <p className="text-sm text-slate-400 mt-1">{system.subtitle}</p>}
                <p className="text-sm text-slate-400 mt-1">{system.problem}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{system.approach}</p>
            <div className="flex flex-wrap gap-2">
              {system.stack.map(item => (
                <span key={item} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              {system.links.live && (
                <a
                  href={system.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-brand-primary text-slate-900 text-sm font-semibold hover:opacity-90 transition"
                >
                  Live
                </a>
              )}
              {system.links.github && (
                <a
                  href={system.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-white hover:border-brand-primary hover:text-brand-primary transition"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemsPage;
