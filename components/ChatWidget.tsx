import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  getContactInfo,
  getModelCategoryDetail,
  getModelsOverview,
  getProjectDetail,
  getProjectList,
  getShravaniSummary,
  getSystemsList
} from '../src/bot/offlineResponder';

type AssistantState =
  | 'home'
  | 'about_shravani'
  | 'projects_menu'
  | 'project_detail'
  | 'systems_menu'
  | 'models_menu'
  | 'contact';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi! I’m the Smart Portfolio Assistant. Choose an option below to explore Shravani’s work.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<AssistantState>('home');
  const [stateStack, setStateStack] = useState<AssistantState[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const pushState = (next: AssistantState) => {
    setStateStack(prev => [...prev, state]);
    setState(next);
  };

  const goBack = () => {
    setStateStack(prev => {
      if (prev.length === 0) {
        setState('home');
        return prev;
      }
      const copy = [...prev];
      const last = copy.pop() as AssistantState;
      setState(last);
      return copy;
    });
  };

  const addMessage = (role: 'user' | 'model', text: string) => {
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${role}-${prev.length}`, role, text, timestamp: new Date() }
    ]);
  };

  const handleAction = (label: string, nextState?: AssistantState, payload?: any) => {
    addMessage('user', label);
    setIsLoading(true);

    setTimeout(() => {
      switch (label) {
        case 'Talk about Shravani Karra':
          addMessage('model', getShravaniSummary());
          pushState('about_shravani');
          break;
        case 'Talk about a project':
          addMessage('model', 'Select a project to view details.');
          pushState('projects_menu');
          break;
        case 'Systems':
          addMessage('model', 'Here are the systems available:');
          pushState('systems_menu');
          break;
        case 'ML Models & Methods':
          addMessage('model', getModelsOverview());
          pushState('models_menu');
          break;
        case 'Contact':
          addMessage('model', getContactInfo());
          pushState('contact');
          break;
        default:
          break;
      }

      if (nextState === 'project_detail' && payload?.id) {
        const detail = getProjectDetail(payload.id);
        setSelectedProjectId(payload.id);
        addMessage('model', detail.text);
        pushState('project_detail');
      }

      if (nextState === 'systems_menu' && payload?.text) {
        addMessage('model', payload.text);
      }

      if (nextState === 'models_menu' && payload?.category) {
        addMessage('model', getModelCategoryDetail(payload.category));
      }

      if (nextState === 'home') {
        setState('home');
        setStateStack([]);
        addMessage('model', 'Restarted. How can I help?');
      }

      setIsLoading(false);
    }, 120);
  };

  const handleStartOver = () => handleAction('Start over', 'home');

  const projectList = getProjectList();
  const systemList = getSystemsList();
  const modelCategories = [
    'Regression',
    'Classification',
    'Tree-based',
    'Boosting',
    'Clustering',
    'Anomaly Detection',
    'Time Series',
    'Deep Learning',
    'NLP/LLMs'
  ];

  const renderOptions = () => {
    if (state === 'home') {
      const options = [
        'Talk about Shravani Karra',
        'Talk about a project',
        'Systems',
        'ML Models & Methods',
        'Contact'
      ];
      return options.map(opt => (
        <button
          key={opt}
          onClick={() => handleAction(opt)}
          className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
        >
          {opt}
        </button>
      ));
    }

    if (state === 'projects_menu') {
      return (
        <>
          {projectList.map(p => (
            <button
              key={p.id}
              onClick={() => handleAction(p.displayName, 'project_detail', { id: p.id })}
              className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors text-left"
            >
              {p.displayName}
            </button>
          ))}
          <button
            onClick={goBack}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Back
          </button>
        </>
      );
    }

    if (state === 'project_detail' && selectedProjectId) {
      const detail = getProjectDetail(selectedProjectId);
      return (
        <>
          {detail.links?.live && (
            <a
              href={detail.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm bg-brand-primary text-slate-900 font-semibold hover:opacity-90 transition-colors text-center"
            >
              Open Live
            </a>
          )}
          {detail.links?.github && (
            <a
              href={detail.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors text-center"
            >
              Open GitHub
            </a>
          )}
          {detail.links?.notebook && (
            <a
              href={detail.links.notebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors text-center"
            >
              Open Notebook
            </a>
          )}
          <button
            onClick={() => handleAction('Back to Projects', 'projects_menu')}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Back to Projects
          </button>
        </>
      );
    }

    if (state === 'systems_menu') {
      return (
        <>
          {systemList.map(s => (
            <button
              key={s.id}
              onClick={() =>
                handleAction(
                  s.displayName,
                  'systems_menu',
                  { id: s.id, text: `${s.displayName}: ${s.problem} Approach: ${s.approach}` }
                )
              }
              className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors text-left"
            >
              {s.displayName}
            </button>
          ))}
          <button
            onClick={goBack}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Back
          </button>
        </>
      );
    }

    if (state === 'models_menu') {
      return (
        <>
          {modelCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleAction(cat, 'models_menu', { category: cat })}
              className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors text-left"
            >
              {cat}
            </button>
          ))}
          <button
            onClick={goBack}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Back
          </button>
        </>
      );
    }

    if (state === 'about_shravani' || state === 'contact') {
      return (
        <>
          <button
            onClick={goBack}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleStartOver}
            className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
          >
            Start over
          </button>
        </>
      );
    }

    return (
      <button
        onClick={handleStartOver}
        className="px-3 py-2 rounded-lg text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-brand-primary/60 transition-colors"
      >
        Start over
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[520px] bg-slate-900 border border-brand-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Offline"></div>
              <span className="font-bold text-white font-mono">Smart Portfolio Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] p-3 rounded-lg text-sm
                    ${msg.role === 'user' 
                      ? 'bg-brand-primary text-slate-900 rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none border border-slate-700 flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-3">
            <div className="flex flex-wrap gap-2">
              {renderOptions()}
            </div>
            <div className="text-xs text-slate-500">
              Guided mode is offline and uses local portfolio data. No internet calls are made.
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-110
          ${isOpen ? 'bg-slate-700 text-white rotate-90' : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-900'}
        `}
      >
        {isOpen ? (
          <span className="text-2xl font-bold">✕</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
