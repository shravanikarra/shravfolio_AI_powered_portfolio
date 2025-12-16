import React from 'react';
import { Helmet } from 'react-helmet-async';
import { models } from '../data/models';

const Section: React.FC<{ title: string; items: { title: string; description: string; tags: string[] }[] }> = ({
  title,
  items,
}) => (
  <div className="space-y-3">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 space-y-2">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModelsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
      <Helmet>
        <title>Models & Methods | Shravani Karra</title>
        <meta
          name="description"
          content="Machine learning methods explored through applied projects, with emphasis on evaluation, tradeoffs, and practical use."
        />
      </Helmet>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Models</p>
        <h1 className="text-4xl font-bold text-white">Models & Methods</h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          This section documents machine learning methods explored through applied projects, with an emphasis on evaluation,
          tradeoffs, and practical use.
        </p>
      </div>

      <Section title="Prediction" items={models.prediction} />
      <Section title="Pattern Discovery" items={models.patterns} />
      <Section title="NLP / LLM Work" items={models.nlp} />
    </div>
  );
};

export default ModelsPage;
