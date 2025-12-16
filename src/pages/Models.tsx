import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ModelCard from '../../components/ModelCard';
import { models, ModelItem } from '../data/models';

const flattenModels = (): ModelItem[] =>
  Object.values(models).reduce((acc, items) => acc.concat(items), [] as ModelItem[]);

const ModelsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allItems = useMemo(() => flattenModels(), []);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.forEach(item => {
      item.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [allItems]);

  const filterMatch = (item: ModelItem) => {
    const text = search.toLowerCase().trim();
    const matchesSearch =
      !text ||
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.tags.some(tag => tag.toLowerCase().includes(text));

    const matchesTag = !activeTag || item.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  };

  const filteredSections = useMemo(() => {
    const result: { section: string; items: ModelItem[] }[] = [];
    Object.entries(models).forEach(([section, items]) => {
      const filtered = items.filter(filterMatch);
      if (filtered.length > 0) {
        result.push({ section, items: filtered });
      }
    });
    return result;
  }, [search, activeTag]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
      <Helmet>
        <title>Models & Methods | Shravani Karra</title>
        <meta
          name="description"
          content="A structured library of ML methods applied across real projects—focused on evaluation, tradeoffs, and reproducibility."
        />
      </Helmet>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Models</p>
        <h1 className="text-4xl font-bold text-white">Models & Methods</h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          A structured library of ML methods I’ve applied across real projects—focused on evaluation, tradeoffs, and reproducibility.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="text"
          placeholder="Search titles, descriptions, or tags"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
        />
        <div className="flex flex-wrap gap-2">
          {tagCounts.slice(0, 10).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                activeTag === tag
                  ? 'bg-brand-primary text-slate-900 border-brand-primary'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-brand-primary/60'
              }`}
            >
              {tag}
            </button>
          ))}
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="px-3 py-1 rounded-full text-xs border border-slate-700 text-slate-200 hover:border-brand-primary/60"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-10">
        {filteredSections.length === 0 && (
          <p className="text-slate-400 text-sm">No methods match your filters yet.</p>
        )}

        {filteredSections.map(({ section, items }) => (
          <div key={section} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full bg-brand-primary"></span>
              <h2 className="text-2xl font-bold text-white">{section}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <ModelCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelsPage;
