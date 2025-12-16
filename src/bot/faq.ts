export interface FAQIntent {
  id: string;
  title: string;
  keywords: string[];
  response: string;
  suggestedQuestions?: string[];
}

export const faqIntents: FAQIntent[] = [
  {
    id: "about_creator",
    title: "About Shravani",
    keywords: ["who", "shravani", "karra", "creator", "about you"],
    response:
      "Shravani Karra is a Data & AI Systems Engineer and Senior Data Analyst at Rivian, Duke MQM alum, and former Goldman Sachs engineer. She focuses on building reliable data systems, applied ML workflows, and clear interfaces for decision-making.",
    suggestedQuestions: ["What skills do you use most often?", "How do you approach model evaluation?"]
  },
  {
    id: "about_portfolio",
    title: "About this portfolio",
    keywords: ["portfolio", "site", "navigate", "sections", "structure", "home"],
    response:
      "This portfolio is organized into Systems, Models, and Writing. Systems highlight end-to-end applications, Models cover ML methods and evidence, and Writing links to essays. Use the top navigation or ask me for a specific area.",
    suggestedQuestions: ["Show me systems", "What models are documented?", "Where is the writing page?"]
  },
  {
    id: "systems",
    title: "Systems overview",
    keywords: ["systems", "apps", "products", "end-to-end", "portfolio system"],
    response:
      "Systems are end-to-end applications that connect data, logic, and interfaces. Featured systems include the AI-Powered Portfolio and Immigame. Each system lists the problem, approach, stack, and links to live/GitHub where available.",
    suggestedQuestions: ["Tell me about Immigame", "What stack does the AI portfolio use?"]
  },
  {
    id: "ml_models",
    title: "ML models overview",
    keywords: ["models", "ml", "methods", "library", "notebooks", "experiments"],
    response:
      "The Models & Methods library groups work across supervised learning (regression/classification, ensembles, boosting), time series forecasting, clustering and anomaly detection, deep learning for vision, NLP/LLM prompting, and evaluation/interpretability practices. Browse /models for the taxonomy and evidence links to notebooks/repos.",
    suggestedQuestions: ["Show ML experiments", "How do you handle evaluation?"]
  },
  {
    id: "skills",
    title: "Skills",
    keywords: ["skills", "stack", "tech", "tools", "languages"],
    response:
      "Data: SQL, Pandas, dbt style modeling. ML: scikit-learn, XGBoost, PyTorch, forecasting, anomaly detection. Engineering: React, TypeScript, Vite, APIs, Firebase/Auth. MLOps/Cloud: basic Docker, CI/CD habits, and reproducible notebooks.",
    suggestedQuestions: ["What ML libraries do you use?", "How do you deploy?"]
  },
  {
    id: "contact",
    title: "Contact",
    keywords: ["contact", "email", "reach", "connect", "linkedin"],
    response:
      "You can reach Shravani via email at shravanikarra1@gmail.com or on LinkedIn (linkedin.com/in/shravani-karra). GitHub: github.com/shravanikarra.",
    suggestedQuestions: ["What is your email?", "Share your LinkedIn"]
  },
  {
    id: "resume",
    title: "Resume",
    keywords: ["resume", "cv"],
    response:
      "If you need a resume, share a quick note with your context and I’ll provide the latest version via email.",
    suggestedQuestions: ["How do I request your resume?"]
  },
  {
    id: "immigame",
    title: "Immigame",
    keywords: ["immigame", "immigration", "journey", "visa"],
    response:
      "Immigame is an immigration journey planning platform that turns a user’s intent into a structured, trackable plan with AI-assisted guidance. Live: https://immigame.com, GitHub: https://github.com/shravanikarra/immigame.",
    suggestedQuestions: ["What problem does Immigame solve?", "What stack does Immigame use?"]
  },
  {
    id: "tech_stack",
    title: "Tech stack",
    keywords: ["stack", "tech", "frontend", "backend", "llm"],
    response:
      "This site uses React + Vite + TypeScript with a lightweight D3 visualization. ML work spans scikit-learn, XGBoost, PyTorch, and LLM prompting experiments. Systems leverage modern frontend patterns and pragmatic APIs.",
    suggestedQuestions: ["How is the site built?", "What ML stack do you prefer?"]
  },
  {
    id: "help",
    title: "Help",
    keywords: ["help", "what can you do", "examples", "suggestions"],
    response:
      "Ask about systems, ML methods, skills, or how to navigate. Try: “Show ML projects”, “Tell me about Immigame”, “What models have you used?”, or “How do I contact you?”",
    suggestedQuestions: ["Show ML projects", "Tell me about Immigame", "How do I navigate?"]
  }
];
