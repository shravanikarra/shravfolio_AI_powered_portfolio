import React, { useState, useEffect } from 'react';
import { FALLBACK_PROJECTS } from './constants';
import SkillGraph from './components/SkillGraph';
import ProjectCard from './components/ProjectCard';
import ChatWidget from './components/ChatWidget';
import { fetchGitHubRepos, mapRepoToProject } from './services/githubService';
import { analyzeRepos } from './services/geminiService';
import { Project } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [loadingLog, setLoadingLog] = useState<string[]>([]);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactSubject, setContactSubject] = useState('Collaboration');
  const [contactMessage, setContactMessage] = useState('');

  // GitHub Username to sync
  const GITHUB_USERNAME = 'shravanikarra';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const addLog = (msg: string) => setLoadingLog(prev => [...prev, msg]);

      addLog(`Connecting to GitHub API...`);
      addLog(`Fetching repositories for user: ${GITHUB_USERNAME}...`);
      
      const repos = await fetchGitHubRepos(GITHUB_USERNAME);
      
      if (repos.length > 0) {
        addLog(`Found ${repos.length} repositories.`);
        addLog(`Igniting Gemini Neural Core...`);
        addLog(`Analyzing latent features of projects...`);
        
        // Analyze with Gemini
        const analysisResults = await analyzeRepos(repos);
        
        if (analysisResults.length > 0) {
           addLog(`Classifying projects into 3 Pillars...`);
           
           const newProjects: Project[] = [];
           
           // Map analysis back to repos
           analysisResults.forEach((analysis: any) => {
              const originalRepo = repos.find(r => r.id === analysis.id);
              if (originalRepo) {
                newProjects.push(mapRepoToProject(originalRepo, analysis));
              }
           });

           if (newProjects.length > 0) {
             setProjects(newProjects);
             addLog(`Successfully indexed ${newProjects.length} ML projects.`);
           } else {
             addLog(`Warning: No ML projects identified by AI. Using archives.`);
           }
        } else {
           addLog(`Neural Link unstable. Using cached archival data.`);
        }
      } else {
        addLog(`No repositories found or connection failed.`);
      }

      addLog(`System Ready.`);
      setTimeout(() => setLoading(false), 800);
    };

    loadData();
  }, []);

  // Define exact order for the filter tabs
  const categories = [
    'All',
    'The End-to-End',
    'The Business Value',
    'The Deep Dive'
  ];

  const filteredProjects = projects.filter(p => 
    filter === 'All' || p.category === filter
  );

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(id);
    const element = document.getElementById('project-grid');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Hi Shravani,\n\n${contactMessage}\n\nBest,\n${contactName}`;
    const mailtoLink = `mailto:shravanikarra1@gmail.com?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-brand-primary font-mono flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 animate-pulse">ShravFolio Initialization</h1>
          <div className="bg-black/50 rounded-lg border border-brand-primary/30 p-4 h-64 overflow-y-auto font-mono text-sm shadow-[0_0_30px_rgba(56,189,248,0.2)]">
            {loadingLog.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-brand-primary">{log}</span>
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-primary selection:text-black animate-fade-in">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">
              ShravFolio
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-mono text-slate-400">
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Github</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-10 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Shravani Karra <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-teal-400 to-brand-accent animate-pulse">
                Data & ML Engineer
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Senior Data Analyst at Rivian | Duke University MQM Alum | Ex-Goldman Sachs.
              <br/>
              Over 6 years of experience in Data Engineering & Machine Learning.
            </p>
        </div>

        {/* Graph Visualization */}
        <div id="graph" className="h-[60vh] w-full mb-20 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           <SkillGraph projects={projects} onProjectClick={handleProjectClick} />
        </div>
      </section>

      {/* Project Grid Section */}
      <section id="projects" className="bg-slate-950 py-20 px-4">
        <div className="max-w-7xl mx-auto" id="project-grid">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="w-2 h-8 bg-brand-primary rounded"></span>
              Selected Projects
            </h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${filter === cat 
                      ? 'bg-brand-primary text-slate-900 shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
                      : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isActive={selectedProjectId === project.id}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-900 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand-primary/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-xl mx-auto relative z-10 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Let's Connect</h2>
            <p className="text-slate-400">
              Interested in collaborating or have a question? Send me a message directly.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input
                type="text"
                id="name"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none"
                placeholder="Your Name"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
              <select
                id="subject"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none appearance-none"
              >
                 <option value="Collaboration Proposal">Collaboration Proposal</option>
                 <option value="Job Opportunity">Job Opportunity</option>
                 <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">Message</label>
              <textarea
                id="message"
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none resize-none"
                placeholder="How can we work together?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-slate-900 font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 text-center">
        <p className="text-slate-500 text-sm mb-4">
          Built with React, D3.js, and Gemini API.
        </p>
        <div className="flex justify-center gap-6 text-slate-400">
           <a href="http://linkedin.com/in/shravani-karra" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">LinkedIn</a>
           <a href="https://github.com/shravanikarra" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">GitHub</a>
           <a href="mailto:shravanikarra1@gmail.com" className="hover:text-brand-primary">Email</a>
        </div>
      </footer>

      {/* AI Assistant */}
      <ChatWidget />
    </div>
  );
};

export default App;