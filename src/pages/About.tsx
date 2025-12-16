import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
      <Helmet>
        <title>About | Shravani Karra</title>
        <meta
          name="description"
          content="Data and AI systems engineer focused on analytics, software craftsmanship, and applied machine learning with clear impact."
        />
      </Helmet>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">About</p>
        <h1 className="text-4xl font-bold text-white">About</h1>
      </div>

      <div className="space-y-3 text-slate-300 leading-relaxed text-lg max-w-4xl">
        <p>
          I design and build data-centric systems that connect analytics, engineering, and applied machine learning to clear outcomes.
        </p>
        <p>
          My focus is on reliable pipelines, interpretable models, and interfaces that surface signal without hiding tradeoffs. Strong
          judgment, measurable impact, and maintainable code guide how I work.
        </p>
        <p>
          Recent work spans analytic products at Rivian, experimentation with applied ML, and thoughtful documentation that keeps teams
          aligned.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
