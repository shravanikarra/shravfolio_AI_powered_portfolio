import React from 'react';
import { ModelItem } from '../src/data/models';

interface Props {
  item: ModelItem;
}

const ModelCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-brand-primary/60 transition-all">
      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
      <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.description}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {item.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-900 text-slate-200 border border-slate-700">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-1">
        {item.evidence.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-brand-primary hover:underline"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
};

export default ModelCard;
