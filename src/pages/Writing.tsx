import React from 'react';
import { Helmet } from 'react-helmet-async';
import { institutionalWriting, selectedEssays } from '../data/writing';

const WritingPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
      <Helmet>
        <title>Writing | Shravani Karra</title>
        <meta name="description" content="Essays on data, decision-making, and building systems under real-world constraints." />
      </Helmet>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Writing</p>
        <h1 className="text-4xl font-bold text-white">Writing</h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          I write about data, decision-making, and building systems under real-world constraints.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Selected Essays</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedEssays.map(essay => (
            <a
              key={essay.title}
              href={essay.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-brand-primary/60 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{essay.source}</span>
                <span>{essay.year}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{essay.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{essay.description}</p>
            </a>
          ))}
        </div>
        <a
          href="https://medium.com/@kindlingthoughts"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline"
        >
          View all writing on Medium →
        </a>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Institutional Writing</h2>
        <div className="space-y-3">
          {institutionalWriting.map(item => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-brand-primary/60 transition-colors"
            >
              <p className="text-xs text-slate-400">{item.orgLabel}</p>
              <h3 className="text-lg font-semibold text-white mt-1">{item.title}</h3>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WritingPage;
