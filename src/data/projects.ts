export interface ProjectLinkSet {
  github?: string;
  live?: string;
  notebook?: string;
}

export interface PortfolioProject {
  id: string;
  repoName: string;
  displayName: string;
  description: string;
  tags: string[];
  links: ProjectLinkSet;
}

export const projects: PortfolioProject[] = [
  {
    id: "shravfolio",
    repoName: "shravfolio_AI_powered_portfolio",
    displayName: "AI-Powered Portfolio",
    description: "Interactive portfolio that syncs GitHub projects, classifies them into pillars, and visualizes skills with D3.",
    tags: ["React", "Vite", "TypeScript", "LLMs", "D3"],
    links: {
      live: "https://shravfolio-ai-powered-portfolio.vercel.app",
      github: "https://github.com/shravanikarra/shravfolio_AI_powered_portfolio"
    }
  },
  {
    id: "immigame",
    repoName: "immigame",
    displayName: "Immigame",
    description: "Immigration journey planner that turns intent into a structured, trackable plan with AI guidance.",
    tags: ["React", "Vite", "Firebase", "Auth", "LLMs"],
    links: {
      live: "https://immigame.com",
      github: "https://github.com/shravanikarra/immigame"
    }
  },
  {
    id: "bike-sharing-system",
    repoName: "bike-sharing-system",
    displayName: "Bike Sharing Demand Model",
    description: "Regression/classification notebooks for bike rental demand with feature engineering and validation.",
    tags: ["Regression", "scikit-learn", "Pandas", "Notebooks"],
    links: {
      github: "https://github.com/shravanikarra/bike-sharing-system"
    }
  },
  {
    id: "credit-card-fraud",
    repoName: "credit_card_fraud_detection_system",
    displayName: "Credit Card Fraud Detection",
    description: "Rare-event detection workflows with class imbalance handling, threshold tuning, and model inspection.",
    tags: ["Classification", "XGBoost", "Imbalanced", "Evaluation"],
    links: {
      github: "https://github.com/shravanikarra/credit_card_fraud_detection_system"
    }
  },
  {
    id: "retail-forecast",
    repoName: "retail_giant_sales_forecasting",
    displayName: "Retail Sales Forecasting",
    description: "Time series forecasting with seasonality and promotion features, plus rolling error analysis.",
    tags: ["Forecasting", "Time Series", "Feature Engineering"],
    links: {
      github: "https://github.com/shravanikarra/retail_giant_sales_forecasting"
    }
  },
  {
    id: "asset-simulation",
    repoName: "asset_return_simulation",
    displayName: "Asset Return Simulation",
    description: "Simulation notebooks to stress-test financial return assumptions and backtesting logic.",
    tags: ["Simulation", "Backtesting", "Jupyter"],
    links: {
      github: "https://github.com/shravanikarra/asset_return_simulation"
    }
  }
];
