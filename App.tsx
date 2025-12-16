import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProjectCard from './components/ProjectCard';
import ChatWidget from './components/ChatWidget';
import { FALLBACK_PROJECTS } from './constants';
import { analyzeRepos } from './services/geminiService';
import { fetchGitHubRepos, mapRepoToProject } from './services/githubService';
import { Project } from './types';
import SystemsPage from './src/pages/Systems';
import ModelsPage from './src/pages/Models';
import WritingPage from './src/pages/Writing';
import AboutPage from './src/pages/About';

const GITHUB_USERNAME = 'shravanikarra';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
    isActive
      ? 'text-white border-brand-primary'
      : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
  }`;

const HomePage: React.FC<{
  projects: Project[];
  loading: boolean;
  loadingLog: string[];
}> = ({ projects, loading, loadingLog }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-brand-primary font-mono flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Loading work</h1>
          <div className="bg-black/40 rounded-lg border border-brand-primary/20 p-4 h-56 overflow-y-auto text-sm">
            {loadingLog.map((log, i) => (
              <div key={i} className="mb-1 text-slate-300">
                <span className="text-slate-500 mr-2">•</span>
                {log}
              </div>
            ))}
            <div className="animate-pulse text-brand-primary">...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shravani Karra | Data & AI Systems Engineer</title>
        <meta
          name="description"
          content="Portfolio of Shravani Karra — Data & AI Systems Engineer focused on analytics, software, and applied machine learning."
        />
      </Helmet>

      <section className="pt-28 pb-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Work</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Shravani Karra</h1>
            <p className="text-xl text-brand-primary font-semibold mt-1">Data & AI Systems Engineer</p>
            <p className="text-lg text-slate-300 mt-3 max-w-3xl leading-relaxed">
              Senior Data Analyst at Rivian · Duke MQM Alum · Ex–Goldman Sachs
              <br />
              Building data-driven systems at the intersection of analytics, software, and applied ML.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <NavLink
                to="/systems"
                className="px-4 py-2 rounded-lg bg-brand-primary text-slate-900 font-semibold shadow-sm hover:opacity-90 transition"
              >
                View Systems
              </NavLink>
              <NavLink
                to="/writing"
                className="px-4 py-2 rounded-lg border border-slate-700 text-white hover:border-brand-primary hover:text-brand-primary transition"
              >
                Read Writing
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="pb-14 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-primary font-semibold">Selected Work</p>
            <h2 className="text-3xl font-bold text-white mt-2">A few projects across systems, analytics, and applied machine learning.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="project-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-primary selection:text-black">
      <nav className="sticky top-0 w-full z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-white">ShravFolio</div>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Work
            </NavLink>
            <NavLink to="/systems" className={navLinkClass}>
              Systems
            </NavLink>
            <NavLink to="/models" className={navLinkClass}>
              Models
            </NavLink>
            <NavLink to="/writing" className={navLinkClass}>
              Writing
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                location.pathname === '/github'
                  ? 'text-white border-brand-primary'
                  : 'text-slate-400 border-transparent hover:text-white hover:border-slate-700'
              }`}
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-4 text-center mt-12">
        <p className="text-slate-500 text-sm mb-4">Building data and AI systems with clarity and accountability.</p>
        <div className="flex justify-center gap-6 text-slate-400">
          <a href="http://linkedin.com/in/shravani-karra" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">
            LinkedIn
          </a>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">
            GitHub
          </a>
          <a href="mailto:shravanikarra1@gmail.com" className="hover:text-brand-primary">
            Email
          </a>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [loadingLog, setLoadingLog] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const addLog = (msg: string) => setLoadingLog(prev => [...prev, msg]);

      addLog('Connecting to GitHub API...');
      addLog(`Fetching repositories for user: ${GITHUB_USERNAME}...`);

      const repos = await fetchGitHubRepos(GITHUB_USERNAME);

      if (repos.length > 0) {
        addLog(`Found ${repos.length} repositories.`);
        addLog('Attempting Gemini classification...');

        const analysisResults = await analyzeRepos(repos);
        const newProjects: Project[] = [];

        if (analysisResults.length > 0) {
          addLog('Applying AI-powered summaries...');
          analysisResults.forEach((analysis: any) => {
            const originalRepo = repos.find((r: any) => r.id === analysis.id);
            if (originalRepo) {
              newProjects.push(mapRepoToProject(originalRepo, analysis));
            }
          });
        }

        if (newProjects.length === 0) {
          addLog('Using repository metadata to build project list.');
          repos.forEach((repo: any) => newProjects.push(mapRepoToProject(repo)));
        }

        if (newProjects.length > 0) {
          setProjects(newProjects);
          addLog(`Indexed ${newProjects.length} projects.`);
        }
      } else {
        addLog('No repositories found or connection failed.');
      }

      addLog('Ready.');
      setTimeout(() => setLoading(false), 400);
    };

    loadData();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage projects={projects} loading={loading} loadingLog={loadingLog} />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
